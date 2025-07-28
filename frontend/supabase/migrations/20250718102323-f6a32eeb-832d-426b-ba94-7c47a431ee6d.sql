
-- Create table for global tap counter
CREATE TABLE public.global_taps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_taps BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial row for global counter
INSERT INTO public.global_taps (total_taps) VALUES (0);

-- Create table for chat messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.global_taps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for global read access (no auth required)
CREATE POLICY "Anyone can read global taps" 
  ON public.global_taps 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update global taps" 
  ON public.global_taps 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can read messages" 
  ON public.messages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (true);

-- Enable realtime for both tables
ALTER TABLE public.global_taps REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_taps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
