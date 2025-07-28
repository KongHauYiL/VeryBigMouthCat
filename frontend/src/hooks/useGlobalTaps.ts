
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
    console.log('Selected continent:', selectedContinent);
    
    const increment = multiplier;

    try {
      // First, get the current value from database to ensure accuracy
      const { data: currentData, error: fetchError } = await supabase
        .from('global_taps')
        .select('total_taps')
        .eq('id', '550e8400-e29b-41d4-a716-446655440000')
        .single();

      if (fetchError) {
        console.error('Error fetching current global taps:', fetchError);
        // If record doesn't exist, create it
        if (fetchError.code === 'PGRST116') {
          console.log('Creating new global_taps record...');
          const { data: insertData, error: insertError } = await supabase
            .from('global_taps')
            .insert({ 
              id: '550e8400-e29b-41d4-a716-446655440000',
              total_taps: increment,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating global taps record:', insertError);
            return;
          }
          
          // Update local state with new value
          setGlobalTaps(increment);
          console.log('✅ Created new global_taps record with', increment, 'taps');
          
          // Continue with continent tracking
        } else {
          return;
        }
      } else {
        // Update with the current database value + increment
        const newTotalTaps = (currentData?.total_taps || 0) + increment;
        
        // Optimistically update the UI first
        setGlobalTaps(newTotalTaps);

        // Update global taps in database
        const { error: globalError } = await supabase
          .from('global_taps')
          .update({ 
            total_taps: newTotalTaps,
            updated_at: new Date().toISOString()
          })
          .eq('id', '550e8400-e29b-41d4-a716-446655440000');

        if (globalError) {
          console.error('Error updating global taps:', globalError);
          // Revert optimistic update on error
          setGlobalTaps(prev => prev - increment);
          return;
        }
        
        console.log('✅ Updated global taps from', currentData?.total_taps, 'to', newTotalTaps);
      }

      // Track continent tap via edge function
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
