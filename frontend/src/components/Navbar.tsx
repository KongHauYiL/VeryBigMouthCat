
import React from 'react';
import { Users, Trophy, Swords, Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  globalTaps: number;
  isLoading: boolean;
  onSettingsToggle: () => void;
  onPartyToggle: () => void;
  onPopWarsToggle: () => void;
  onLeaderboardToggle: () => void;
  partyMultiplier?: number;
}

export function Navbar({ 
  globalTaps, 
  isLoading, 
  onSettingsToggle, 
  onPartyToggle, 
  onPopWarsToggle,
  onLeaderboardToggle,
  partyMultiplier = 1 
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-card/95 to-muted/95 border-b border-border/20 shadow-2xl">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/sleepy-cat.png" 
                  className="w-8 h-8 object-contain"
                  alt="BigMouthCat"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg border-2 border-background"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-foreground font-bold text-xl tracking-tight">BigMouthCat</h1>
              <p className="text-muted-foreground text-sm flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>
                  {isLoading ? 'Syncing...' : `${globalTaps.toLocaleString()} total taps`}
                </span>
              </p>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Leaderboard Button */}
            <button
              onClick={onLeaderboardToggle}
              className="group relative p-3 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-300 backdrop-blur-sm border border-border/10 hover:border-border/30 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Trophy className="w-5 h-5 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            </button>

            {/* Pop Wars Button */}
            <button
              onClick={onPopWarsToggle}
              className="group relative p-3 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-300 backdrop-blur-sm border border-border/10 hover:border-border/30 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Swords className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            </button>

            {/* Party Button */}
            <button
              onClick={onPartyToggle}
              className={`group relative p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl hover:scale-105 ${
                partyMultiplier > 1 
                  ? 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30' 
                  : 'bg-card/50 hover:bg-card/80 border-border/10 hover:border-border/30'
              }`}
            >
              <Users className={`w-5 h-5 transition-colors ${
                partyMultiplier > 1 ? 'text-green-300' : 'text-muted-foreground group-hover:text-green-500'
              }`} />
              {partyMultiplier > 1 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {partyMultiplier}
                </div>
              )}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl transition-opacity blur ${
                partyMultiplier > 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>

            {/* Settings Button */}
            <button
              onClick={onSettingsToggle}
              className="group relative p-3 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-300 backdrop-blur-sm border border-border/10 hover:border-border/30 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-90" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
