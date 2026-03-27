import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Download, Copy, Share2, ArrowLeft, Check, Sparkles, TrendingUp, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { generationService } from "@/services/generationService";
import type { Tables } from "@/integrations/supabase/types";

type Generation = Tables<"generations">;
type GeneratedContent = Tables<"generated_content">;
type ProfileScore = Tables<"profile_scores">;

interface GenerationWithRelations extends Generation {
  generated_content?: GeneratedContent[];
  profile_scores?: ProfileScore[];
}

export default function ResultsPage() {
  const router = useRouter();
  const { generationId } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState<GenerationWithRelations | null>(null);
  const [copiedBio, setCopiedBio] = useState<number | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);

  // Load generation data
  useEffect(() => {
    if (!generationId || typeof generationId !== "string") return;

    const loadGeneration = async () => {
      try {
        setLoading(true);
        const data = await generationService.getGeneration(generationId);
        
        if (!data) {
          setError("Generation not found");
          return;
        }

        if (data.status === "failed") {
          setError("Generation failed. Please try again.");
          return;
        }

        if (data.status !== "completed") {
          setError("Generation is still processing. Please wait...");
          setTimeout(() => router.push(`/loading?generationId=${generationId}`), 2000);
          return;
        }

        setGeneration(data);
      } catch (err) {
        console.error("Failed to load generation:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadGeneration();
  }, [generationId, router]);

  // Extract data from generation
  const outputPhotos = Array.isArray(generation?.output_photos) 
    ? (generation.output_photos as string[]) 
    : [];
  
  const generatedContent = generation?.generated_content || [];
  
  const bios = {
    funny: generatedContent.find(c => c.content_type === "bio_funny")?.content || "",
    confident: generatedContent.find(c => c.content_type === "bio_confident")?.content || "",
    simple: generatedContent.find(c => c.content_type === "bio_simple")?.content || "",
  };

  const openingMessages = generatedContent
    .filter(c => c.content_type === "opening_message")
    .map(c => c.content);

  const profileScore = generation?.profile_scores?.[0];
  const beforeScore = profileScore?.before_score || 6.2;
  const afterScore = profileScore?.after_score || 8.9;
  const improvement = ((afterScore - beforeScore) / beforeScore * 100).toFixed(0);

  const biosArray = [
    { type: "Funny", text: bios.funny, icon: "😄" },
    { type: "Confident", text: bios.confident, icon: "💪" },
    { type: "Simple", text: bios.simple, icon: "✨" }
  ];

  const copyToClipboard = (text: string, type: "bio" | "message", index: number) => {
    navigator.clipboard.writeText(text);
    if (type === "bio") {
      setCopiedBio(index);
      setTimeout(() => setCopiedBio(null), 2000);
    } else {
      setCopiedMessage(index);
      setTimeout(() => setCopiedMessage(null), 2000);
    }
  };

  const downloadPhoto = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `rizzai-photo-${index + 1}.jpg`;
    link.click();
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading Results - RizzAI" description="Loading your results" />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your results...</p>
          </Card>
        </div>
      </>
    );
  }

  if (error || !generation) {
    return (
      <>
        <SEO title="Error - RizzAI" description="Something went wrong" />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Oops!</h2>
            <p className="text-muted-foreground mb-6">{error || "Something went wrong"}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/upload")} variant="default">
                Try Again
              </Button>
              <Button onClick={() => router.push("/")} variant="outline">
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Your Results - RizzAI"
        description="Your AI-enhanced dating profile is ready"
      />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/upload">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-heading text-2xl font-bold gradient-text">RizzAI</h1>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Profile Score */}
          <Card className="p-8 mb-8 bg-gradient-hero text-white border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading text-3xl font-bold mb-2">Your Profile Score</h2>
                  <p className="text-white/80">AI-powered analysis of your dating profile</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-heading font-extrabold">{afterScore.toFixed(1)}</div>
                  <div className="text-sm text-white/60">out of 10</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{improvement}% improvement from original ({beforeScore.toFixed(1)} → {afterScore.toFixed(1)})</span>
              </div>
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="photos" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-card">
              <TabsTrigger value="photos" className="data-[state=active]:bg-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="bios" className="data-[state=active]:bg-primary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Bios
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-primary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold mb-2">AI-Enhanced Photos</h3>
                  <p className="text-muted-foreground">{outputPhotos.length} professional-quality images ready to download</p>
                </div>
              </div>

              {outputPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {outputPhotos.map((photoUrl, index) => (
                    <Card key={index} className="group relative overflow-hidden border-border cursor-pointer card-hover">
                      <div className="aspect-square relative">
                        <img
                          src={photoUrl}
                          alt={`Enhanced photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold">Photo {index + 1}</span>
                              <Button 
                                size="sm" 
                                className="bg-white text-primary hover:bg-white/90"
                                onClick={() => downloadPhoto(photoUrl, index)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {generation.generation_type === "free" && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                            RizzAI
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No enhanced photos available yet.</p>
                </Card>
              )}

              {/* Upgrade CTA for free users */}
              {generation.generation_type === "free" && (
                <Card className="p-6 bg-muted/50 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-semibold mb-1">Remove Watermark</h4>
                      <p className="text-sm text-muted-foreground">Upgrade to get 20+ HD photos without watermarks</p>
                    </div>
                    <Button className="bg-gradient-cta hover:opacity-90">
                      Upgrade Now
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Bios Tab */}
            <TabsContent value="bios" className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">AI-Generated Bios</h3>
                <p className="text-muted-foreground">3 optimized profiles tailored to your personality</p>
              </div>

              <div className="space-y-4">
                {biosArray.map((bio, index) => (
                  bio.text && (
                    <Card key={index} className="p-6 border-border">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{bio.icon}</div>
                          <div>
                            <h4 className="font-heading font-semibold text-lg">{bio.type}</h4>
                            <p className="text-sm text-muted-foreground">Optimized for engagement</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={copiedBio === index ? "default" : "outline"}
                          onClick={() => copyToClipboard(bio.text, "bio", index)}
                        >
                          {copiedBio === index ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-foreground leading-relaxed">{bio.text}</p>
                    </Card>
                  )
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">Opening Messages</h3>
                <p className="text-muted-foreground">{openingMessages.length} conversation starters that get replies</p>
              </div>

              {openingMessages.length > 0 ? (
                <div className="space-y-3">
                  {openingMessages.map((message, index) => (
                    <Card key={index} className="p-5 border-border group hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {index + 1}
                            </div>
                            <span className="text-xs text-muted-foreground">Personalized opener</span>
                          </div>
                          <p className="text-foreground">{message}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={copiedMessage === index ? "default" : "outline"}
                          onClick={() => copyToClipboard(message, "message", index)}
                          className="flex-shrink-0"
                        >
                          {copiedMessage === index ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No opening messages available yet.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <Card className="mt-12 p-8 bg-gradient-hero text-white border-0">
            <div className="text-center space-y-4">
              <h3 className="font-heading text-3xl font-bold">Ready for Unlimited Access?</h3>
              <p className="text-white/90 max-w-2xl mx-auto">
                Get unlimited generations, HD photos without watermarks, and priority AI processing for just €17/month
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}