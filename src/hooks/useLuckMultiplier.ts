
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface LuckMultiplierData {
  multiplier: number;
  expiresAt: number;
  lastRoll: number;
}

const PLAY_TIME_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const MULTIPLIER_DURATION = 5 * 60 * 1000; // 5 minutes multiplier duration

export function useLuckMultiplier() {
  const [luckData, setLuckData] = useLocalStorage<LuckMultiplierData>('luck-multiplier', {
    multiplier: 1,
    expiresAt: 0,
    lastRoll: 0
  });
  
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [timeUntilNextRoll, setTimeUntilNextRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Roll dice for multiplier (1-6)
  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const now = Date.now();
    const expiresAt = now + MULTIPLIER_DURATION;
    
    setLuckData({
      multiplier: roll,
      expiresAt,
      lastRoll: now
    });
    
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 1000);
    
    return roll;
  };

  // Check if user is eligible for a luck roll
  const canRoll = () => {
    const now = Date.now();
    return now - luckData.lastRoll >= PLAY_TIME_INTERVAL;
  };

  // Auto-roll if eligible
  const checkForAutoRoll = () => {
    if (canRoll()) {
      rollDice();
    }
  };

  // Update current multiplier based on expiration
  useEffect(() => {
    const updateMultiplier = () => {
      const now = Date.now();
      if (luckData.expiresAt > now) {
        setCurrentMultiplier(luckData.multiplier);
      } else {
        setCurrentMultiplier(1);
      }
    };

    updateMultiplier();
    const interval = setInterval(updateMultiplier, 1000);
    return () => clearInterval(interval);
  }, [luckData]);

  // Update time until next roll
  useEffect(() => {
    const updateTimeUntilNextRoll = () => {
      const now = Date.now();
      const timeSinceLastRoll = now - luckData.lastRoll;
      const timeUntilNext = Math.max(0, PLAY_TIME_INTERVAL - timeSinceLastRoll);
      setTimeUntilNextRoll(timeUntilNext);
    };

    updateTimeUntilNextRoll();
    intervalRef.current = setInterval(updateTimeUntilNextRoll, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [luckData.lastRoll]);

  // Auto-check for rolls every minute
  useEffect(() => {
    const autoCheckInterval = setInterval(checkForAutoRoll, 60000);
    return () => clearInterval(autoCheckInterval);
  }, [luckData.lastRoll]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isActive = currentMultiplier > 1;
  const timeRemaining = Math.max(0, luckData.expiresAt - Date.now());

  return {
    currentMultiplier,
    isActive,
    timeRemaining,
    timeUntilNextRoll,
    canRoll: canRoll(),
    rollDice,
    isRolling,
    formatTime
  };
}
