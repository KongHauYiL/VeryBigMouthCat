
-- Create a simple users table for authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user sessions table to track active sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user taps table to track individual user contributions
CREATE TABLE public.user_taps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  taps_count BIGINT NOT NULL DEFAULT 0,
  last_tap_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_taps ENABLE ROW LEVEL SECURITY;

-- Create policies for open access (since we're not using Supabase auth)
CREATE POLICY "Anyone can read users" 
  ON public.users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert users" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update users" 
  ON public.users 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can read sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert sessions" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update sessions" 
  ON public.user_sessions 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete sessions" 
  ON public.user_sessions 
  FOR DELETE 
  USING (true);

CREATE POLICY "Anyone can read user taps" 
  ON public.user_taps 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert user taps" 
  ON public.user_taps 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update user taps" 
  ON public.user_taps 
  FOR UPDATE 
  USING (true);

-- Enable realtime for user_taps table
ALTER TABLE public.user_taps REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_taps;
