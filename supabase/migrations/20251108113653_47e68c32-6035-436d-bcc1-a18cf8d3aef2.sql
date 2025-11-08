-- Create pitches table to store user pitches
CREATE TABLE public.pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  audio_url TEXT,
  transcript TEXT NOT NULL,
  one_liner TEXT NOT NULL,
  deck_structure TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own pitches" 
ON public.pitches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pitches" 
ON public.pitches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitches" 
ON public.pitches 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitches" 
ON public.pitches 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pitches_updated_at
BEFORE UPDATE ON public.pitches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();