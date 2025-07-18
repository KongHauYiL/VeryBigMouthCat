
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';
import { Settings, X, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SettingsPanel({ isOpen, onToggle }: SettingsPanelProps) {
  const { settings, updateSettings, resetPersonalCounter } = useSettings();

  React.useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 rounded-full w-12 h-12 shadow-lg"
      >
        <Settings className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button onClick={onToggle} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={settings.username}
              onChange={(e) => updateSettings({ username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound Effects</Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="vibration">Vibration</Label>
            <Switch
              id="vibration"
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
            />
          </div>

          {/* Reset Personal Counter */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={resetPersonalCounter}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Personal Counter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
