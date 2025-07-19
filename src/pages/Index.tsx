
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
      <div className="pt-20 pb-32 px-4 flex flex-col items-center justify-center min-h-screen">
        {/* Tap Character */}
        <TapCharacter onTap={handleTap} />
      </div>

      {/* Bottom Global Taps Card */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="relative">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent h-32 -top-16"></div>
          
          {/* Main card */}
          <div className="relative bg-gradient-to-r from-rose-600/90 to-orange-600/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
            <div className="px-6 py-8 text-center">
              <div className="mb-2">
                <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  Global Taps
                </p>
              </div>
              <div className="mb-1">
                <p className="text-5xl font-bold text-white drop-shadow-lg">
                  {isLoading ? (
                    <span className="animate-pulse">---.---</span>
                  ) : (
                    globalTaps.toLocaleString()
                  )}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <p className="text-white/70 text-xs font-medium">
                  Live Global Count
                </p>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-white/30 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
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
