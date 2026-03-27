import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, MessageCircle, TrendingUp, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SEO 
        title="RizzAI - Transform Your Dating Profile with AI"
        description="Upload your selfies and get AI-enhanced photos, optimized bios, and engaging opening messages. Boost your matches by 300%."
        image="/og-image.png"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-10" />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)"
          }} />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Dating Profile Enhancement</span>
              </div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Get More Matches with{" "}
                <span className="gradient-text">AI-Enhanced</span> Profiles
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
                Upload your selfies and let AI transform them into professional dating photos. 
                Get optimized bios and irresistible opening messages in under 60 seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/upload">
                  <Button size="lg" className="bg-gradient-cta hover:opacity-90 shadow-cta text-lg px-8 py-6 h-auto">
                    <Upload className="w-5 h-5 mr-2" />
                    Start Boosting Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  See Examples
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>60 sec results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>300% more matches</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade AI tools designed specifically for dating apps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card border-border card-hover cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">AI Photo Enhancement</h3>
              <p className="text-muted-foreground mb-4">
                Transform your selfies into 12-20 stunning photos across multiple styles: Professional, Casual, Gym, and Lifestyle.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Before/after comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>High-resolution output</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Multiple style options</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-card border-border card-hover cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-cta flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">Smart Bio Generator</h3>
              <p className="text-muted-foreground mb-4">
                Get 3 optimized bios tailored to your personality: Funny, Confident, and Simple. Each one designed to maximize engagement.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>3 unique variations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Copy with one click</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Optimized for swipes</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-card border-border card-hover cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">Opening Messages</h3>
              <p className="text-muted-foreground mb-4">
                5 engaging conversation starters that actually get replies. No more awkward first messages or being left on read.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Personality-matched</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Context-aware</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>High response rate</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-muted-foreground">
              From upload to results in under 60 seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload Photos", desc: "Add 5-10 of your best selfies" },
              { step: "02", title: "AI Processing", desc: "Our AI enhances your photos and generates content" },
              { step: "03", title: "Download & Use", desc: "Get your enhanced profile materials instantly" }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="text-6xl font-heading font-extrabold text-primary/20 mb-4">{item.step}</div>
                <h3 className="font-heading text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-12 bg-gradient-hero text-white border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center space-y-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold">
                Ready to Transform Your Dating Life?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands who've boosted their matches by 300%. Start free, upgrade for unlimited access.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/upload">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                    Try Free Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
                  View Pricing
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}