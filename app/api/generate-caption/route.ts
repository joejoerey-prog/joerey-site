import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("[AI API] Starting request...");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); 

  try {
    const { imageUrl } = await req.json();
    console.log(`[AI API] Processing Image URL: ${imageUrl}`);

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const apiKey = process.env.GITHUB_TOKEN;
    if (!apiKey) {
      return NextResponse.json({ error: "API configuration missing (GITHUB_TOKEN)" }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: apiKey,
    });

    console.log("[AI API] Sending to OpenAI...");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You're an advanced AI image analysis tool. Provide a captivating, concise, and friendly artistic description of the image (max 200 words).",
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
        signal: controller.signal
    });

    const caption = response.choices[0].message.content;
    console.log("[AI API] Success!");
    return NextResponse.json({ caption });
  } catch (error: any) {
    if (error.name === 'AbortError') {
        return NextResponse.json({ error: "Request timed out (60s)." }, { status: 504 });
    }
    // Check if it's an OpenAI error related to image accessibility
    const status = error.status || 500;
    console.error(`[AI API] Error (${status}):`, error.message);
    return NextResponse.json({ error: error.message }, { status });
  } finally {
    clearTimeout(timeoutId);
  }
}
