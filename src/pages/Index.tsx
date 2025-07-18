
import React, { useState, useEffect } from 'react';
import { TapCharacter } from '@/components/TapCharacter';
import { GlobalCounter } from '@/components/GlobalCounter';
import { ChatBox } from '@/components/ChatBox';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useGlobalTaps } from '@/hooks/useGlobalTaps';
import { useSettings } from '@/hooks/useSettings';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { globalTaps, personalTaps, isLoading, handleTap } = useGlobalTaps();
  const { settings } = useSettings();

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Show PWA install prompt
  useEffect(() => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install prompt after a short delay
      setTimeout(() => {
        if (deferredPrompt && !localStorage.getItem('pwa-dismissed')) {
          const shouldInstall = confirm('Install Global Tap as an app for the best experience?');
          if (shouldInstall) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted PWA install');
              }
              deferredPrompt = null;
            });
          } else {
            localStorage.setItem('pwa-dismissed', 'true');
          }
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-orange-950/20 dark:via-rose-950/20 dark:to-pink-950/20">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Global Tap
          </h1>
          <p className="text-muted-foreground max-w-md">
            Tap the cat and connect with people worldwide! Every tap counts. 🌍
          </p>
        </div>

        {/* Global Counter */}
        <GlobalCounter globalTaps={globalTaps} isLoading={isLoading} />

        {/* Tap Character */}
        <TapCharacter onTap={handleTap} personalTaps={personalTaps} />

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground max-w-xs">
          <p>Tap the cat to add to the global counter!</p>
          <p className="mt-1">Chat with other tappers using the message button.</p>
        </div>
      </div>

      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onToggle={() => setIsSettingsOpen(!isSettingsOpen)} />
    </div>
  );
};

export default Index;
