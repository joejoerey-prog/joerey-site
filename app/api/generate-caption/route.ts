import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("[AI API] Starting request...");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

  try {
    const { imageUrl } = await req.json();
    console.log(`[AI API] Image URL: ${imageUrl}`);

    if (!imageUrl) {
      console.error("[AI API] Error: Image URL is missing");
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // 1. Check if Image is publicly accessible first
    try {
        const headRes = await fetch(imageUrl, { method: 'HEAD', signal: controller.signal });
        if (!headRes.ok) {
            console.error(`[AI API] Image not accessible: ${headRes.status}`);
            return NextResponse.json({ error: `Image not accessible (HTTP ${headRes.status}). Check Appwrite permissions.` }, { status: 403 });
        }
        console.log("[AI API] Image is accessible.");
    } catch (e: any) {
        if (e.name === 'AbortError') throw new Error("Image accessibility check timed out.");
        console.warn("[AI API] Image HEAD check failed, but continuing anyway...", e.message);
    }

    const apiKey = process.env.GITHUB_TOKEN;
    if (!apiKey) {
      console.error("[AI API] Error: GITHUB_TOKEN is not set in environment");
      return NextResponse.json({ error: "API configuration missing (GITHUB_TOKEN)" }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: apiKey,
    });

    console.log("[AI API] Sending request to Azure/OpenAI...");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an advanced AI image analysis tool. Generate a concise, artistic, and friendly description (max 200 words) of the provided image.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      model: "gpt-4o-mini",
    }, {
        signal: controller.signal // Apply timeout to the OpenAI call
    });

    const caption = response.choices[0].message.content;
    console.log("[AI API] Success! Caption generated.");
    return NextResponse.json({ caption });
  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.error("[AI API] Request timed out (60s limit reached)");
        return NextResponse.json({ error: "Request timed out. The AI took too long to respond." }, { status: 504 });
    }
    console.error("[AI API] Error occurred:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
