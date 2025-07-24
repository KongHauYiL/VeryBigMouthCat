
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface LuckMultiplier {
  value: number;
  expiresAt: number;
  rollTime: number;
}

export function useLuckMultiplier() {
  const [luckMultiplier, setLuckMultiplier] = useLocalStorage<LuckMultiplier | null>('luckMultiplier', null);
  const [timeToNextRoll, setTimeToNextRoll] = useState(0);
  const [sessionStartTime] = useLocalStorage('sessionStartTime', Date.now());

  const rollLuckMultiplier = () => {
    const roll = Math.random();
    let value = 1;
    
    if (roll < 0.4) value = 2;      // 40% chance for 2x
    else if (roll < 0.65) value = 3; // 25% chance for 3x
    else if (roll < 0.8) value = 4;  // 15% chance for 4x
    else if (roll < 0.9) value = 5;  // 10% chance for 5x
    else if (roll < 0.95) value = 6; // 5% chance for 6x
    else if (roll < 0.98) value = 7; // 3% chance for 7x
    else if (roll < 0.995) value = 8; // 1.5% chance for 8x
    else if (roll < 0.999) value = 9; // 0.4% chance for 9x
    else value = 10;                  // 0.1% chance for 10x

    const now = Date.now();
    const duration = value === 1 ? 0 : 5 * 60 * 1000; // 5 minutes for multipliers > 1
    
    const newMultiplier = {
      value,
      expiresAt: now + duration,
      rollTime: now
    };
    
    setLuckMultiplier(newMultiplier);
    return newMultiplier;
  };

  const checkForLuckRoll = () => {
    const now = Date.now();
    const playTime = now - sessionStartTime;
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (playTime >= fifteenMinutes) {
      const lastRoll = luckMultiplier?.rollTime || sessionStartTime;
      const timeSinceLastRoll = now - lastRoll;
      
      if (timeSinceLastRoll >= fifteenMinutes) {
        return rollLuckMultiplier();
      }
    }
    
    return null;
  };

  const getCurrentMultiplier = () => {
    if (!luckMultiplier) return 1;
    
    const now = Date.now();
    if (now > luckMultiplier.expiresAt) {
      setLuckMultiplier(null);
      return 1;
    }
    
    return luckMultiplier.value;
  };

  const getTimeToNextRoll = () => {
    const now = Date.now();
    const playTime = now - sessionStartTime;
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (playTime < fifteenMinutes) {
      return fifteenMinutes - playTime;
    }
    
    const lastRoll = luckMultiplier?.rollTime || sessionStartTime;
    const timeSinceLastRoll = now - lastRoll;
    
    if (timeSinceLastRoll >= fifteenMinutes) {
      return 0; // Can roll now
    }
    
    return fifteenMinutes - timeSinceLastRoll;
  };

  const getTimeRemaining = () => {
    if (!luckMultiplier || luckMultiplier.value === 1) return 0;
    
    const now = Date.now();
    return Math.max(0, luckMultiplier.expiresAt - now);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToNextRoll(getTimeToNextRoll());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime, luckMultiplier]);

  return {
    getCurrentMultiplier,
    getTimeToNextRoll,
    getTimeRemaining,
    checkForLuckRoll,
    rollLuckMultiplier,
    timeToNextRoll
  };
}
