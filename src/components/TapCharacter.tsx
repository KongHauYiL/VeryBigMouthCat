
import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

interface TapCharacterProps {
  onTap: () => void;
  personalTaps: number;
}

export function TapCharacter({ onTap, personalTaps }: TapCharacterProps) {
  const { settings } = useSettings();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = () => {
    setIsAnimating(true);
    
    // Haptic feedback
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Sound feedback
    if (settings.soundEnabled) {
      const audio = new Audio();
      audio.volume = 0.3;
      // Create a simple pop sound using Web Audio API
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    }

    onTap();
    
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className={`
          relative cursor-pointer select-none transform transition-all duration-200 ease-out
          ${isAnimating ? 'scale-110 rotate-2' : 'hover:scale-105'}
          active:scale-95
        `}
        onClick={handleTap}
      >
        {/* Tap ripple effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" />
        )}
        
        {/* Main character - cute cat */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-lg flex items-center justify-center">
          {/* Cat face */}
          <div className="text-6xl sm:text-7xl">🐱</div>
          
          {/* Sparkles around the cat when tapping */}
          {isAnimating && (
            <>
              <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce">✨</div>
              <div className="absolute -top-2 -right-2 text-pink-400 animate-bounce delay-75">💫</div>
              <div className="absolute -bottom-2 -left-2 text-blue-400 animate-bounce delay-150">⭐</div>
              <div className="absolute -bottom-2 -right-2 text-green-400 animate-bounce delay-200">🌟</div>
            </>
          )}
        </div>
      </div>
      
      {/* Personal tap counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Your taps</p>
        <p className="text-2xl font-bold text-primary">{personalTaps.toLocaleString()}</p>
      </div>
    </div>
  );
}
