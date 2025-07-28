
import { useLocalStorage } from './useLocalStorage';

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: true, // Force dark mode as default
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('globalTapSettings', defaultSettings);

  const updateSettings = (updates: Partial<Settings>) => {
    // Force dark mode to always be true
    const updatedSettings = { ...updates };
    if ('darkMode' in updatedSettings) {
      updatedSettings.darkMode = true;
    }
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };

  // Ensure dark mode is always enabled
  const settingsWithForcedDarkMode = {
    ...settings,
    darkMode: true
  };

  return {
    settings: settingsWithForcedDarkMode,
    updateSettings,
  };
}
