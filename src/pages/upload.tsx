import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Upload, X, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { generationService } from "@/services/generationService";
import { profileService } from "@/services/profileService";

export default function UploadPage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Create anonymous session for demo purposes
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        setUserId(data.session?.user.id || null);
      } else {
        setUserId(session.user.id);
      }

      // Get or create profile and check remaining generations
      if (session?.user.id || userId) {
        const profile = await profileService.getOrCreateProfile(session?.user.id || userId!);
        const remaining = await generationService.getRemainingGenerations(session?.user.id || userId!);
        setRemainingGenerations(remaining);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Failed to initialize. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/")
    );
    
    if (uploadedFiles.length + files.length <= 10) {
      setUploadedFiles(prev => [...prev, ...files]);
      setError(null);
    } else {
      setError("Maximum 10 photos allowed");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadedFiles.length + files.length <= 10) {
        setUploadedFiles(prev => [...prev, ...files]);
        setError(null);
      } else {
        setError("Maximum 10 photos allowed");
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const uploadToStorage = async (files: File[], generationId: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${generationId}/input_${index}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('user-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleGenerate = async () => {
    if (!userId) {
      setError("Please wait while we initialize your session...");
      return;
    }

    if (uploadedFiles.length < 5 || uploadedFiles.length > 10) {
      setError("Please upload 5-10 photos");
      return;
    }

    if (remainingGenerations !== null && remainingGenerations <= 0) {
      setError("You've used all your free generations. Upgrade to Pro for unlimited access!");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Create generation record
      const generation = await generationService.createGeneration(userId, uploadedFiles.length);
      
      if (!generation?.id) {
        throw new Error("Failed to create generation record");
      }

      // Upload files to Supabase Storage
      const photoUrls = await uploadToStorage(uploadedFiles, generation.id);

      // Update generation with photo URLs
      await generationService.updateGenerationStatus(
        generation.id,
        'processing',
        photoUrls
      );

      // Redirect to loading page with generation ID
      router.push(`/loading?generationId=${generation.id}`);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to start generation. Please try again.");
      setIsGenerating(false);
    }
  };

  const canGenerate = uploadedFiles.length >= 5 && uploadedFiles.length <= 10 && !isGenerating;

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Upload Photos - RizzAI"
          description="Upload 5-10 selfies to get AI-enhanced dating profile photos"
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Upload Photos - RizzAI"
        description="Upload 5-10 selfies to get AI-enhanced dating profile photos"
      />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-6">
              <h1 className="font-heading text-3xl font-bold gradient-text">RizzAI</h1>
            </Link>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Upload Your Photos
            </h2>
            <p className="text-lg text-muted-foreground">
              Add 5-10 of your best selfies for AI enhancement
            </p>
            {remainingGenerations !== null && (
              <p className="text-sm text-primary mt-2">
                {remainingGenerations} free generation{remainingGenerations !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Card className="p-4 mb-8 bg-destructive/10 border-destructive">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </Card>
          )}

          {/* Upload Area */}
          <Card className="p-8 mb-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    Drop your photos here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isGenerating}
                  />
                  <label htmlFor="file-upload">
                    <Button 
                      variant="outline" 
                      className="cursor-pointer" 
                      asChild
                      disabled={isGenerating}
                    >
                      <span>Choose Files</span>
                    </Button>
                  </label>
                </div>

                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length}/10 photos uploaded
                </p>
              </div>
            </div>

            {/* File Grid */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isGenerating}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Requirements */}
          <Card className="p-6 mb-8 bg-muted/50 border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Photo Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload 5-10 clear selfies</li>
                  <li>• Good lighting and varied angles work best</li>
                  <li>• Include different expressions and settings</li>
                  <li>• File size limit: 10MB per photo</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Generate Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              disabled={!canGenerate}
              onClick={handleGenerate}
              className="bg-gradient-cta hover:opacity-90 shadow-cta text-lg px-12 py-6 h-auto disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Profile
                </>
              )}
            </Button>
            
            {uploadedFiles.length < 5 && uploadedFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Upload {5 - uploadedFiles.length} more photo{5 - uploadedFiles.length !== 1 ? 's' : ''} to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}