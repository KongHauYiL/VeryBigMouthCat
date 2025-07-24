
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useGlobalTaps(multiplier: number = 1) {
  const [globalTaps, setGlobalTaps] = useState(0);
  const queryClient = useQueryClient();

  // Fetch current global taps from database
  const { data, isLoading } = useQuery({
    queryKey: ['globalTaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_taps')
        .select('total_taps')
        .single();
      
      if (error) {
        console.error('Error fetching global taps:', error);
        return 0;
      }
      
      return data?.total_taps || 0;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Update local state when data changes
  useEffect(() => {
    if (data !== undefined) {
      setGlobalTaps(data);
    }
  }, [data]);

  const handleTap = async () => {
    console.log('Handling tap with multiplier:', multiplier);
    
    // Optimistically update the UI
    const increment = multiplier;
    setGlobalTaps(prev => prev + increment);

    try {
      // Update global taps in database
      const { error: globalError } = await supabase
        .from('global_taps')
        .update({ 
          total_taps: globalTaps + increment,
          updated_at: new Date().toISOString()
        })
        .eq('id', '550e8400-e29b-41d4-a716-446655440000'); // Use a fixed UUID

      if (globalError) {
        console.error('Error updating global taps:', globalError);
        // Revert optimistic update on error
        setGlobalTaps(prev => prev - increment);
        return;
      }

      // Track continent tap via edge function
      try {
        const { error: continentError } = await supabase.functions.invoke('track-continent-tap', {
          body: { taps: increment }
        });

        if (continentError) {
          console.error('Error tracking continent tap:', continentError);
          // Don't revert global taps for continent tracking errors
        }
      } catch (continentError) {
        console.error('Edge function error:', continentError);
        // Continue even if continent tracking fails
      }

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['globalTaps'] });
      queryClient.invalidateQueries({ queryKey: ['continentLeaderboard'] });

    } catch (error) {
      console.error('Error in handleTap:', error);
      // Revert optimistic update on error
      setGlobalTaps(prev => prev - increment);
    }
  };

  return {
    globalTaps,
    handleTap,
    isLoading,
  };
}
