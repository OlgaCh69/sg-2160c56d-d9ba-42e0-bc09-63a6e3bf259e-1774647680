import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export const profileService = {
  /**
   * Get current user's profile
   */
  async getCurrentProfile() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.session.user.id)
      .single();

    console.log("Get current profile:", { data, error });
    
    // If profile doesn't exist, create it
    if (error && error.code === "PGRST116") {
      return await this.createProfile({
        email: session.session.user.email || "",
        full_name: session.session.user.user_metadata?.full_name || "",
      });
    }
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a new profile
   */
  async createProfile(data: {
    email: string;
    full_name?: string;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        id: session.session.user.id,
        email: data.email,
        full_name: data.full_name,
      })
      .select()
      .single();

    console.log("Create profile:", { data: profile, error });
    if (error) throw error;
    return profile;
  },

  /**
   * Update profile
   */
  async updateProfile(updates: Partial<Profile>) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.session.user.id)
      .select()
      .single();

    console.log("Update profile:", { data, error });
    if (error) throw error;
    return data;
  },
};