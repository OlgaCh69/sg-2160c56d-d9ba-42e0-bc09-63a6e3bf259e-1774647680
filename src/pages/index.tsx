import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, MessageCircle, TrendingUp, Check, Star, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export default function Home() {
  return (
    <>
      <SEO 
        title="RizzAI - Get 3x More Matches with AI-Perfected Photos"
        description="Upload your selfies. Get high-quality photos, a killer bio, and irresistible opening lines in seconds. Join 10,000+ users upgrading their dating profiles."
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
                <span className="text-sm font-medium text-primary">Join 10,000+ users upgrading their dating profiles</span>
              </div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Get <span className="gradient-text">3x More Matches</span> with AI-Perfected Photos
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
                Upload your selfies. Get high-quality photos, a killer bio, and irresistible opening lines in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/upload">
                  <Button size="lg" className="bg-gradient-cta hover:opacity-90 shadow-cta text-lg px-8 py-6 h-auto">
                    <Upload className="w-5 h-5 mr-2" />
                    Try It Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  See Before & After
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Your Profile… <span className="gradient-text">But Better</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how AI transforms average photos into scroll-stopping profiles.
            </p>
          </div>

          {/* Before/After Slider Showcase */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                afterImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
                beforeLabel="Before"
                afterLabel="After"
              />
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80"
                afterImage="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80"
                beforeLabel="Before"
                afterLabel="After"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 bg-card border-border text-center card-hover">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Better Lighting</h3>
              <p className="text-muted-foreground">
                AI enhances lighting to make you look your best in every shot
              </p>
            </Card>

            <Card className="p-8 bg-card border-border text-center card-hover">
              <div className="w-14 h-14 rounded-2xl bg-gradient-cta flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">More Attractive Angles</h3>
              <p className="text-muted-foreground">
                Optimized angles that highlight your best features naturally
              </p>
            </Card>

            <Card className="p-8 bg-card border-border text-center card-hover">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 mx-auto">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Professional + Lifestyle</h3>
              <p className="text-muted-foreground">
                Multiple styles from casual to professional settings
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/upload">
              <Button size="lg" className="bg-gradient-cta hover:opacity-90 shadow-cta text-lg px-8 py-6 h-auto">
                Generate My Photos
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to transform your dating profile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {[
              { step: "01", title: "Upload 5–10 selfies", desc: "Just your regular selfies work perfectly" },
              { step: "02", title: "AI upgrades your photos + writes your bio", desc: "Our AI creates professional photos and engaging content" },
              { step: "03", title: "Get more matches instantly", desc: "Download and use your enhanced profile materials" }
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

          <div className="text-center">
            <Link href="/upload">
              <Button size="lg" className="bg-gradient-cta hover:opacity-90 shadow-cta text-lg px-8 py-6 h-auto">
                Try It Free Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-border card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">AI Photo Generator</h3>
              <p className="text-sm text-muted-foreground">
                Turn selfies into high-quality, attractive photos
              </p>
            </Card>

            <Card className="p-6 bg-card border-border card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Bio Generator</h3>
              <p className="text-sm text-muted-foreground">
                Get bios that actually get replies
              </p>
            </Card>

            <Card className="p-6 bg-card border-border card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Opening Messages</h3>
              <p className="text-sm text-muted-foreground">
                Never run out of things to say
              </p>
            </Card>

            <Card className="p-6 bg-card border-border card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Profile Score</h3>
              <p className="text-sm text-muted-foreground">
                See how attractive your profile really is
              </p>
            </Card>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "This doubled my matches in 2 days 😳", name: "Alex", age: "27" },
              { quote: "I finally have photos I'm confident using", name: "Mark", age: "24" },
              { quote: "Way better than hiring a photographer", name: "Chris", age: "30" }
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-card border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg mb-4 font-medium">"{testimonial.quote}"</p>
                <p className="text-sm text-muted-foreground">
                  — {testimonial.name}, {testimonial.age}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 bg-card border-border">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold">€0</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Limited generations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Watermarked images</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Basic quality</span>
                </li>
              </ul>
              <Link href="/upload">
                <Button variant="outline" className="w-full" size="lg">
                  Try Free
                </Button>
              </Link>
            </Card>

            <Card className="p-8 bg-gradient-hero text-white border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold mb-2">Pro Plan</h3>
                  <div className="text-4xl font-bold">€17<span className="text-lg font-normal">/month</span></div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Unlimited photo generations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>High-quality images</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>No watermark</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Unlimited bios + messages</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-primary hover:bg-white/90" size="lg">
                  Upgrade to Pro
                </Button>
              </div>
            </Card>
          </div>

          {/* Urgency Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/20">
              <Clock className="w-5 h-5 text-destructive" />
              <span className="font-medium text-destructive">Limited Free Generations Available Today</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Upgrade now to unlock unlimited results and stand out instantly
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-12 bg-gradient-hero text-white border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center space-y-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold">
                Stop Guessing What Works
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Let AI build your perfect dating profile
              </p>
              <div className="pt-4">
                <Link href="/upload">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-6 h-auto">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-border mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-heading text-xl font-bold">RizzAI</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Made with love for better dating experiences
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}