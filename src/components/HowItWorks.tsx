import { Mic, Wand2, FileText, Download } from "lucide-react";

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Record your idea",
    description: "Click the microphone and talk naturally about your startup. No scripts needed.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI processes",
    description: "Our AI transcribes your voice and analyzes your idea using advanced algorithms.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get your pitch",
    description: "Receive an optimized one-liner and complete pitch deck structure instantly.",
  },
  {
    icon: Download,
    step: "04",
    title: "Refine & export",
    description: "Edit your pitch, save it to your library, and export when ready.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative bg-muted/30">
      <div className="container px-6">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold">
            From idea to pitch in{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              4 simple steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes pitching effortless
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-8 mb-16 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                {/* Step number and icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-4">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-lg text-muted-foreground max-w-xl">{step.description}</p>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
