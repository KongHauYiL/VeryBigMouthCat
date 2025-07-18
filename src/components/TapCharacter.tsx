
import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

interface TapCharacterProps {
  onTap: () => void;
}

export function TapCharacter({ onTap }: TapCharacterProps) {
  const { settings } = useSettings();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);

  const handleTap = () => {
    setIsAnimating(true);
    setIsMouthOpen(true);
    
    // Haptic feedback
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Sound feedback
    if (settings.soundEnabled) {
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
    
    setTimeout(() => {
      setIsAnimating(false);
      setIsMouthOpen(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        className={`
          relative cursor-pointer select-none transform transition-all duration-200 ease-out
          ${isAnimating ? 'scale-110' : 'hover:scale-105'}
          active:scale-95
        `}
        onClick={handleTap}
      >
        {/* Tap ripple effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping scale-150" />
        )}
        
        {/* BigMouthCat character */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <img 
            src={isMouthOpen ? "/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png" : "/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png"}
            alt="BigMouthCat"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          
          {/* Sparkles around the cat when tapping */}
          {isAnimating && (
            <>
              <div className="absolute -top-4 -left-4 text-yellow-400 animate-bounce text-2xl">✨</div>
              <div className="absolute -top-4 -right-4 text-pink-400 animate-bounce delay-75 text-2xl">💫</div>
              <div className="absolute -bottom-4 -left-4 text-blue-400 animate-bounce delay-150 text-2xl">⭐</div>
              <div className="absolute -bottom-4 -right-4 text-green-400 animate-bounce delay-200 text-2xl">🌟</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
