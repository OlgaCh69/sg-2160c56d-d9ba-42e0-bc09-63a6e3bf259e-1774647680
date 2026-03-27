import { supabase } from "@/integrations/supabase/client";
import { getStripe } from "@/lib/stripe";

export const paymentService = {
  /**
   * Create a Stripe checkout session for premium subscription
   */
  createCheckoutSession: async (userId: string): Promise<void> => {
    try {
      // Call API route to create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error) {
      console.error("Checkout session error:", error);
      throw error;
    }
  },

  /**
   * Create a Stripe customer portal session for managing subscription
   */
  createPortalSession: async (userId: string): Promise<void> => {
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe customer portal
      window.location.href = url;
    } catch (error) {
      console.error("Portal session error:", error);
      throw error;
    }
  },

  /**
   * Get user's subscription status from database
   */
  getSubscriptionStatus: async (userId: string): Promise<{
    isPremium: boolean;
    status: string;
    currentPeriodEnd?: Date;
  }> => {
    try {
      const { data, error } = await supabase
        .from("usage_limits")
        .select("subscription_status, subscription_period_end")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return {
        isPremium: data?.subscription_status === "premium",
        status: data?.subscription_status || "free",
        currentPeriodEnd: data?.subscription_period_end
          ? new Date(data.subscription_period_end)
          : undefined,
      };
    } catch (error) {
      console.error("Get subscription error:", error);
      return { isPremium: false, status: "free" };
    }
  },
};