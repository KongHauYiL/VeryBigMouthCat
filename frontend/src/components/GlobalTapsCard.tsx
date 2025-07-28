
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
        {/* Reduced gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent h-20 -top-8"></div>
        
        {/* Smaller main card */}
        <div className={`relative backdrop-blur-xl border-t shadow-xl transition-all duration-300 ${
          currentRoom 
            ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-green-400/20' 
            : 'bg-gradient-to-r from-card/90 to-muted/90 border-border/20'
        }`}>
          <div className="px-4 py-3 text-center">
            {/* Compact main counter */}
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium tracking-wide uppercase mb-0.5">
                  Global Taps
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    globalTaps.toLocaleString()
                  )}
                </p>
              </div>
            </div>
            
            {/* Compact multipliers display */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-1.5">
              {currentRoom && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-green-500/20 shadow-md">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-green-300" />
                    <p className="text-green-200 text-xs font-medium">
                      {currentRoom.name} - {partyMultiplier}x
                    </p>
                  </div>
                </div>
              )}
              {selectedContinent && (
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/20 shadow-md">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-blue-300" />
                    <p className="text-blue-200 text-xs font-medium">
                      {selectedContinent.flag} {selectedContinent.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Smaller progress bar */}
            <div className="w-full bg-white/10 rounded-full h-0.5 mb-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/40 to-white/60 rounded-full animate-pulse"
                style={{ width: `${Math.min((globalTaps % 10000) / 100, 100)}%` }}
              ></div>
            </div>
            
            <p className="text-white/50 text-xs">
              Keep tapping! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
