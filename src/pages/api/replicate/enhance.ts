import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl, isPremium, generationId } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const replicateToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateToken || replicateToken === "your_replicate_api_token_here") {
    console.warn("Replicate API token not configured - returning mock response");
    
    // Return mock response for demo purposes
    return res.status(200).json({
      id: `mock-${Date.now()}`,
      status: "succeeded",
      output: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      ],
    });
  }

  try {
    // Call Replicate API for photo enhancement
    // Using a popular photo enhancement model (adjust model as needed)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3", // Example: Stable Diffusion XL
        input: {
          image: imageUrl,
          prompt: "professional headshot, high quality, attractive lighting, dating profile photo",
          negative_prompt: "blurry, low quality, distorted",
          num_outputs: isPremium ? 3 : 2,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Replicate API error");
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Replicate API error:", error);
    return res.status(500).json({ 
      error: "Failed to enhance photo",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}