
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CountryTaps {
  id: string;
  country_code: string;
  country_name: string;
  flag_emoji: string;
  total_taps: number;
  updated_at: string;
}

export function useCountryLeaderboard() {
  // Fetch top 5 countries by taps
  const { data: countries = [], isLoading, error } = useQuery({
    queryKey: ['countryLeaderboard'],
    queryFn: async () => {
      // For now, we'll use mock data since the table doesn't exist yet
      // In production, this would be:
      // const { data, error } = await supabase
      //   .from('country_taps')
      //   .select('*')
      //   .order('total_taps', { ascending: false })
      //   .limit(5);
      
      // Mock data for demonstration
      const mockData: CountryTaps[] = [
        { id: '1', country_code: 'US', country_name: 'United States', flag_emoji: '🇺🇸', total_taps: 15234567, updated_at: new Date().toISOString() },
        { id: '2', country_code: 'JP', country_name: 'Japan', flag_emoji: '🇯🇵', total_taps: 12456789, updated_at: new Date().toISOString() },
        { id: '3', country_code: 'DE', country_name: 'Germany', flag_emoji: '🇩🇪', total_taps: 9876543, updated_at: new Date().toISOString() },
        { id: '4', country_code: 'GB', country_name: 'United Kingdom', flag_emoji: '🇬🇧', total_taps: 7654321, updated_at: new Date().toISOString() },
        { id: '5', country_code: 'CA', country_name: 'Canada', flag_emoji: '🇨🇦', total_taps: 5432109, updated_at: new Date().toISOString() },
      ];
      
      return mockData;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    countries,
    isLoading,
    error,
  };
}
