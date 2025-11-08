import { useState, useEffect } from "react";
import { Edit, Trash2, Calendar, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Pitch = {
  id: string;
  one_liner: string;
  deck_structure: string;
  created_at: string;
};

export default function Library() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedOneLiner, setEditedOneLiner] = useState('');
  const [editedDeckStructure, setEditedDeckStructure] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPitches(data || []);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pitches. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pitch: Pitch) => {
    setEditingId(pitch.id);
    setEditedOneLiner(pitch.one_liner);
    setEditedDeckStructure(pitch.deck_structure);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedOneLiner('');
    setEditedDeckStructure('');
  };

  const handleSaveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pitches')
        .update({
          one_liner: editedOneLiner,
          deck_structure: editedDeckStructure,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Pitch Updated',
        description: 'Your changes have been saved successfully.',
      });

      await fetchPitches();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating pitch:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return;

    try {
      const { error } = await supabase
        .from('pitches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Pitch Deleted',
        description: 'The pitch has been removed from your library.',
      });

      await fetchPitches();
    } catch (error) {
      console.error('Error deleting pitch:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete pitch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
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
          {pitches.length} Pitches
        </Badge>
      </div>

      {pitches.length === 0 ? (
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
          {pitches.map((pitch, index) => (
            <Card
              key={pitch.id}
              className="p-6 border-border/40 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {editingId === pitch.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">One-Liner</label>
                    <Textarea
                      value={editedOneLiner}
                      onChange={(e) => setEditedOneLiner(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pitch Deck Structure</label>
                    <Textarea
                      value={editedDeckStructure}
                      onChange={(e) => setEditedDeckStructure(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleSaveEdit(pitch.id)}
                      disabled={isSaving}
                      size="sm"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold leading-tight">
                        {pitch.one_liner}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(pitch.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(pitch)}
                        className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(pitch.id)}
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
                    <p className="text-sm whitespace-pre-wrap">{pitch.deck_structure}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
