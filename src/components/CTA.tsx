import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
      
      {/* Animated orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold">
            Ready to craft your{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              winning pitch?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of founders who've transformed their ideas into compelling pitches
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 group">
              <Mic className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start for free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              Schedule a demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • Free for 7 days • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
