import { useState, useEffect, useRef } from 'react';

export function useClickTracking() {
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [isSlowClicking, setIsSlowClicking] = useState(false);
  const [isFastClicking, setIsFastClicking] = useState(false);
  
  const clickTimestamps = useRef<number[]>([]);
  const slowClickTimer = useRef<NodeJS.Timeout>();

  const recordClick = () => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    
    // Keep only clicks from the last second
    clickTimestamps.current = clickTimestamps.current.filter(
      timestamp => now - timestamp < 1000
    );
    
    const cps = clickTimestamps.current.length;
    setClicksPerSecond(cps);
    
    // Reset slow clicking timer
    if (slowClickTimer.current) {
      clearTimeout(slowClickTimer.current);
    }
    
    // Check for fast clicking (> 7 CPS)
    setIsFastClicking(cps > 7);
    
    // Set timer for slow clicking detection
    slowClickTimer.current = setTimeout(() => {
      setIsSlowClicking(true);
    }, 5000);
    
    // Reset slow clicking flag
    setIsSlowClicking(false);
  };

  useEffect(() => {
    return () => {
      if (slowClickTimer.current) {
        clearTimeout(slowClickTimer.current);
      }
    };
  }, []);

  return {
    clicksPerSecond,
    isSlowClicking,
    isFastClicking,
    recordClick
  };
}
