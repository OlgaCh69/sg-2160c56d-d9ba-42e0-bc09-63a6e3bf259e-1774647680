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
    console.warn("OpenAI API key not configured - returning mock messages");
    
    // Return mock opening messages for demo
    return res.status(200).json({
      messages: [
        "I noticed you're into [hobby from profile]. What got you started with that?",
        "Your photos have serious main character energy. Which one has the best story behind it?",
        "Quick question: best travel destination you've been to, or top of your bucket list?",
        "[Witty observation about their profile] - okay that's my icebreaker, your turn 😊",
        "I have a very important question... [ask about something fun from their profile]",
      ],
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
            content: "You are an expert at writing engaging dating app opening messages. Create 5 distinct, creative opening lines that are personalized, witty, and likely to get responses. Avoid generic lines. Each message should be 1-2 sentences. Include placeholders like [hobby], [interest], or [photo detail] where personalization would be needed.",
          },
          {
            role: "user",
            content: "Generate 5 engaging opening messages for dating apps.",
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
    
    // Parse messages (split by newlines and filter empty)
    const messages = content
      .split("\n")
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line: string) => line.length > 10);

    return res.status(200).json({ messages: messages.slice(0, 5) });
  } catch (error) {
    console.error("OpenAI message generation error:", error);
    return res.status(500).json({ 
      error: "Failed to generate messages",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}