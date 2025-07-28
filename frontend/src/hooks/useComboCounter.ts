
import { useState, useEffect, useRef } from 'react';

export function useComboCounter() {
  const [combo, setCombo] = useState(0);
  const [isComboActive, setIsComboActive] = useState(false);
  const [maxCombo, setMaxCombo] = useState(0);
  const comboTimer = useRef<NodeJS.Timeout>();

  const incrementCombo = () => {
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(max => Math.max(max, newCombo));
      return newCombo;
    });
    setIsComboActive(true);

    // Reset combo after 2 seconds of inactivity
    if (comboTimer.current) {
      clearTimeout(comboTimer.current);
    }
    
    comboTimer.current = setTimeout(() => {
      setCombo(0);
      setIsComboActive(false);
    }, 2000);
  };

  const resetCombo = () => {
    setCombo(0);
    setIsComboActive(false);
    if (comboTimer.current) {
      clearTimeout(comboTimer.current);
    }
  };

  useEffect(() => {
    return () => {
      if (comboTimer.current) {
        clearTimeout(comboTimer.current);
      }
    };
  }, []);

  return {
    combo,
    isComboActive,
    maxCombo,
    incrementCombo,
    resetCombo
  };
}
