
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export function useGlobalTaps() {
  const queryClient = useQueryClient();
  const [personalTaps, setPersonalTaps] = useState(() => {
    const stored = localStorage.getItem('personalTapCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  const pendingTapsRef = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

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
    mutationFn: async (tapCount: number) => {
      const currentCount = globalTaps?.total_taps || 0;
      const { error } = await supabase
        .from('global_taps')
        .update({ 
          total_taps: currentCount + tapCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', globalTaps?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalTaps'] });
      pendingTapsRef.current = 0;
    },
  });

  // Debounced update function
  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (pendingTapsRef.current > 0) {
        incrementMutation.mutate(pendingTapsRef.current);
      }
    }, 100); // 100ms debounce
  }, [incrementMutation]);

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
    // Increment personal counter immediately
    const newPersonalCount = personalTaps + 1;
    setPersonalTaps(newPersonalCount);
    localStorage.setItem('personalTapCount', newPersonalCount.toString());

    // Queue the global tap update
    pendingTapsRef.current += 1;
    debouncedUpdate();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    globalTaps: globalTaps?.total_taps || 0,
    personalTaps,
    isLoading,
    handleTap,
  };
}
