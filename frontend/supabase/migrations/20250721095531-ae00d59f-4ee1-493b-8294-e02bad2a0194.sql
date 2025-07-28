
-- Create pop_wars_choices table
CREATE TABLE public.pop_wars_choices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  choice_text TEXT NOT NULL,
  vote_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pop_wars_votes table to track individual votes
CREATE TABLE public.pop_wars_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  choice_id UUID REFERENCES public.pop_wars_choices(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pop_wars_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pop_wars_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for open access
CREATE POLICY "Anyone can read pop wars choices"
  ON public.pop_wars_choices
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update pop wars choices"
  ON public.pop_wars_choices
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can read pop wars votes"
  ON public.pop_wars_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert pop wars votes"
  ON public.pop_wars_votes
  FOR INSERT
  WITH CHECK (true);

-- Insert initial choices
INSERT INTO public.pop_wars_choices (choice_text) VALUES ('Choice 1');
INSERT INTO public.pop_wars_choices (choice_text) VALUES ('Choice 2');

-- Enable realtime for pop_wars_choices table
ALTER TABLE public.pop_wars_choices REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pop_wars_choices;
