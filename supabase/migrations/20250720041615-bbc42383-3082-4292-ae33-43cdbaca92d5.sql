
-- Create party_rooms table for friends to play together
CREATE TABLE public.party_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  multiplier INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create party_members table to track who's in each room
CREATE TABLE public.party_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.party_rooms(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.party_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_members ENABLE ROW LEVEL SECURITY;

-- Create policies for open access
CREATE POLICY "Anyone can read party rooms" 
  ON public.party_rooms 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert party rooms" 
  ON public.party_rooms 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update party rooms" 
  ON public.party_rooms 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can read party members" 
  ON public.party_members 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert party members" 
  ON public.party_members 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update party members" 
  ON public.party_members 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete party members" 
  ON public.party_members 
  FOR DELETE 
  USING (true);

-- Enable realtime for party functionality
ALTER TABLE public.party_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.party_members REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_members;

-- Drop authentication-related tables since we're removing auth
DROP TABLE IF EXISTS public.user_taps CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
