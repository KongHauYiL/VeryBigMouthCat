
import React from 'react';

interface ComboDisplayProps {
  combo: number;
  isActive: boolean;
}

export function ComboDisplay({ combo, isActive }: ComboDisplayProps) {
  if (!isActive || combo < 2) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
      <div className="bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-xl border border-yellow-400/20 rounded-2xl px-6 py-3 shadow-2xl animate-scale-in">
        <div className="text-center">
          <div className="text-3xl font-bold text-white drop-shadow-lg">
            {combo}x
          </div>
          <div className="text-white/80 text-sm font-medium">
            COMBO!
          </div>
        </div>
      </div>
    </div>
  );
}
