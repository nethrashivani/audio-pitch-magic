import { Mic, Sparkles, BookOpen, Library } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Recording",
    description: "Simply speak about your startup idea. Our advanced voice recognition captures every detail.",
  },
  {
    icon: Sparkles,
    title: "AI Optimization",
    description: "Powered by OpenAI, we transform your raw idea into a compelling, structured pitch.",
  },
  {
    icon: BookOpen,
    title: "Kawasaki Formula",
    description: "Every pitch follows Guy Kawasaki's proven 10-slide framework for maximum impact.",
  },
  {
    icon: Library,
    title: "Pitch Library",
    description: "Save, edit, and manage all your pitches in one organized library.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container px-6">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              perfect your pitch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From recording to refining, we've got every step covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
