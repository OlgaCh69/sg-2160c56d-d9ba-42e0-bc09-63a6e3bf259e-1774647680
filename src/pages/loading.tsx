import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Sparkles, Image, MessageCircle, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    { icon: Image, label: "Analyzing your photos", duration: 2000 },
    { icon: Sparkles, label: "Enhancing with AI", duration: 2500 },
    { icon: MessageCircle, label: "Generating bios", duration: 1500 },
    { icon: TrendingUp, label: "Creating openers", duration: 1500 }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => router.push("/results"), 500);
          return 100;
        }
        return prev + (100 / (totalDuration / 100));
      });
    }, 100);

    let stepTimer = 0;
    steps.forEach((step, index) => {
      stepTimer += step.duration;
      setTimeout(() => setCurrentStep(index + 1), stepTimer);
    });

    return () => clearInterval(progressInterval);
  }, [router]);

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