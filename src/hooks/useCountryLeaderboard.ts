// This file has been replaced by useContinentLeaderboard.ts
// Keeping for backwards compatibility but redirecting to continent data

import { useContinentLeaderboard } from './useContinentLeaderboard';

// Legacy hook - redirects to continent leaderboard
export function useCountryLeaderboard() {
  const { continents, isLoading, error } = useContinentLeaderboard();
  
  // Map continent data to country-like format for backwards compatibility
  const countries = continents.map(continent => ({
    id: continent.id,
    country_code: continent.continent_code,
    country_name: continent.continent_name,
    flag_emoji: continent.flag_emoji,
    total_taps: continent.total_taps,
    updated_at: continent.updated_at,
  }));

  return {
    countries,
    isLoading,
    error,
  };
}
