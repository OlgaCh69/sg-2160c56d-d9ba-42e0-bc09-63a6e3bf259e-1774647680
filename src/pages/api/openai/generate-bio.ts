import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { generationId } = req.body;

  if (!generationId) {
    return res.status(400).json({ error: "Generation ID is required" });
  }

  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey || openaiKey === "your_openai_api_key_here") {
    console.warn("OpenAI API key not configured - returning mock bios");
    
    // Return mock bios for demo
    return res.status(200).json({
      funny: "6'2\" because apparently that matters more than my sparkling personality 😂 Dog dad, taco enthusiast, and I promise I'm funnier in person (low bar, I know)",
      confident: "Entrepreneur building something meaningful. Fitness enthusiast who believes in balance. Looking for someone who can keep up with deep conversations and spontaneous adventures.",
      simple: "Love traveling, cooking, and staying active. Looking for genuine connections. Let's grab coffee and see where things go.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert dating profile writer. Create three distinct dating profile bios: one funny/witty, one confident/ambitious, and one simple/authentic. Each bio should be 2-3 sentences, engaging, and optimized for dating apps like Tinder and Bumble. Target audience: men aged 18-35.",
          },
          {
            role: "user",
            content: "Generate three dating profile bios in different styles.",
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API error");
    }

    const content = data.choices[0].message.content;
    
    // Parse the response (assuming structured output)
    const bios = {
      funny: content.split("Funny:")[1]?.split("Confident:")[0]?.trim() || "",
      confident: content.split("Confident:")[1]?.split("Simple:")[0]?.trim() || "",
      simple: content.split("Simple:")[1]?.trim() || "",
    };

    return res.status(200).json(bios);
  } catch (error) {
    console.error("OpenAI bio generation error:", error);
    return res.status(500).json({ 
      error: "Failed to generate bios",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}