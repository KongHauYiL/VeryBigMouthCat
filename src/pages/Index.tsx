
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
  const {
    globalTaps,
    handleTap,
    isLoading,
    error
  } = useGlobalTaps();
  const {
    settings
  } = useSettings();

  // Apply dark mode (always enabled)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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

  // Show error state if there's a critical error
  if (error) {
    console.error('Critical error in Index component:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950/20 via-rose-950/20 to-pink-950/20 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">Please refresh the page to try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950/20 via-rose-950/20 to-pink-950/20 relative overflow-hidden">
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
        {/* Tap Character */}
        <TapCharacter onTap={handleTap} />

        {/* Global Taps Card */}
        <div className="text-center text-muted-foreground max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <p className="text-sm text-muted-foreground font-medium mb-2">Global taps</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
            {isLoading ? <span className="animate-pulse">---.---</span> : globalTaps.toLocaleString()}
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
