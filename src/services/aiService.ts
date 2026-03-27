import { generationService } from "./generationService";

/**
 * AI Service for generating enhanced photos and text content using Replicate and OpenAI APIs
 */

// Types for API responses
interface ReplicateResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const aiService = {
  /**
   * Generate enhanced photos using Replicate API
   * Uses a photo enhancement model to improve quality and attractiveness
   */
  generateEnhancedPhotos: async (
    inputPhotoUrls: string[],
    generationId: string,
    isPremium: boolean
  ): Promise<string[]> => {
    try {
      const enhancedPhotos: string[] = [];

      // Process photos in batches to avoid rate limits
      for (const photoUrl of inputPhotoUrls) {
        // Call Replicate API for photo enhancement
        const response = await fetch("/api/replicate/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: photoUrl,
            isPremium,
            generationId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Replicate API error: ${response.statusText}`);
        }

        const data: ReplicateResponse = await response.json();

        // Poll for completion (Replicate is async)
        if (data.id) {
          const result = await aiService.pollReplicateStatus(data.id);
          if (result.output && result.output.length > 0) {
            enhancedPhotos.push(...result.output);
          }
        }
      }

      return enhancedPhotos;
    } catch (error) {
      console.error("Photo enhancement error:", error);
      throw error;
    }
  },

  /**
   * Poll Replicate API for generation status
   */
  pollReplicateStatus: async (
    predictionId: string,
    maxAttempts = 60
  ): Promise<ReplicateResponse> => {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`/api/replicate/status?id=${predictionId}`);
      const data: ReplicateResponse = await response.json();

      if (data.status === "succeeded") {
        return data;
      } else if (data.status === "failed") {
        throw new Error(data.error || "Generation failed");
      }

      // Wait 2 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error("Generation timeout");
  },

  /**
   * Generate dating profile bios using OpenAI
   */
  generateBios: async (generationId: string): Promise<{
    funny: string;
    confident: string;
    simple: string;
  }> => {
    try {
      const response = await fetch("/api/openai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        funny: data.funny || "",
        confident: data.confident || "",
        simple: data.simple || "",
      };
    } catch (error) {
      console.error("Bio generation error:", error);
      throw error;
    }
  },

  /**
   * Generate opening messages using OpenAI
   */
  generateOpeningMessages: async (generationId: string): Promise<string[]> => {
    try {
      const response = await fetch("/api/openai/generate-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error("Message generation error:", error);
      throw error;
    }
  },

  /**
   * Calculate profile score improvement
   */
  calculateProfileScore: (beforePhotos: string[], afterPhotos: string[]): {
    before: number;
    after: number;
  } => {
    // Simple scoring algorithm (in production, use ML model)
    const beforeScore = 6.2; // Base score for unoptimized photos
    const afterScore = Math.min(9.5, beforeScore + 2.7); // Average improvement

    return {
      before: Number(beforeScore.toFixed(1)),
      after: Number(afterScore.toFixed(1)),
    };
  },

  /**
   * Main generation orchestration - handles the entire AI generation process
   */
  processGeneration: async (generationId: string): Promise<void> => {
    try {
      // Update status to processing
      await generationService.updateGenerationStatus(generationId, "processing");

      // Get generation details
      const generation = await generationService.getGeneration(generationId);
      if (!generation) {
        throw new Error("Generation not found");
      }

      const isPremium = generation.generation_type === "premium";
      const inputPhotos = Array.isArray(generation.input_photos) ? generation.input_photos as string[] : [];

      // Step 1: Generate enhanced photos (takes longest)
      const enhancedPhotos = await aiService.generateEnhancedPhotos(
        inputPhotos,
        generationId,
        isPremium
      );

      // Update generation with output photos
      await generationService.updateGenerationStatus(generationId, "processing", enhancedPhotos);

      // Step 2: Generate bios
      const bios = await aiService.generateBios(generationId);

      // Step 3: Generate opening messages
      const messages = await aiService.generateOpeningMessages(generationId);

      // Step 4: Save generated content
      await generationService.saveGeneratedContent({ generationId, contentType: "bio_funny", content: bios.funny });
      await generationService.saveGeneratedContent({ generationId, contentType: "bio_confident", content: bios.confident });
      await generationService.saveGeneratedContent({ generationId, contentType: "bio_simple", content: bios.simple });
      
      for (const msg of messages) {
        await generationService.saveGeneratedContent({ generationId, contentType: "opening_message", content: msg });
      }

      // Step 5: Calculate and save profile score
      const scores = aiService.calculateProfileScore(inputPhotos, enhancedPhotos);
      await generationService.saveProfileScore({
        generationId,
        beforeScore: scores.before,
        afterScore: scores.after
      });

      // Step 6: Mark generation as completed
      await generationService.updateGenerationStatus(generationId, "completed", enhancedPhotos);

    } catch (error) {
      console.error("Generation processing error:", error);
      
      // Mark generation as failed
      await generationService.updateGenerationStatus(generationId, "failed");
      
      throw error;
    }
  },
};