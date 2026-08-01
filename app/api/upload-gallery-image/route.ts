import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

function getApiKey(): string {
  if (process.env.GALLERY_UPLOAD_KEY) {
    return process.env.GALLERY_UPLOAD_KEY;
  }
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (envConfig.GALLERY_UPLOAD_KEY) {
      return envConfig.GALLERY_UPLOAD_KEY;
    }
  }
  return "jfdaaytfgsutgvhjfvgar";
}

export async function POST(req: Request) {
  try {
    // 1. Basic API key authentication
    const apiKeyHeader = req.headers.get("x-api-key");
    const expectedApiKey = getApiKey();

    if (!expectedApiKey || !apiKeyHeader || apiKeyHeader !== expectedApiKey) {
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

    // 3. Save uploaded image file to public/gallery-images/ with a unique filename
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = imageFile.name || "image.jpg";
    const ext = path.extname(originalName) || ".jpg";
    const sanitizedBase = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedBase}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "gallery-images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);

    const imageRelativePath = `/gallery-images/${uniqueFilename}`;

    // 4. Read data/galleries.json, append image object, write updated JSON back
    const jsonPath = path.join(process.cwd(), "data", "galleries.json");
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: "Server Error: data/galleries.json not found" },
        { status: 500 }
      );
    }

    const fileData = await fs.promises.readFile(jsonPath, "utf-8");
    const jsonContent = JSON.parse(fileData);

    if (!jsonContent.galleries || !Array.isArray(jsonContent.galleries)) {
      return NextResponse.json(
        { error: "Server Error: Invalid galleries.json structure" },
        { status: 500 }
      );
    }

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
    if (!gallery) {
      return NextResponse.json(
        { error: `Gallery not found for ID: ${galleryId}` },
        { status: 404 }
      );
    }

    if (!Array.isArray(gallery.images)) {
      gallery.images = [];
    }

    const newImageObj = {
      image: imageRelativePath,
      caption: captionText,
    };

    gallery.images.push(newImageObj);

    await fs.promises.writeFile(jsonPath, JSON.stringify(jsonContent, null, 2), "utf-8");

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded and gallery updated successfully",
        image: newImageObj,
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
