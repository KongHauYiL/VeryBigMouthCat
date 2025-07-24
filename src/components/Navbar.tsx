
import React from 'react';
import { Settings, Users, Swords, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  globalTaps: number;
  isLoading: boolean;
  onSettingsToggle: () => void;
  onPartyToggle: () => void;
  onPopWarsToggle: () => void;
  onAchievementsToggle: () => void;
  onProfileToggle: () => void;
  partyMultiplier?: number;
  luckMultiplier?: number;
}

export function Navbar({
  globalTaps,
  isLoading,
  onSettingsToggle,
  onPartyToggle,
  onPopWarsToggle,
  onAchievementsToggle,
  onProfileToggle,
  partyMultiplier = 1,
  luckMultiplier = 1
}: NavbarProps) {
  const totalMultiplier = partyMultiplier * luckMultiplier;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png" 
            alt="BigMouthCat Icon" 
            className="w-8 h-8 object-contain" 
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            BigMouthCat
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Multiplier indicators */}
          <div className="hidden sm:flex items-center space-x-2">
            {partyMultiplier > 1 && (
              <div className="bg-green-500/20 backdrop-blur-md rounded-xl px-3 py-1 border border-green-500/30">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-green-400" />
                  <span className="text-xs font-medium text-green-400">{partyMultiplier}x</span>
                </div>
              </div>
            )}
            
            {luckMultiplier > 1 && (
              <div className="bg-purple-500/20 backdrop-blur-md rounded-xl px-3 py-1 border border-purple-500/30">
                <div className="flex items-center space-x-1">
                  <span className="text-xs">🎲</span>
                  <span className="text-xs font-medium text-purple-400">{luckMultiplier}x</span>
                </div>
              </div>
            )}
          </div>

          {/* Profile Button */}
          <Button 
            onClick={onProfileToggle} 
            variant="ghost" 
            size="icon" 
            className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-500/30 rounded-xl h-10 w-10"
          >
            <User className="h-4 w-4" />
          </Button>

          {/* Achievements Button */}
          <Button 
            onClick={onAchievementsToggle} 
            variant="ghost" 
            size="icon" 
            className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 hover:bg-yellow-500/30 rounded-xl h-10 w-10"
          >
            <Trophy className="h-4 w-4" />
          </Button>

          {/* Pop Wars Button */}
          <Button 
            onClick={onPopWarsToggle} 
            variant="ghost" 
            size="icon" 
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl h-10 w-10"
          >
            <Swords className="h-4 w-4" />
          </Button>

          {/* Party Room Button */}
          <Button 
            onClick={onPartyToggle} 
            variant="ghost" 
            size="icon" 
            className={`backdrop-blur-md border rounded-xl h-10 w-10 ${
              partyMultiplier > 1 
                ? 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30' 
                : 'bg-white/20 border-white/30 hover:bg-white/30'
            }`}
          >
            <Users className="h-4 w-4" />
          </Button>

          {/* Settings Button */}
          <Button 
            onClick={onSettingsToggle} 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 rounded-xl h-10 w-10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
