import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
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

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || undefined,
        metadata: {
          userId: userId,
        },
      });

      customerId = customer.id;

      // Save customer ID to database
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/results?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upload`,
      metadata: {
        userId: userId,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}