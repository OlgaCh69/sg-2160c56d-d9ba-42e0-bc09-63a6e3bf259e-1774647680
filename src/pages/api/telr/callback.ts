import type { NextApiRequest, NextApiResponse } from "next";
import { verifyTelrTransaction } from "@/lib/telr";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { status, order_ref } = req.query;

    if (!order_ref || typeof order_ref !== "string") {
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=error`);
    }

    // Handle different payment statuses
    if (status === "cancelled") {
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=cancelled`);
    }

    if (status === "declined") {
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=declined`);
    }

    // Verify transaction with Telr
    const verification = await verifyTelrTransaction(order_ref);

    if (verification.error) {
      console.error("Telr verification error:", verification.error);
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=error`);
    }

    // Find user by order reference
    const { data: usageLimits } = await supabase
      .from("usage_limits")
      .select("user_id")
      .eq("telr_order_ref", order_ref)
      .single();

    if (!usageLimits?.user_id) {
      console.error("User not found for order:", order_ref);
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=error`);
    }

    // Update user subscription status to premium
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await supabase
      .from("usage_limits")
      .update({
        subscription_status: "premium",
        subscription_period_end: subscriptionEndDate.toISOString(),
        free_generations_limit: 999,
      })
      .eq("user_id", usageLimits.user_id);

    console.log(`User ${usageLimits.user_id} upgraded to premium via Telr`);

    // Redirect to results page with success message
    return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/results?upgraded=true`);
  } catch (error) {
    console.error("Telr callback error:", error);
    return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/upload?payment=error`);
  }
}