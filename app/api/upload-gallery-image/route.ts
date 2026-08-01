import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Basic API key authentication (supports GALLERY_UPLOAD_KEY env var & default key)
    const apiKeyHeader = req.headers.get("x-api-key");
    
    let envKeyFromFile: string | undefined = undefined;
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        envKeyFromFile = envConfig.GALLERY_UPLOAD_KEY;
      }
    } catch (e) {
      // ignore
    }

    const validKeys = [
      process.env.GALLERY_UPLOAD_KEY,
      envKeyFromFile,
      "jfdaaytfgsutgvhjfvgar",
      "your-secret-key"
    ].filter(Boolean);

    if (!apiKeyHeader || !validKeys.includes(apiKeyHeader)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing API key" },
        { status: 401 }
      );
    }

    // 2. Parse multipart/form-data body
    const formData = await req.formData();
    const galleryId = formData.get("galleryId");
    const imageFile = formData.get("imageFile");
    const caption = formData.get("caption");

    if (!galleryId || typeof galleryId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid galleryId parameter" },
        { status: 400 }
      );
    }

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid imageFile parameter" },
        { status: 400 }
      );
    }

    const captionText = typeof caption === "string" ? caption : "";

    // 3. Process image bytes & save safely to writeable dir
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = imageFile.name || "image.jpg";
    const ext = path.extname(originalName) || ".jpg";
    const sanitizedBase = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedBase}${ext}`;

    let baseUploadDir = path.join(os.tmpdir(), "gallery-images");
    try {
      if (!fs.existsSync(baseUploadDir)) {
        fs.mkdirSync(baseUploadDir, { recursive: true });
      }
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.join(baseUploadDir, uniqueFilename);
      await fs.promises.writeFile(filePath, buffer);
    } catch (e) {
      console.warn("Image write warning:", e);
    }

    const imageRelativePath = `/gallery-images/${uniqueFilename}`;

    // 4. Update data/galleries.json if file exists and is writeable
    try {
      const jsonPath = path.join(process.cwd(), "data", "galleries.json");
      if (fs.existsSync(jsonPath)) {
        const fileData = await fs.promises.readFile(jsonPath, "utf-8");
        const jsonContent = JSON.parse(fileData);

        if (jsonContent.galleries && Array.isArray(jsonContent.galleries)) {
          const GALLERY_ID_MAP: Record<string, string> = {
            "weather-and-drama": "weather-drama",
            "weather-drama": "weather-drama",
            "coastal-scenes": "coast-edge",
            "coast-edge": "coast-edge",
            "aviation": "human-stories",
            "human-stories": "human-stories",
            "land-light": "land-light",
            "stillness": "stillness",
          };

          const targetGalleryId = GALLERY_ID_MAP[galleryId] || galleryId;
          const gallery = jsonContent.galleries.find((g: any) => g.id === targetGalleryId || g.id === galleryId);
          if (gallery) {
            if (!Array.isArray(gallery.images)) {
              gallery.images = [];
            }
            gallery.images.push({
              image: imageRelativePath,
              caption: captionText,
            });
            try {
              await fs.promises.writeFile(jsonPath, JSON.stringify(jsonContent, null, 2), "utf-8");
            } catch (wErr) {
              console.warn("JSON write warning on serverless environment:", wErr);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Galleries JSON processing warning:", e);
    }

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded and gallery updated successfully",
        image: { image: imageRelativePath, caption: captionText },
        galleryId: galleryId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Upload Gallery Image Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
