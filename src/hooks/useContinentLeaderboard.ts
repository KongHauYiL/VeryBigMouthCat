
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContinentTaps {
  id: string;
  continent_code: string;
  continent_name: string;
  flag_emoji: string;
  total_taps: number;
  updated_at: string;
}

export function useContinentLeaderboard() {
  // Fetch top continents by taps
  const { data: continents = [], isLoading, error } = useQuery({
    queryKey: ['continentLeaderboard'],
    queryFn: async () => {
      console.log('Fetching continent leaderboard...');
      
      const { data, error } = await supabase
        .from('continent_taps')
        .select('*')
        .order('total_taps', { ascending: false })
        .limit(7); // All 7 continents

      if (error) {
        console.error('Error fetching continent leaderboard:', error);
        throw error;
      }

      console.log('Fetched continents:', data);
      return data as ContinentTaps[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    continents,
    isLoading,
    error,
  };
}
