import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import Stripe from "stripe";

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body
const getRawBody = async (req: NextApiRequest): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers["stripe-signature"] as string;

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    console.log("Stripe webhook event:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).json({
      error: "Webhook handler failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await supabase.from("usage_limits").upsert({
    user_id: userId,
    subscription_status: "premium",
    stripe_subscription_id: subscriptionId,
    subscription_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
  });

  console.log(`User ${userId} upgraded to premium`);
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) return;

  const status = subscription.status === "active" ? "premium" : "free";

  await supabase.from("usage_limits").upsert({
    user_id: profile.id,
    subscription_status: status,
    stripe_subscription_id: subscription.id,
    subscription_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
  });

  console.log(`Subscription updated for user ${profile.id}: ${status}`);
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) return;

  await supabase.from("usage_limits").upsert({
    user_id: profile.id,
    subscription_status: "free",
    stripe_subscription_id: null,
    subscription_period_end: null,
  });

  console.log(`Subscription cancelled for user ${profile.id}`);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // Additional logic if needed (e.g., send confirmation email)
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed for invoice ${invoice.id}`);
  // Additional logic if needed (e.g., send reminder email)
}