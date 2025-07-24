
import React from 'react';
import { Menu, Users, Trophy, Swords, Settings } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-rose-600/90 to-orange-600/90 border-b border-white/20 shadow-2xl">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🐱</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">BigMouthCat</h1>
              <p className="text-white/70 text-xs">
                {isLoading ? 'Loading...' : `${globalTaps.toLocaleString()} total taps`}
              </p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Leaderboard Button */}
            <button
              onClick={onLeaderboardToggle}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <Trophy className="w-5 h-5 text-white" />
            </button>

            {/* Pop Wars Button */}
            <button
              onClick={onPopWarsToggle}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <Swords className="w-5 h-5 text-white" />
            </button>

            {/* Party Button */}
            <button
              onClick={onPartyToggle}
              className={`p-2 rounded-xl transition-all duration-200 backdrop-blur-sm border ${
                partyMultiplier > 1 
                  ? 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30' 
                  : 'bg-white/10 border-white/10 hover:bg-white/20'
              }`}
            >
              <Users className={`w-5 h-5 ${partyMultiplier > 1 ? 'text-green-300' : 'text-white'}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={onSettingsToggle}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
