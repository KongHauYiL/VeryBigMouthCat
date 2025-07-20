
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Session {
  user: User;
  sessionToken: string;
  expiresAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      const { data: sessionData, error } = await supabase
        .from('user_sessions')
        .select(`
          session_token,
          expires_at,
          users (
            id,
            username,
            email
          )
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !sessionData) {
        localStorage.removeItem('session_token');
        setIsLoading(false);
        return;
      }

      const user = sessionData.users as any;
      setUser(user);
      setSession({
        user,
        sessionToken: sessionData.session_token,
        expiresAt: sessionData.expires_at
      });
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string) => {
    try {
      // Create user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({ username, email })
        .select()
        .single();

      if (userError) throw userError;

      // Create session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userData.id,
          session_token: sessionToken,
          expires_at: expiresAt
        });

      if (sessionError) throw sessionError;

      localStorage.setItem('session_token', sessionToken);
      setUser(userData);
      setSession({
        user: userData,
        sessionToken,
        expiresAt
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (username: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) throw new Error('User not found');

      // Create new session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userData.id,
          session_token: sessionToken,
          expires_at: expiresAt
        });

      if (sessionError) throw sessionError;

      localStorage.setItem('session_token', sessionToken);
      setUser(userData);
      setSession({
        user: userData,
        sessionToken,
        expiresAt
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
      setSession(null);
    }
  };

  return {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut
  };
}
