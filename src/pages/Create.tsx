import { useState, useEffect } from "react";
import { Mic, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

type Stage = 'idle' | 'recording' | 'transcribed' | 'generated';

export default function Create() {
  const navigate = useNavigate();
  const { isRecording, transcript: recordedTranscript, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const [stage, setStage] = useState<Stage>('idle');
  const [transcript, setTranscript] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [deckStructure, setDeckStructure] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('pitch-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.transcript) setTranscript(draft.transcript);
        if (draft.oneLiner) setOneLiner(draft.oneLiner);
        if (draft.deckStructure) setDeckStructure(draft.deckStructure);
        if (draft.stage) setStage(draft.stage);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft periodically
  useEffect(() => {
    if (transcript || oneLiner || deckStructure) {
      const draft = { transcript, oneLiner, deckStructure, stage };
      localStorage.setItem('pitch-draft', JSON.stringify(draft));
    }
  }, [transcript, oneLiner, deckStructure, stage]);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
      setTranscript(recordedTranscript);
      setStage('transcribed');
    } else {
      startRecording();
      setStage('recording');
    }
  };

  const handleRerecord = () => {
    resetRecording();
    setStage('idle');
    setTranscript('');
    setOneLiner('');
    setDeckStructure('');
  };

  const handleGeneratePitch = async () => {
    if (!transcript) {
      toast({
        title: 'No Transcript',
        description: 'Please record your pitch first.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pitch', {
        body: { transcript }
      });

      if (error) throw error;
      
      setOneLiner(data.oneLiner);
      setDeckStructure(data.deckStructure);
      setStage('generated');
      
      toast({
        title: 'Pitch Generated!',
        description: 'Your pitch has been optimized successfully.',
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate pitch. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to save your pitch.',
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {

      const { error } = await supabase.from('pitches').insert({
        user_id: user.id,
        transcript,
        one_liner: oneLiner,
        deck_structure: deckStructure,
      });

      if (error) throw error;

      toast({
        title: 'Pitch Saved!',
        description: 'Your pitch has been saved to your library.',
      });

      // Clear draft after successful save
      localStorage.removeItem('pitch-draft');
      navigate('/dashboard/library');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save pitch. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    handleRerecord();
    toast({
      title: 'Pitch Deleted',
      description: 'Your pitch has been discarded.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Create New Pitch</h1>
        <p className="text-muted-foreground text-lg">
          Record your startup idea and let AI transform it into a perfect pitch
        </p>
      </div>

      {stage === 'idle' || stage === 'recording' ? (
        <>
          <Card className="p-12 flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-background to-accent/5 border-border/40">
            <div className="space-y-8 text-center">
              <div className="relative">
                <Button
                  size="lg"
                  onClick={handleRecord}
                  disabled={isProcessing}
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
                    ? "Speak clearly about your startup idea. Your speech is being transcribed in real-time."
                    : "Click the button and start talking about your startup idea. Speech recognition will transcribe automatically."}
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
        </>
      ) : stage === 'transcribed' ? (
        <Card className="p-8 space-y-6 border-border/40">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recording Complete</h2>
            <p className="text-muted-foreground">
              Your speech has been transcribed. Review it below and generate your pitch or record again.
            </p>
            <div className="p-4 bg-accent/10 rounded-lg border border-border/40">
              <p className="text-sm whitespace-pre-wrap">{transcript || "No transcript available"}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleGeneratePitch}
              disabled={isProcessing || !transcript}
              className="flex-1"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Pitch'
              )}
            </Button>
            <Button
              onClick={handleRerecord}
              variant="outline"
              size="lg"
              disabled={isProcessing}
            >
              Re-record
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-8 space-y-6 border-border/40">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Generated Pitch</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">One-Liner</label>
                <Textarea
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  className="min-h-[80px] text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pitch Deck Structure</label>
                <Textarea
                  value={deckStructure}
                  onChange={(e) => setDeckStructure(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex-1"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Library
                </>
              )}
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="lg"
              disabled={isProcessing}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
