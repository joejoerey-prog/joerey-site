import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("[AI API] Starting request...");
  try {
    const { imageUrl } = await req.json();
    console.log(`[AI API] Image URL: ${imageUrl}`);

    if (!imageUrl) {
      console.error("[AI API] Error: Image URL is missing");
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
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

    console.log("[AI API] Sending request to OpenAI...");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You're an advanced AI image analysis tool that specializes in providing detailed artistic descriptions. Your task is to analyze an uploaded image and generate a concise description. 

---

The image will be analyzed to determine the key elements and focal points that capture its essence.

---

The tone should be casual and friendly, making the description engaging for a broad audience. 

---

The output should be a text-only response, formatted for easy copying and pasting, with a maximum length of 200 words. 

--- 

Please provide a captivating artistic description of the image while focusing on its unique aspects and visual appeal.`,
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
    });

    const caption = response.choices[0].message.content;
    console.log("[AI API] Success! Caption generated.");
    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error("[AI API] Error occurred:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
