
-- Drop the existing country_taps table and create a new continent_taps table
DROP TABLE IF EXISTS public.country_taps;

-- Create a table to store continent tap analytics
CREATE TABLE public.continent_taps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  continent_code TEXT NOT NULL UNIQUE,
  continent_name TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  total_taps BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.continent_taps ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read continent taps
CREATE POLICY "Anyone can read continent taps" 
  ON public.continent_taps 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to update continent taps (for the edge function)
CREATE POLICY "Anyone can update continent taps" 
  ON public.continent_taps 
  FOR UPDATE 
  USING (true);

-- Create policy that allows anyone to insert continent taps (for the edge function)
CREATE POLICY "Anyone can insert continent taps" 
  ON public.continent_taps 
  FOR INSERT 
  WITH CHECK (true);

-- Insert continent data
INSERT INTO public.continent_taps (continent_code, continent_name, flag_emoji, total_taps) VALUES
  ('NA', 'North America', '🌎', 0),
  ('SA', 'South America', '🌎', 0),
  ('EU', 'Europe', '🌍', 0),
  ('AS', 'Asia', '🌏', 0),
  ('AF', 'Africa', '🌍', 0),
  ('OC', 'Oceania', '🌏', 0),
  ('AN', 'Antarctica', '🐧', 0);

-- Create a function to increment continent taps based on IP
CREATE OR REPLACE FUNCTION increment_continent_taps(p_continent_code TEXT, p_continent_name TEXT, p_flag_emoji TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.continent_taps (continent_code, continent_name, flag_emoji, total_taps)
  VALUES (p_continent_code, p_continent_name, p_flag_emoji, 1)
  ON CONFLICT (continent_code) 
  DO UPDATE SET 
    total_taps = continent_taps.total_taps + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;
