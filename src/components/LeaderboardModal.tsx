
import React from 'react';
import { X, Trophy, Medal, Award, Globe, Crown, TrendingUp } from 'lucide-react';
import { useContinentLeaderboard } from '@/hooks/useContinentLeaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { continents, isLoading } = useContinentLeaderboard();

  if (!isOpen) return null;

  const topThree = continents.slice(0, 3);
  const restOfContinents = continents.slice(3);

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 1: return 'h-28';
      case 2: return 'h-24';
      case 3: return 'h-20';
      default: return 'h-16';
    }
  };

  const getPodiumGradient = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 shadow-yellow-500/50';
      case 2: return 'bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400 shadow-gray-500/50';
      case 3: return 'bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 shadow-amber-500/50';
      default: return 'bg-gradient-to-t from-slate-600 to-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-card/95 to-muted/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Continental Champions</h2>
              <p className="text-sm text-muted-foreground flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Live global rankings</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin w-12 h-12 border-4 border-muted border-t-primary rounded-full"></div>
                <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-primary/20 rounded-full"></div>
              </div>
              <p className="text-muted-foreground mt-4 font-medium">Loading championship data...</p>
            </div>
          ) : (
            <>
              {/* Enhanced Podium Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">🏆 Hall of Fame 🏆</h3>
                  <p className="text-muted-foreground">The most active continents worldwide</p>
                </div>
                
                {/* Enhanced Podium Layout */}
                <div className="flex items-end justify-center space-x-4 mb-10">
                  {/* Second Place */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-center justify-center border-4 border-white/20 shadow-2xl">
                          <span className="text-3xl">{topThree[1].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gray-500 rounded-full p-2 shadow-lg border-2 border-background">
                          <Medal className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className={`w-24 ${getPodiumHeight(2)} ${getPodiumGradient(2)} rounded-t-xl shadow-2xl flex items-start justify-center pt-3 relative overflow-hidden`}>
                        <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                      </div>
                      <div className="text-center mt-3">
                        <p className="text-foreground font-semibold">{topThree[1].continent_name}</p>
                        <p className="text-muted-foreground text-sm">{topThree[1].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* First Place */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center border-4 border-white/20 shadow-2xl animate-pulse">
                          <span className="text-4xl">{topThree[0].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-4 -right-4 bg-yellow-500 rounded-full p-3 shadow-lg border-2 border-background">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className={`w-28 ${getPodiumHeight(1)} ${getPodiumGradient(1)} rounded-t-xl shadow-2xl flex items-start justify-center pt-3 relative overflow-hidden`}>
                        <Crown className="w-7 h-7 text-white drop-shadow-lg" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                      </div>
                      <div className="text-center mt-3">
                        <p className="text-foreground font-bold text-lg">{topThree[0].continent_name}</p>
                        <p className="text-yellow-600 font-bold">{topThree[0].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Third Place */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center group">
                      <div className="relative mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center border-4 border-white/20 shadow-2xl">
                          <span className="text-3xl">{topThree[2].flag_emoji}</span>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-amber-600 rounded-full p-2 shadow-lg border-2 border-background">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className={`w-24 ${getPodiumHeight(3)} ${getPodiumGradient(3)} rounded-t-xl shadow-2xl flex items-start justify-center pt-3 relative overflow-hidden`}>
                        <Medal className="w-6 h-6 text-white drop-shadow-lg" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                      </div>
                      <div className="text-center mt-3">
                        <p className="text-foreground font-semibold">{topThree[2].continent_name}</p>
                        <p className="text-muted-foreground text-sm">{topThree[2].total_taps.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Rest of Continents */}
              {restOfContinents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground text-center">Rising Champions</h3>
                  <div className="space-y-3">
                    {restOfContinents.map((continent, index) => {
                      const position = index + 4;
                      return (
                        <div
                          key={continent.id}
                          className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-4 hover:bg-card/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                {position}
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-3xl">{continent.flag_emoji}</span>
                                <div>
                                  <p className="text-foreground font-semibold">{continent.continent_name}</p>
                                  <p className="text-muted-foreground text-sm">{continent.total_taps.toLocaleString()} taps</p>
                                </div>
                              </div>
                            </div>
                            <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 border-t border-border/20 bg-gradient-to-r from-muted/50 to-card/50">
          <p className="text-muted-foreground text-sm text-center flex items-center justify-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Rankings update in real-time • Keep tapping to boost your continent! 🚀</span>
          </p>
        </div>
      </div>
    </div>
  );
}
