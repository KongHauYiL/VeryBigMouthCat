
import React from 'react';
import { X, Trophy, Medal, Award, Globe, Crown } from 'lucide-react';
import { useCountryLeaderboard } from '@/hooks/useCountryLeaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { countries, isLoading } = useCountryLeaderboard();

  if (!isOpen) return null;

  const topThree = countries.slice(0, 3);
  const restOfTop5 = countries.slice(3, 5);

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 1: return 'h-24';
      case 2: return 'h-20';
      case 3: return 'h-16';
      default: return 'h-12';
    }
  };

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2: return <Trophy className="w-7 h-7 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  const getPodiumGradient = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400';
      case 2: return 'bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400';
      case 3: return 'bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500';
      default: return 'bg-gradient-to-t from-slate-600 to-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Global Leaderboard</h2>
              <p className="text-sm text-white/60">Top Countries by Taps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mb-4"></div>
              <p className="text-white/60">Loading rankings...</p>
            </div>
          ) : (
            <>
              {/* Podium Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white text-center mb-6">🏆 Top 3 Champions 🏆</h3>
                
                {/* Podium Layout */}
                <div className="flex items-end justify-center space-x-2 mb-8">
                  {/* Second Place */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-center justify-center border-4 border-white/20">
                          <span className="text-2xl">{topThree[1].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gray-500 rounded-full p-1">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                      </div>
                      <div className={`w-20 ${getPodiumHeight(2)} ${getPodiumGradient(2)} rounded-t-lg flex items-start justify-center pt-2`}>
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-white font-medium text-sm">{topThree[1].country_name}</p>
                        <p className="text-white/60 text-xs">{topThree[1].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* First Place */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center border-4 border-white/20 shadow-lg">
                          <span className="text-3xl">{topThree[0].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className={`w-24 ${getPodiumHeight(1)} ${getPodiumGradient(1)} rounded-t-lg flex items-start justify-center pt-2 shadow-xl`}>
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-white font-bold">{topThree[0].country_name}</p>
                        <p className="text-yellow-400 font-bold text-sm">{topThree[0].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Third Place */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center border-4 border-white/20">
                          <span className="text-2xl">{topThree[2].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-1">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                      </div>
                      <div className={`w-20 ${getPodiumHeight(3)} ${getPodiumGradient(3)} rounded-t-lg flex items-start justify-center pt-2`}>
                        <Medal className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-white font-medium text-sm">{topThree[2].country_name}</p>
                        <p className="text-white/60 text-xs">{topThree[2].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rest of Top 5 */}
              {restOfTop5.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-white/80 text-center">Also Competing</h3>
                  {restOfTop5.map((country, index) => {
                    const position = index + 4;
                    return (
                      <div
                        key={country.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <span className="text-white/60 font-bold text-sm">{position}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{country.flag_emoji}</span>
                              <div>
                                <p className="text-white font-medium">{country.country_name}</p>
                                <p className="text-white/60 text-sm">{country.total_taps.toLocaleString()} taps</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-white/60 text-sm text-center">
            🌍 Rankings update in real-time • Keep tapping to boost your country!
          </p>
        </div>
      </div>
    </div>
  );
}
