
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Users, Zap } from 'lucide-react';

interface NavbarProps {
  globalTaps: number;
  isLoading: boolean;
  onSettingsToggle: () => void;
  onPartyToggle: () => void;
  onPopWarsToggle: () => void;
  partyMultiplier?: number;
  luckMultiplier?: number;
}

export function Navbar({ 
  globalTaps, 
  isLoading, 
  onSettingsToggle, 
  onPartyToggle, 
  onPopWarsToggle,
  partyMultiplier = 1,
  luckMultiplier = 1
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐱</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">BigMouthCat</h1>
              <p className="text-white/60 text-xs">
                {isLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `${globalTaps.toLocaleString()} global taps`
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Party Room Button */}
            <Button
              onClick={onPartyToggle}
              variant="ghost"
              size="icon"
              className={`hover:bg-white/20 relative ${
                partyMultiplier > 1 ? 'bg-green-500/20 border border-green-500/30' : ''
              }`}
            >
              <Users className="h-5 w-5" />
              {partyMultiplier > 1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </Button>

            {/* Pop Wars Button */}
            <Button
              onClick={onPopWarsToggle}
              variant="ghost"
              size="icon"
              className="hover:bg-white/20"
            >
              <Zap className="h-5 w-5" />
            </Button>

            {/* Settings Button */}
            <Button
              onClick={onSettingsToggle}
              variant="ghost"
              size="icon"
              className="hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Active Multipliers Indicator */}
        {(partyMultiplier > 1 || luckMultiplier > 1) && (
          <div className="mt-2 flex justify-center space-x-2">
            {partyMultiplier > 1 && (
              <div className="bg-green-500/20 rounded-lg px-2 py-1 border border-green-500/30">
                <p className="text-green-200 text-xs font-medium">
                  🎉 Party {partyMultiplier}x
                </p>
              </div>
            )}
            
            {luckMultiplier > 1 && (
              <div className="bg-purple-500/20 rounded-lg px-2 py-1 border border-purple-500/30">
                <p className="text-purple-200 text-xs font-medium">
                  🎲 Lucky {luckMultiplier}x
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
