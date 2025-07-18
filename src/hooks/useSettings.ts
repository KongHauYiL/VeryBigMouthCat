
import { useLocalStorage } from './useLocalStorage';

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  username: string;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  username: `Tapper${Math.floor(Math.random() * 9999)}`,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('globalTapSettings', defaultSettings);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetPersonalCounter = () => {
    localStorage.removeItem('personalTapCount');
    window.location.reload();
  };

  return {
    settings,
    updateSettings,
    resetPersonalCounter,
  };
}
