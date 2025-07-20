
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';
import { X, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SettingsPanel({ isOpen, onToggle }: SettingsPanelProps) {
  const { settings, updateSettings, resetPersonalCounter } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Settings
          </h2>
          <Button onClick={onToggle} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <Label htmlFor="sound" className="text-sm font-medium">Sound Effects</Label>
            <Switch 
              id="sound" 
              checked={settings.soundEnabled} 
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })} 
            />
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <Label htmlFor="vibration" className="text-sm font-medium">Vibration</Label>
            <Switch 
              id="vibration" 
              checked={settings.vibrationEnabled} 
              onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })} 
            />
          </div>

          {/* Reset Personal Counter */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Reset Personal Counter</Label>
              <Button
                onClick={resetPersonalCounter}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-200"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This will reset your personal tap counter to zero
            </p>
          </div>

          {/* Character Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-sm font-medium mb-3">Special Cat Modes</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>🔥</span>
                <span>Laser Eyes: > 7 clicks per second</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>😴</span>
                <span>Sleepy: 6 PM - 6 AM (local time)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>😑</span>
                <span>Bored: < 1 click per second for 5+ seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
