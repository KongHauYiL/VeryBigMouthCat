
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useUserTaps() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [personalTaps, setPersonalTaps] = useState(0);

  // Fetch user's tap count
  const { data: userTaps } = useQuery({
    queryKey: ['userTaps', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_taps')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });

  // Update user tap count
  const updateUserTaps = useMutation({
    mutationFn: async (newCount: number) => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_taps')
        .upsert({
          user_id: user.id,
          taps_count: newCount,
          last_tap_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTaps', user?.id] });
    }
  });

  const handleTap = () => {
    const newCount = personalTaps + 1;
    setPersonalTaps(newCount);
    
    if (user) {
      updateUserTaps.mutate(newCount);
    }
  };

  useEffect(() => {
    if (userTaps) {
      setPersonalTaps(userTaps.taps_count);
    }
  }, [userTaps]);

  return {
    personalTaps,
    handleTap,
    userTaps
  };
}
