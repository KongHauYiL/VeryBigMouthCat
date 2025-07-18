
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  globalTaps: number;
  isLoading: boolean;
  onSettingsToggle: () => void;
}

export function Navbar({ globalTaps, isLoading, onSettingsToggle }: NavbarProps) {
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

        {/* Global Taps Counter */}
        <div className="flex items-center space-x-4">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
            <p className="text-xs text-muted-foreground font-medium">Global Taps</p>
            <p className="text-lg font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              {isLoading ? (
                <span className="animate-pulse">---.---</span>
              ) : (
                globalTaps.toLocaleString()
              )}
            </p>
          </div>

          {/* Settings Button */}
          <Button
            onClick={onSettingsToggle}
            variant="ghost"
            size="icon"
            className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 rounded-xl h-12 w-12"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
