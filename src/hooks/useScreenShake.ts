
import { useState, useEffect } from 'react';

export function useScreenShake() {
  const [isShaking, setIsShaking] = useState(false);

  const shake = (intensity = 'medium') => {
    setIsShaking(true);
    
    const shakeClass = {
      light: 'animate-shake-light',
      medium: 'animate-shake-medium',
      intense: 'animate-shake-intense'
    }[intensity] || 'animate-shake-medium';

    document.body.classList.add(shakeClass);
    
    setTimeout(() => {
      document.body.classList.remove(shakeClass);
      setIsShaking(false);
    }, 200);
  };

  return { isShaking, shake };
}
