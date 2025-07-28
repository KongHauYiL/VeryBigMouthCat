
import { useState, useEffect } from 'react';

export function useTimeOfDay() {
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const checkTimeOfDay = () => {
      const now = new Date();
      const hour = now.getHours();
      // Night time is 6 PM (18:00) to 6 AM (06:00)
      setIsNightTime(hour >= 18 || hour < 6);
    };

    checkTimeOfDay();
    
    // Check every minute
    const interval = setInterval(checkTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { isNightTime };
}
