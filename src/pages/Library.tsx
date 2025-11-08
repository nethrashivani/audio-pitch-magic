import { Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real data later
const mockPitches = [
  {
    id: "1",
    oneLiner: "The Uber for pet grooming - connecting pet owners with certified groomers on-demand",
    createdAt: "2024-01-15",
    deckStructure: "Problem, Solution, Market, Competition, Business Model",
  },
  {
    id: "2",
    oneLiner: "AI-powered meal planning that reduces food waste and saves families 30% on groceries",
    createdAt: "2024-01-10",
    deckStructure: "Problem, Solution, Market, Competition, Business Model",
  },
];

export default function Library() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Pitch Library</h1>
          <p className="text-muted-foreground text-lg">
            View and manage all your generated pitches
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {mockPitches.length} Pitches
        </Badge>
      </div>

      {mockPitches.length === 0 ? (
        <Card className="p-12 text-center border-border/40">
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">No pitches yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first pitch to see it here
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {mockPitches.map((pitch, index) => (
            <Card
              key={pitch.id}
              className="p-6 border-border/40 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold leading-tight">
                      {pitch.oneLiner}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {pitch.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    Pitch Deck Structure
                  </h4>
                  <p className="text-sm">{pitch.deckStructure}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
