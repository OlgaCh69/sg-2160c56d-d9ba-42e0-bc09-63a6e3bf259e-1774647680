import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Sparkles, Image, MessageCircle, TrendingUp, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import { aiService } from "@/services/aiService";
import { generationService } from "@/services/generationService";
import { Button } from "@/components/ui/button";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { generationId } = router.query;

  const steps = [
    { icon: Image, label: "Analyzing your photos", duration: 2000 },
    { icon: Sparkles, label: "Enhancing with AI", duration: 2500 },
    { icon: MessageCircle, label: "Generating bios", duration: 1500 },
    { icon: TrendingUp, label: "Creating openers", duration: 1500 }
  ];

  useEffect(() => {
    if (!generationId || typeof generationId !== "string") {
      setError("No generation ID found");
      return;
    }

    let progressInterval: NodeJS.Timeout;
    let statusCheckInterval: NodeJS.Timeout;
    let isMounted = true;

    const startGeneration = async () => {
      try {
        // Start the AI generation process in the background
        aiService.processGeneration(generationId).catch((err) => {
          console.error("Background generation error:", err);
          if (isMounted) {
            setError("Generation failed. Please try again.");
          }
        });

        // Start progress animation
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(progressInterval);
              return 95; // Cap at 95% until we confirm completion
            }
            return prev + 1;
          });
        }, 800); // ~76 seconds to reach 95%

        // Update visual steps
        let stepTimer = 0;
        steps.forEach((step, index) => {
          stepTimer += step.duration;
          setTimeout(() => {
            if (isMounted) setCurrentStep(index + 1);
          }, stepTimer);
        });

        // Poll generation status every 3 seconds
        statusCheckInterval = setInterval(async () => {
          try {
            const generation = await generationService.getGeneration(generationId);
            
            if (generation?.status === "completed") {
              clearInterval(statusCheckInterval);
              clearInterval(progressInterval);
              if (isMounted) {
                setProgress(100);
                setTimeout(() => {
                  router.push(`/results?generationId=${generationId}`);
                }, 500);
              }
            } else if (generation?.status === "failed") {
              clearInterval(statusCheckInterval);
              clearInterval(progressInterval);
              if (isMounted) {
                setError("Generation failed. Please try again.");
              }
            }
          } catch (err) {
            console.error("Status check error:", err);
          }
        }, 3000);

      } catch (err) {
        console.error("Generation start error:", err);
        if (isMounted) {
          setError("Failed to start generation. Please try again.");
        }
      }
    };

    startGeneration();

    return () => {
      isMounted = false;
      if (progressInterval) clearInterval(progressInterval);
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, [generationId, router]);

  if (error) {
    return (
      <>
        <SEO 
          title="Error - RizzAI"
          description="Something went wrong"
        />
        
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-12 border-border text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-3">
                Oops! Something Went Wrong
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {error}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/upload")} variant="default">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/")} variant="outline">
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Processing - RizzAI"
        description="AI is enhancing your dating profile"
      />
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 border-border text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-hero flex items-center justify-center animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-heading text-4xl font-bold mb-3">
              Creating Your <span className="gradient-text">Perfect Profile</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              This usually takes 30-60 seconds
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-hero transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm font-semibold text-primary">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isActive 
                      ? "bg-primary/10 border-2 border-primary" 
                      : isCompleted 
                        ? "bg-muted/50 border border-border" 
                        : "bg-muted/30 border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? "bg-primary text-white" 
                      : isCompleted 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium ${
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Please don't close this window
          </p>
        </Card>
      </div>
    </>
  );
}