import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("[AI API] Request received");
  
  try {
    const body = (await req.json()) as { imageUrl?: string };
    const imageUrl = body.imageUrl || "";
    
    // Fallback: Manually load .env.local if GITHUB_TOKEN is missing
    if (!process.env.GITHUB_TOKEN) {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
          process.env[k] = envConfig[k];
        }
      }
    }

    const apiKey = process.env.GITHUB_TOKEN;
    
    if (!apiKey) {
      console.error("[AI API] GITHUB_TOKEN is still missing after fallback check");
      return NextResponse.json({ error: "API configuration missing (GITHUB_TOKEN). Please restart your server or check .env.local" }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You're an advanced AI image analysis tool. Provide a captivating, concise, and friendly artistic description of the image (max 200 words).",
        },
        {
          role: "user",
          content: [{ type: "image_url", image_url: { url: imageUrl } }],
        },
      ],
      model: "gpt-4o-mini",
    });

    return NextResponse.json({ caption: response.choices[0].message.content });
  } catch (error: any) {
    console.error("[AI API] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
