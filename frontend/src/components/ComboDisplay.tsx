
import React from 'react';
import { Zap, Star } from 'lucide-react';

interface ComboDisplayProps {
  combo: number;
  isActive: boolean;
}

export function ComboDisplay({ combo, isActive }: ComboDisplayProps) {
  if (!isActive || combo < 2) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-3xl blur-xl scale-110"></div>
        
        {/* Main combo display */}
        <div className="relative bg-gradient-to-r from-yellow-400/95 to-orange-400/95 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl px-8 py-6 shadow-2xl animate-scale-in">
          <div className="text-center">
            {/* Combo number */}
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="w-8 h-8 text-white animate-pulse" />
              <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                {combo}x
              </div>
              <Star className="w-8 h-8 text-white animate-spin" />
            </div>
            
            {/* Combo label */}
            <div className="text-white/90 text-lg font-bold tracking-wider">
              COMBO STREAK!
            </div>
            
            {/* Animated underline */}
            <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
        </div>
      </div>
    </div>
  );
}
