import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Prediction ID is required" });
  }

  const replicateToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateToken || replicateToken === "your_replicate_api_token_here") {
    // Return mock success response for demo
    return res.status(200).json({
      id,
      status: "succeeded",
      output: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      ],
    });
  }

  try {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          "Authorization": `Token ${replicateToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch prediction status");
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Replicate status check error:", error);
    return res.status(500).json({ 
      error: "Failed to check generation status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}