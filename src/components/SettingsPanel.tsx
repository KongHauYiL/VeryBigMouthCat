
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import { useAutoTapAPI } from '@/hooks/useAutoTapAPI';
import { KriptasEditor } from './KriptasEditor';
import { X, RotateCcw, Code, Settings as SettingsIcon } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SettingsPanel({ isOpen, onToggle }: SettingsPanelProps) {
  const { settings, updateSettings, resetPersonalCounter } = useSettings();
  const { executeProgram, isExecuting } = useAutoTapAPI();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Settings & Auto-Tap
          </h2>
          <Button onClick={onToggle} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="autotap" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Auto-Tap API
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  value={settings.username}
                  onChange={(e) => updateSettings({ username: e.target.value })}
                  placeholder="Enter your username"
                  className="bg-white/20 backdrop-blur-md border-white/30 focus:border-rose-400"
                />
                <p className="text-xs text-muted-foreground">
                  Cannot contain "server" in any form
                </p>
              </div>

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
              <div className="pt-4 border-t border-white/20">
                <Button
                  onClick={resetPersonalCounter}
                  variant="outline"
                  className="w-full bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Personal Counter
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="autotap" className="space-y-6">
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <h3 className="font-semibold mb-2">⚠️ Auto-Tap Challenge System</h3>
                <p className="text-sm text-yellow-200">
                  This system requires solving mathematical and cryptographic challenges before allowing automated tapping. 
                  Programs written in Kriptas language must prove computational work to prevent spam.
                </p>
              </div>

              <KriptasEditor onExecute={executeProgram} />

              {isExecuting && (
                <div className="text-center py-4">
                  <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Executing program...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
