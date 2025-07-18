
import React, { useState, useEffect } from 'react';
import { TapCharacter } from '@/components/TapCharacter';
import { Navbar } from '@/components/Navbar';
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
          const shouldInstall = confirm('Install BigMouthCat as an app for the best experience?');
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-orange-950/20 dark:via-rose-950/20 dark:to-pink-950/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-300/20 to-rose-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <Navbar 
        globalTaps={globalTaps} 
        isLoading={isLoading} 
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)} 
      />

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 flex flex-col items-center justify-center min-h-screen space-y-8">
        {/* Hero Text */}
        <div className="text-center space-y-4 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Tap BigMouthCat and connect with the world! 🌍
          </h2>
          <p className="text-muted-foreground text-lg">
            Every tap counts. Join thousands of players worldwide in this global tapping experience.
          </p>
        </div>

        {/* Tap Character */}
        <TapCharacter onTap={handleTap} personalTaps={personalTaps} />

        {/* Instructions */}
        <div className="text-center text-muted-foreground max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <p className="text-sm">
            🐱 <strong>Tap BigMouthCat</strong> to add to the global counter!
          </p>
          <p className="text-sm mt-2">
            💬 <strong>Chat with other tappers</strong> using the message button.
          </p>
          <p className="text-sm mt-2">
            ⚙️ <strong>Customize your experience</strong> in settings.
          </p>
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
