
import React, { useState, useEffect } from 'react';
import { TapCharacter } from '@/components/TapCharacter';
import { Navbar } from '@/components/Navbar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PartyRoomModal } from '@/components/PartyRoomModal';
import { useGlobalTaps } from '@/hooks/useGlobalTaps';
import { usePartyRoom } from '@/hooks/usePartyRoom';

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  
  const { currentRoom, updateLastActive } = usePartyRoom();
  const partyMultiplier = currentRoom?.multiplier || 1;
  const { globalTaps, handleTap: handleGlobalTap, isLoading } = useGlobalTaps(partyMultiplier);

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

  const handleTap = () => {
    handleGlobalTap();
    if (currentRoom) {
      updateLastActive();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950/20 via-rose-950/20 to-pink-950/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-300/20 to-rose-300/20 rounded-full blur-3xl"></div>
        {currentRoom && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
        )}
      </div>

      {/* Navbar */}
      <Navbar 
        globalTaps={globalTaps} 
        isLoading={isLoading} 
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        onPartyToggle={() => setIsPartyOpen(!isPartyOpen)}
        partyMultiplier={partyMultiplier}
      />

      {/* Main Content */}
      <div className="pt-20 pb-32 px-4 flex flex-col items-center justify-center min-h-screen">
        <TapCharacter onTap={handleTap} partyMultiplier={partyMultiplier} />
      </div>

      {/* Bottom Global Taps Card */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="relative">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent h-32 -top-16"></div>
          
          {/* Main card */}
          <div className={`relative backdrop-blur-xl border-t shadow-2xl ${
            currentRoom 
              ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-green-400/20' 
              : 'bg-gradient-to-r from-rose-600/90 to-orange-600/90 border-white/20'
          }`}>
            <div className="px-6 py-6 text-center">
              <div className="flex justify-center">
                <div>
                  <p className="text-white/80 text-xs font-medium tracking-wide uppercase mb-1">
                    Global Taps {currentRoom && `(${partyMultiplier}x Multiplier)`}
                  </p>
                  <p className="text-3xl font-bold text-white drop-shadow-lg">
                    {isLoading ? (
                      <span className="animate-pulse">---.---</span>
                    ) : (
                      globalTaps.toLocaleString()
                    )}
                  </p>
                </div>
              </div>
              
              {currentRoom && (
                <div className="mt-3 bg-white/20 rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium">
                    🎉 Party Room: {currentRoom.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    Code: {currentRoom.room_code}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <p className="text-white/70 text-xs font-medium">
                  Live Global Count
                </p>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-white/30 rounded-full"></div>
            <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center ${
              currentRoom 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-rose-500 to-orange-500'
            }`}>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onToggle={() => setIsSettingsOpen(!isSettingsOpen)} />

      {/* Party Room Modal */}
      <PartyRoomModal isOpen={isPartyOpen} onClose={() => setIsPartyOpen(false)} />
    </div>
  );
};

export default Index;
