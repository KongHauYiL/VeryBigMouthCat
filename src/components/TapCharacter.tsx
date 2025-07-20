
import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useClickTracking } from '@/hooks/useClickTracking';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';

interface TapCharacterProps {
  onTap: () => void;
}

export function TapCharacter({ onTap }: TapCharacterProps) {
  const { settings } = useSettings();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const { isSlowClicking, isFastClicking, recordClick } = useClickTracking();
  const { isNightTime } = useTimeOfDay();

  const getCharacterImage = () => {
    // Priority: Laser eyes > Sleepy > Bored > Normal
    if (isFastClicking) {
      return "/lovable-uploads/laser-eyes-cat.png"; // Laser eyes for > 7 CPS
    }
    if (isNightTime) {
      return "/lovable-uploads/sleepy-cat.png"; // Sleepy at night
    }
    if (isSlowClicking) {
      return "/lovable-uploads/bored-cat.png"; // Bored for < 1 CPS for 5+ seconds
    }
    
    // Normal states
    return isMouthOpen 
      ? "/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png" 
      : "/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png";
  };

  const handleTap = () => {
    setIsAnimating(true);
    setIsMouthOpen(true);
    recordClick();
    
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
        
        {/* Special effects for laser eyes */}
        {isFastClicking && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse scale-125" />
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-red-500 opacity-70 animate-pulse blur-sm"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-4 w-2 h-8 bg-red-500 opacity-70 animate-pulse blur-sm"></div>
          </>
        )}
        
        {/* BigMouthCat character */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <img 
            src={getCharacterImage()}
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
      
      {/* Character state indicator */}
      <div className="text-center">
        {isFastClicking && (
          <p className="text-red-400 font-bold text-sm animate-pulse">🔥 LASER MODE! 🔥</p>
        )}
        {isNightTime && !isFastClicking && (
          <p className="text-blue-300 text-sm">😴 Sleepy time...</p>
        )}
        {isSlowClicking && !isFastClicking && !isNightTime && (
          <p className="text-gray-400 text-sm">😑 Bored...</p>
        )}
      </div>
    </div>
  );
}
