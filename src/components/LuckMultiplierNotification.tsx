
import React from 'react';

interface LuckMultiplierNotificationProps {
  multiplier: number;
  timeRemaining: number;
}

export function LuckMultiplierNotification({ multiplier, timeRemaining }: LuckMultiplierNotificationProps) {
  if (multiplier === 1) return null;

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-xl border border-purple-400/20 rounded-2xl shadow-2xl px-6 py-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-white drop-shadow-lg">
            🎲 {multiplier}x LUCK!
          </div>
          <div className="text-white/80 text-sm">
            {minutes}:{seconds.toString().padStart(2, '0')} remaining
          </div>
        </div>
      </div>
    </div>
  );
}
