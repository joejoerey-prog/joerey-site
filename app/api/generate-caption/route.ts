import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

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
    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
