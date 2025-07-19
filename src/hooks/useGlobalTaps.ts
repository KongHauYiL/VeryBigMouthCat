
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
  const { data: globalTaps, isLoading, error } = useQuery({
    queryKey: ['globalTaps'],
    queryFn: async () => {
      console.log('Fetching global taps...');
      const { data, error } = await supabase
        .from('global_taps')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching global taps:', error);
        throw error;
      }
      console.log('Global taps data:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Improved mutation to handle batch updates
  const incrementMutation = useMutation({
    mutationFn: async (tapCount: number) => {
      console.log('Updating global taps by:', tapCount);
      const currentCount = globalTaps?.total_taps || 0;
      const { error } = await supabase
        .from('global_taps')
        .update({ 
          total_taps: currentCount + tapCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', globalTaps?.id);
      
      if (error) {
        console.error('Error updating global taps:', error);
        throw error;
      }
      console.log('Successfully updated global taps');
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
    if (isProcessingRef.current || pendingTapsRef.current === 0 || !globalTaps) return;
    
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
  }, [incrementMutation, globalTaps]);

  // Debounced batch processing
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTapsRef.current > 0 && globalTaps) {
        processPendingTaps();
      }
    }, 200); // Process every 200ms

    return () => clearInterval(interval);
  }, [processPendingTaps, globalTaps]);

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
    console.log('Tap registered!');
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

  // Return safe values even if there's an error
  return {
    globalTaps: globalTaps?.total_taps || 0,
    personalTaps,
    isLoading,
    error,
    handleTap,
  };
}
