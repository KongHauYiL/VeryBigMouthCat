
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useGlobalTaps() {
  const queryClient = useQueryClient();
  const [personalTaps, setPersonalTaps] = useState(() => {
    const stored = localStorage.getItem('personalTapCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  const pendingTapsRef = useRef(0);
  const isProcessingRef = useRef(false);

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

  // Improved mutation to handle batch updates
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
      return tapCount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalTaps'] });
    },
    onError: (error) => {
      console.error('Failed to update global taps:', error);
      // Retry mechanism - add failed taps back to pending
      pendingTapsRef.current += 1;
      processPendingTaps();
    }
  });

  // Process pending taps in batches
  const processPendingTaps = useCallback(async () => {
    if (isProcessingRef.current || pendingTapsRef.current === 0) return;
    
    isProcessingRef.current = true;
    const tapsToProcess = pendingTapsRef.current;
    pendingTapsRef.current = 0;
    
    try {
      await incrementMutation.mutateAsync(tapsToProcess);
    } catch (error) {
      console.error('Batch update failed:', error);
    } finally {
      isProcessingRef.current = false;
      
      // Process any taps that accumulated during this batch
      if (pendingTapsRef.current > 0) {
        setTimeout(processPendingTaps, 100);
      }
    }
  }, [incrementMutation]);

  // Debounced batch processing
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTapsRef.current > 0) {
        processPendingTaps();
      }
    }, 200); // Process every 200ms

    return () => clearInterval(interval);
  }, [processPendingTaps]);

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

    // Add to pending taps for batch processing
    pendingTapsRef.current += 1;
    
    // Optimistically update the UI immediately
    queryClient.setQueryData(['globalTaps'], (oldData: any) => {
      if (oldData) {
        return {
          ...oldData,
          total_taps: oldData.total_taps + 1
        };
      }
      return oldData;
    });
  };

  return {
    globalTaps: globalTaps?.total_taps || 0,
    personalTaps,
    isLoading,
    handleTap,
  };
}
