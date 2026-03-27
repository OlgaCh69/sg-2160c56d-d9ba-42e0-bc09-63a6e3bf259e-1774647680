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
    inputPhotos: string[];
    generationType: "free" | "premium";
    status?: "processing" | "completed" | "failed";
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data: generation, error } = await supabase
      .from("generations")
      .insert({
        user_id: session.session.user.id,
        input_photos: data.inputPhotos,
        output_photos: [],
        generation_type: data.generationType,
        status: data.status || "processing",
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
    status: "processing" | "completed" | "failed",
    outputPhotos?: string[]
  ) {
    const updateData: any = { status };
    if (outputPhotos) {
      updateData.output_photos = outputPhotos;
    }
    if (status === "completed" || status === "failed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("generations")
      .update(updateData)
      .eq("id", generationId)
      .select()
      .single();

    console.log("Update generation status:", { data, error });
    if (error) throw error;
    return data;
  },

  /**
   * Save generated content (bios, messages)
   */
  async saveGeneratedContent(data: {
    generationId: string;
    contentType: "bio_funny" | "bio_confident" | "bio_simple" | "opening_message";
    content: string;
  }) {
    const { data: content, error } = await supabase
      .from("generated_content")
      .insert({
        generation_id: data.generationId,
        content_type: data.contentType,
        content: data.content,
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
  }) {
    const { data: score, error } = await supabase
      .from("profile_scores")
      .insert({
        generation_id: data.generationId,
        before_score: data.beforeScore,
        after_score: data.afterScore,
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
        subscription_status: "free",
        free_generations_used: 0,
        free_generations_limit: 3,
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
    if (usage.subscription_status !== "premium" && usage.free_generations_used >= usage.free_generations_limit) {
      throw new Error("Generation limit reached. Please upgrade to Premium.");
    }

    // Increment count
    const { data, error } = await supabase
      .from("usage_limits")
      .update({ 
        free_generations_used: usage.free_generations_used + 1,
        updated_at: new Date().toISOString(),
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
        subscription_status: "premium",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    console.log("Upgrade to premium:", { data, error });
    if (error) throw error;
    return data;
  },
};