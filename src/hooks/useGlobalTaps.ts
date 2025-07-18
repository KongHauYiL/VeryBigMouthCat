
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export function useGlobalTaps() {
  const queryClient = useQueryClient();
  const [personalTaps, setPersonalTaps] = useState(() => {
    const stored = localStorage.getItem('personalTapCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  // Fetch global tap count
  const { data: globalTaps, isLoading } = useQuery({
    queryKey: ['globalTaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_taps')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Mutation to increment global taps
  const incrementMutation = useMutation({
    mutationFn: async () => {
      const currentCount = globalTaps?.total_taps || 0;
      const { error } = await supabase
        .from('global_taps')
        .update({ 
          total_taps: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', globalTaps?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalTaps'] });
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('global-taps-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_taps'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['globalTaps'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleTap = async () => {
    // Increment personal counter
    const newPersonalCount = personalTaps + 1;
    setPersonalTaps(newPersonalCount);
    localStorage.setItem('personalTapCount', newPersonalCount.toString());

    // Increment global counter
    incrementMutation.mutate();
  };

  return {
    globalTaps: globalTaps?.total_taps || 0,
    personalTaps,
    isLoading,
    handleTap,
  };
}
