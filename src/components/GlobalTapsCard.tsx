
import React from 'react';
import { TrendingUp, Users, Globe } from 'lucide-react';

interface GlobalTapsCardProps {
  globalTaps: number;
  isLoading: boolean;
  currentRoom?: { name: string; multiplier: number } | null;
  partyMultiplier: number;
  selectedContinent?: { code: string; name: string; flag: string } | null;
}

export function GlobalTapsCard({ 
  globalTaps, 
  isLoading, 
  currentRoom, 
  partyMultiplier, 
  selectedContinent 
}: GlobalTapsCardProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <div className="relative">
        {/* Enhanced gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-32 -top-16"></div>
        
        {/* Main card with glass morphism effect */}
        <div className={`relative backdrop-blur-2xl border-t shadow-2xl transition-all duration-300 ${
          currentRoom 
            ? 'bg-gradient-to-r from-green-600/95 to-emerald-600/95 border-green-400/30' 
            : 'bg-gradient-to-r from-card/95 to-muted/95 border-border/30'
        }`}>
          <div className="px-6 py-6 text-center">
            {/* Main counter */}
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs font-medium tracking-wide uppercase mb-1">
                  Global Taps
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    globalTaps.toLocaleString()
                  )}
                </p>
              </div>
            </div>
            
            {/* Enhanced multipliers display */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {currentRoom && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-green-500/30 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-300" />
                    <p className="text-green-200 text-sm font-medium">
                      {currentRoom.name} - {partyMultiplier}x
                    </p>
                  </div>
                </div>
              )}
              {selectedContinent && (
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-500/30 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-300" />
                    <p className="text-blue-200 text-sm font-medium">
                      {selectedContinent.flag} {selectedContinent.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Animated progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1 mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/50 to-white/80 rounded-full animate-pulse"
                style={{ width: `${Math.min((globalTaps % 10000) / 100, 100)}%` }}
              ></div>
            </div>
            
            <p className="text-white/60 text-xs">
              Keep tapping to reach the next milestone! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
