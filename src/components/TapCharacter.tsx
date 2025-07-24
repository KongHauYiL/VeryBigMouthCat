
import React, { useState, useEffect } from 'react';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useLuckMultiplier } from '@/hooks/useLuckMultiplier';

interface TapCharacterProps {
  onTap: () => void;
  partyMultiplier: number;
}

export function TapCharacter({ onTap, partyMultiplier }: TapCharacterProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const { currentTimeOfDay } = useTimeOfDay();
  const { currentMultiplier: luckMultiplier, isActive: isLuckActive, timeRemaining, isRolling } = useLuckMultiplier();

  // Calculate total multiplier
  const totalMultiplier = partyMultiplier * luckMultiplier;

  // Image selection based on time of day
  const getImageSrc = () => {
    switch (currentTimeOfDay) {
      case 'morning':
        return '/lovable-uploads/sleepy-cat.png';
      case 'afternoon':
        return '/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png';
      case 'evening':
        return '/lovable-uploads/bored-cat.png';
      case 'night':
        return '/lovable-uploads/laser-eyes-cat.png';
      default:
        return '/lovable-uploads/20f26be6-ed3d-4bd1-864d-10e906df4ff5.png';
    }
  };

  const handleTap = () => {
    setIsPressed(true);
    setTapCount(prev => prev + 1);
    onTap();
    setTimeout(() => setIsPressed(false), 100);
  };

  // Generate floating numbers for visual feedback
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; value: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (tapCount > 0) {
      const id = Date.now();
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      setFloatingNumbers(prev => [...prev, { id, value: totalMultiplier, x, y }]);
      
      setTimeout(() => {
        setFloatingNumbers(prev => prev.filter(num => num.id !== id));
      }, 2000);
    }
  }, [tapCount, totalMultiplier]);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-8">
      {/* Luck Multiplier Indicator */}
      {isLuckActive && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-xl px-4 py-2">
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎲</span>
              <span className="text-yellow-400 font-bold">{luckMultiplier}x Luck!</span>
            </div>
            <p className="text-yellow-300 text-xs mt-1">
              {Math.ceil(timeRemaining / 1000)}s remaining
            </p>
          </div>
        </div>
      )}

      {/* Rolling Animation */}
      {isRolling && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl px-4 py-2">
          <div className="text-center">
            <div className="animate-spin text-2xl mb-1">🎲</div>
            <p className="text-purple-300 text-sm font-medium">Rolling...</p>
          </div>
        </div>
      )}

      {/* Character Image */}
      <div className="relative">
        <img
          src={getImageSrc()}
          alt="BigMouthCat"
          className={`w-64 h-64 object-contain cursor-pointer transition-all duration-100 select-none ${
            isPressed ? 'scale-95' : 'scale-100'
          } ${isPressed ? 'brightness-110' : ''}`}
          onClick={handleTap}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          draggable={false}
        />
        
        {/* Floating Numbers */}
        {floatingNumbers.map(num => (
          <div
            key={num.id}
            className="absolute pointer-events-none text-2xl font-bold text-white animate-ping"
            style={{
              left: `${num.x}%`,
              top: `${num.y}%`,
              animation: 'float 2s ease-out forwards'
            }}
          >
            +{num.value}
          </div>
        ))}
      </div>

      {/* Tap instruction */}
      <div className="text-center space-y-2">
        <p className="text-white/80 text-lg font-medium">
          Tap BigMouthCat!
        </p>
        {totalMultiplier > 1 && (
          <div className="flex items-center justify-center space-x-2 text-sm">
            {partyMultiplier > 1 && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">
                🎉 {partyMultiplier}x Party
              </span>
            )}
            {luckMultiplier > 1 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg">
                🎲 {luckMultiplier}x Luck
              </span>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
