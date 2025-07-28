
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SelectedContinent {
  code: string;
  name: string;
  flag: string;
}

export function useGlobalTaps(multiplier: number = 1, selectedContinent: SelectedContinent | null = null) {
  const [globalTaps, setGlobalTaps] = useState(0);
  const queryClient = useQueryClient();

  // Fetch current global taps from database
  const { data, isLoading } = useQuery({
    queryKey: ['globalTaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_taps')
        .select('total_taps')
        .eq('id', '550e8400-e29b-41d4-a716-446655440000')
        .single();
      
      if (error) {
        console.error('Error fetching global taps:', error);
        return 0;
      }
      
      return data?.total_taps || 0;
    },
    refetchInterval: 10000, // Refresh every 10 seconds (less frequent to avoid conflicts)
  });

  // Update local state when data changes
  useEffect(() => {
    if (data !== undefined) {
      setGlobalTaps(data);
    }
  }, [data]);

  const handleTap = async () => {
    const increment = multiplier;

    // Immediately update the UI optimistically for instant feedback
    const newTotalTaps = globalTaps + increment;
    setGlobalTaps(newTotalTaps);
    
    console.log(`🖱️ Instant update: ${globalTaps} → ${newTotalTaps}`);

    try {
      // Update global taps in database using the optimistically updated value
      const { error: globalError } = await supabase
        .from('global_taps')
        .upsert({ 
          id: '550e8400-e29b-41d4-a716-446655440000',
          total_taps: newTotalTaps,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (globalError) {
        console.error('Error updating global taps:', globalError);
        // Revert optimistic update on error
        setGlobalTaps(prev => prev - increment);
        return;
      }

      console.log(`✅ Database updated to: ${newTotalTaps}`);

      // Track continent tap via edge function (for both new and existing records)
      try {
        const { error: continentError } = await supabase.functions.invoke('track-continent-tap', {
          body: { 
            taps: increment,
            selectedContinent: selectedContinent
          }
        });

        if (continentError) {
          console.error('Error tracking continent tap:', continentError);
          // Don't revert global taps for continent tracking errors
        }
      } catch (continentError) {
        console.error('Edge function error:', continentError);
        // Continue even if continent tracking fails
      }

      // Don't invalidate queries immediately to prevent conflicts with rapid clicking
      // Let the periodic refetch handle it
      
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
