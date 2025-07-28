import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useClickTracking } from '@/hooks/useClickTracking';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useComboCounter } from '@/hooks/useComboCounter';

interface TapCharacterProps {
  onTap: () => void;
  partyMultiplier?: number;
  onLaserMode?: () => void;
}

export function TapCharacter({ onTap, partyMultiplier = 1, onLaserMode }: TapCharacterProps) {
  const { settings } = useSettings();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [tapTrails, setTapTrails] = useState<Array<{id: number, x: number, y: number}>>([]);
  const { isSlowClicking, isFastClicking, recordClick } = useClickTracking();
  const { isNightTime } = useTimeOfDay();
  const { incrementCombo } = useComboCounter();

  const getCharacterImage = () => {
    // Priority: Laser eyes > Sleepy > Bored > Normal
    if (isFastClicking) {
      return "/public/lovable-uploads/laser-eyes-cat.png";
    }
    if (isNightTime && !isFastClicking) {
      return "/lovable-uploads/sleepy-cat.png";
    }
    if (isSlowClicking && !isFastClicking && !isNightTime) {
      return "/lovable-uploads/bored-cat.png";
    }
    
    // Normal states - mouth open/closed
    return isMouthOpen 
      ? "/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png" 
      : "/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png";
  };

  const createTapTrail = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now() + Math.random();
    setTapTrails(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setTapTrails(prev => prev.filter(trail => trail.id !== id));
    }, 1000);
  };

  const handleTap = (e: React.MouseEvent) => {
    console.log('🖱️ TapCharacter: handleTap called');
    setIsAnimating(true);
    setIsMouthOpen(true);
    recordClick();
    incrementCombo();
    
    // Create tap trail effect
    createTapTrail(e);
    
    // Trigger laser mode callback
    if (isFastClicking && onLaserMode) {
      onLaserMode();
    }

    // Enhanced haptic feedback based on multiplier
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      const pattern = partyMultiplier >= 4 ? [50, 50, 50] : [50];
      navigator.vibrate(pattern);
    }

    // Enhanced sound feedback
    if (settings.soundEnabled) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Different tones for different multipliers
        const baseFreq = 800 + (partyMultiplier * 100);
        oscillator.frequency.setValueAtTime(baseFreq, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.1);
      } catch (error) {
        console.log('Audio not supported or blocked');
      }
    }

    console.log('🖱️ TapCharacter: About to call onTap');
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
        {/* Tap trails */}
        {tapTrails.map((trail) => (
          <div
            key={trail.id}
            className="absolute pointer-events-none"
            style={{ left: trail.x, top: trail.y }}
          >
            <div className="w-4 h-4 bg-white/50 rounded-full animate-ping" />
          </div>
        ))}
        
        {/* Tap ripple effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping scale-150" />
        )}
        
        {/* Party multiplier effect */}
        {partyMultiplier > 1 && isAnimating && (
          <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping scale-175" />
        )}
        
        {/* Special effects for laser eyes */}
        {isFastClicking && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse scale-125" />
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -ml-2 w-2 h-8 bg-red-500 opacity-70 animate-pulse blur-sm"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-2 w-2 h-8 bg-red-500 opacity-70 animate-pulse blur-sm"></div>
          </>
        )}
        
        {/* BigMouthCat character */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <img 
            src={getCharacterImage()}
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => {
              console.log('Failed to load image:', e.currentTarget.src);
              e.currentTarget.src = isMouthOpen 
                ? "/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png" 
                : "/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png";
            }}
          />
          
          {/* Enhanced sparkles with multiplier effects */}
          {isAnimating && (
            <>
              <div className="absolute -top-4 -left-4 text-yellow-400 animate-bounce text-2xl">✨</div>
              <div className="absolute -top-4 -right-4 text-pink-400 animate-bounce delay-75 text-2xl">💫</div>
              <div className="absolute -bottom-4 -left-4 text-blue-400 animate-bounce delay-150 text-2xl">⭐</div>
              <div className="absolute -bottom-4 -right-4 text-green-400 animate-bounce delay-200 text-2xl">🌟</div>
              
              {/* Extra effects for high multipliers */}
              {partyMultiplier >= 4 && (
                <>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-purple-400 animate-bounce delay-300 text-3xl">🎆</div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-orange-400 animate-bounce delay-400 text-3xl">🔥</div>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Multiplier indicator */}
        {partyMultiplier > 1 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {partyMultiplier}x
          </div>
        )}
      </div>
      
      {/* Character state indicator */}
      <div className="text-center space-y-1">
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
