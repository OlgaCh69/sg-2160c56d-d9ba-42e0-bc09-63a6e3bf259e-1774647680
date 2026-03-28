import type { NextApiRequest, NextApiResponse } from "next";
import { createTelrOrder } from "@/lib/telr";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, telr_customer_id")
      .eq("id", userId)
      .single();

    // Generate unique cart ID
    const cartId = `RIZZ-${userId.substring(0, 8)}-${Date.now()}`;

    // Create Telr payment order for €17 monthly subscription
    const order = await createTelrOrder(
      17.00, // €17/month
      "RizzAI Premium Subscription - Monthly",
      cartId,
      profile?.email,
      profile?.full_name
    );

    if (!order.order?.url) {
      throw new Error("Failed to create Telr payment order");
    }

    // Save order reference to user profile
    await supabase
      .from("profiles")
      .update({ 
        telr_customer_id: order.order.ref 
      })
      .eq("id", userId);

    // Store pending order in database
    await supabase
      .from("usage_limits")
      .upsert({
        user_id: userId,
        telr_order_ref: order.order.ref,
        subscription_status: "pending",
      });

    return res.status(200).json({ 
      paymentUrl: order.order.url,
      orderRef: order.order.ref 
    });
  } catch (error) {
    console.error("Telr payment creation error:", error);
    return res.status(500).json({
      error: "Failed to create payment session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}