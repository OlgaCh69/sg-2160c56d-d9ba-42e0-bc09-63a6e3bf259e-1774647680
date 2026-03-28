import { supabase } from "@/integrations/supabase/client";
import { createTelrOrder } from "@/lib/telr";

export const paymentService = {
  /**
   * Create Telr checkout session for premium subscription
   */
  async createCheckoutSession(userId: string): Promise<void> {
    try {
      const response = await fetch("/api/telr/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const { paymentUrl } = await response.json();
      
      // Redirect to Telr payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment session error:", error);
      throw error;
    }
  },

  /**
   * Check if user has active premium subscription
   */
  async checkSubscription(userId: string): Promise<{ isPremium: boolean; status: string }> {
    try {
      const { data, error } = await supabase
        .from("usage_limits")
        .select("subscription_status, subscription_period_end")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        return { isPremium: false, status: "free" };
      }

      // Check if subscription is still active
      const isPremium = data.subscription_status === "premium";
      
      // Check if subscription period has expired
      if (data.subscription_period_end) {
        const periodEnd = new Date(data.subscription_period_end);
        const now = new Date();
        
        if (periodEnd < now) {
          // Subscription expired, downgrade to free
          await supabase
            .from("usage_limits")
            .update({ subscription_status: "free" })
            .eq("user_id", userId);
          
          return { isPremium: false, status: "expired" };
        }
      }

      return { 
        isPremium, 
        status: data.subscription_status || "free" 
      };
    } catch (error) {
      console.error("Check subscription error:", error);
      return { isPremium: false, status: "free" };
    }
  },

  /**
   * Cancel subscription (manual process with Telr)
   */
  async cancelSubscription(userId: string): Promise<void> {
    try {
      await supabase
        .from("usage_limits")
        .update({ 
          subscription_status: "free",
          telr_order_ref: null,
          subscription_period_end: null,
        })
        .eq("user_id", userId);
    } catch (error) {
      console.error("Cancel subscription error:", error);
      throw error;
    }
  },
};