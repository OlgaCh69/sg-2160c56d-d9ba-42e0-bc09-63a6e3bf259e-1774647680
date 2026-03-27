import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Generation = Tables<"generations">;
type GeneratedContent = Tables<"generated_content">;
type ProfileScore = Tables<"profile_scores">;
type UsageLimit = Tables<"usage_limits">;

export const generationService = {
  /**
   * Create a new generation record
   */
  async createGeneration(data: {
    photoCount: number;
    status?: "pending" | "processing" | "completed" | "failed";
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data: generation, error } = await supabase
      .from("generations")
      .insert({
        user_id: session.session.user.id,
        photo_count: data.photoCount,
        status: data.status || "pending",
      })
      .select()
      .single();

    console.log("Create generation:", { data: generation, error });
    if (error) throw error;
    return generation;
  },

  /**
   * Update generation status
   */
  async updateGenerationStatus(
    generationId: string,
    status: "pending" | "processing" | "completed" | "failed"
  ) {
    const { data, error } = await supabase
      .from("generations")
      .update({ status })
      .eq("id", generationId)
      .select()
      .single();

    console.log("Update generation status:", { data, error });
    if (error) throw error;
    return data;
  },

  /**
   * Save generated content (photos, bios, messages)
   */
  async saveGeneratedContent(data: {
    generationId: string;
    contentType: "photo" | "bio" | "message";
    content: string;
    photoUrl?: string;
    photoStyle?: string;
  }) {
    const { data: content, error } = await supabase
      .from("generated_content")
      .insert({
        generation_id: data.generationId,
        content_type: data.contentType,
        content: data.content,
        photo_url: data.photoUrl,
        photo_style: data.photoStyle,
      })
      .select()
      .single();

    console.log("Save generated content:", { data: content, error });
    if (error) throw error;
    return content;
  },

  /**
   * Save profile score
   */
  async saveProfileScore(data: {
    generationId: string;
    beforeScore: number;
    afterScore: number;
    improvements: string[];
  }) {
    const { data: score, error } = await supabase
      .from("profile_scores")
      .insert({
        generation_id: data.generationId,
        before_score: data.beforeScore,
        after_score: data.afterScore,
        improvements: data.improvements,
      })
      .select()
      .single();

    console.log("Save profile score:", { data: score, error });
    if (error) throw error;
    return score;
  },

  /**
   * Get user's generation history
   */
  async getUserGenerations() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("generations")
      .select(`
        *,
        generated_content(*),
        profile_scores(*)
      `)
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false });

    console.log("Get user generations:", { data, error });
    if (error) throw error;
    return data || [];
  },

  /**
   * Get specific generation with all content
   */
  async getGeneration(generationId: string) {
    const { data, error } = await supabase
      .from("generations")
      .select(`
        *,
        generated_content(*),
        profile_scores(*)
      `)
      .eq("id", generationId)
      .single();

    console.log("Get generation:", { data, error });
    if (error) throw error;
    return data;
  },

  /**
   * Check user's usage limits
   */
  async checkUsageLimits() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", session.session.user.id)
      .single();

    console.log("Check usage limits:", { data, error });
    
    // If no usage limit record exists, create one with free tier defaults
    if (error && error.code === "PGRST116") {
      return await this.initializeUsageLimits();
    }
    
    if (error) throw error;
    return data;
  },

  /**
   * Initialize usage limits for new user
   */
  async initializeUsageLimits() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("usage_limits")
      .insert({
        user_id: session.session.user.id,
        is_premium: false,
        generations_used: 0,
        max_generations: 3,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    console.log("Initialize usage limits:", { data, error });
    if (error) throw error;
    return data;
  },

  /**
   * Increment generation count
   */
  async incrementGenerationCount() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    // Get current usage
    const usage = await this.checkUsageLimits();
    
    // Check if user has remaining generations
    if (!usage.is_premium && usage.generations_used >= usage.max_generations) {
      throw new Error("Generation limit reached. Please upgrade to Premium.");
    }

    // Increment count
    const { data, error } = await supabase
      .from("usage_limits")
      .update({ 
        generations_used: usage.generations_used + 1,
        last_generation_at: new Date().toISOString(),
      })
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    console.log("Increment generation count:", { data, error });
    if (error) throw error;
    return data;
  },

  /**
   * Upgrade to premium
   */
  async upgradeToPremium() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("usage_limits")
      .update({ 
        is_premium: true,
        max_generations: 999999, // Unlimited
      })
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    console.log("Upgrade to premium:", { data, error });
    if (error) throw error;
    return data;
  },
};