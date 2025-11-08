import { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Create() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Recording functionality will be implemented later
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Create New Pitch</h1>
        <p className="text-muted-foreground text-lg">
          Record your startup idea and let AI transform it into a perfect pitch
        </p>
      </div>

      <Card className="p-12 flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-background to-accent/5 border-border/40">
        <div className="space-y-8 text-center">
          <div className="relative">
            <Button
              size="lg"
              onClick={handleRecord}
              className={`h-40 w-40 rounded-full text-lg font-semibold transition-all duration-300 ${
                isRecording
                  ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                  : "bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
              }`}
            >
              <Mic className="h-16 w-16" />
            </Button>
            
            {isRecording && (
              <div className="absolute inset-0 -z-10 animate-ping">
                <div className="h-40 w-40 rounded-full bg-destructive/20" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isRecording ? "Recording..." : "Ready to Record"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {isRecording
                ? "Speak clearly about your startup idea. Click again to stop."
                : "Click the button and start talking about your startup idea"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-border/40">
          <h3 className="font-semibold mb-2">📝 Describe Your Idea</h3>
          <p className="text-sm text-muted-foreground">
            Talk naturally about your startup, target audience, and solution
          </p>
        </Card>
        <Card className="p-4 border-border/40">
          <h3 className="font-semibold mb-2">🤖 AI Processing</h3>
          <p className="text-sm text-muted-foreground">
            Our AI analyzes and structures your pitch using proven frameworks
          </p>
        </Card>
        <Card className="p-4 border-border/40">
          <h3 className="font-semibold mb-2">🎯 Perfect Pitch</h3>
          <p className="text-sm text-muted-foreground">
            Get an optimized one-liner and complete pitch deck structure
          </p>
        </Card>
      </div>
    </div>
  );
}
