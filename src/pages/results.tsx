import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Download, Copy, Share2, ArrowLeft, Check, Sparkles, TrendingUp, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const [copiedBio, setCopiedBio] = useState<number | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);

  const mockPhotos = [
    { id: 1, style: "Professional", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { id: 2, style: "Casual", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
    { id: 3, style: "Gym", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop" },
    { id: 4, style: "Lifestyle", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    { id: 5, style: "Professional", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: 6, style: "Casual", url: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop" },
  ];

  const bios = [
    {
      type: "Funny",
      text: "6'2\" because apparently that matters 😅 Coffee snob, terrible dancer, but I make killer tacos. Swipe right if you can handle puns and spontaneous adventures.",
      icon: "😄"
    },
    {
      type: "Confident",
      text: "Entrepreneur building cool stuff. Fitness enthusiast who believes in balance. Looking for someone genuine to explore the city with and see where it goes.",
      icon: "💪"
    },
    {
      type: "Simple",
      text: "Love hiking, good coffee, and traveling. Looking for someone to share adventures with. Let's grab drinks and see if we vibe.",
      icon: "✨"
    }
  ];

  const openingMessages = [
    "I noticed you're into [interest from profile]. What got you started with that?",
    "Your profile caught my attention — you seem like someone who knows how to enjoy life. Coffee this weekend?",
    "That photo in [location] looks amazing! Have you been traveling a lot lately?",
    "Your [pet/hobby] is adorable! I'm more of a [related interest] person myself. What's your take?",
    "I had to swipe right when I saw [specific detail]. Tell me more about that story!"
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
                  <div className="text-5xl font-heading font-extrabold">8.9</div>
                  <div className="text-sm text-white/60">out of 10</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+45% improvement from original (6.2 → 8.9)</span>
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
                  <p className="text-muted-foreground">6 professional-quality images ready to download</p>
                </div>
                <Button className="bg-gradient-cta hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockPhotos.map((photo) => (
                  <Card key={photo.id} className="group relative overflow-hidden border-border cursor-pointer card-hover">
                    <div className="aspect-square relative">
                      <img
                        src={photo.url}
                        alt={`${photo.style} style`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">{photo.style}</span>
                            <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                        RizzAI
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Upgrade CTA */}
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
            </TabsContent>

            {/* Bios Tab */}
            <TabsContent value="bios" className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">AI-Generated Bios</h3>
                <p className="text-muted-foreground">3 optimized profiles tailored to your personality</p>
              </div>

              <div className="space-y-4">
                {bios.map((bio, index) => (
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
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">Opening Messages</h3>
                <p className="text-muted-foreground">5 conversation starters that get replies</p>
              </div>

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