
import React, { useState, useEffect } from 'react';
import { TapCharacter } from '@/components/TapCharacter';
import { Navbar } from '@/components/Navbar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PartyRoomModal } from '@/components/PartyRoomModal';
import { PopWarsModal } from '@/components/PopWarsModal';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { ComboDisplay } from '@/components/ComboDisplay';
import { useGlobalTaps } from '@/hooks/useGlobalTaps';
import { usePartyRoom } from '@/hooks/usePartyRoom';
import { useComboCounter } from '@/hooks/useComboCounter';

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isPopWarsOpen, setIsPopWarsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const { currentRoom, updateLastActive } = usePartyRoom();
  const partyMultiplier = currentRoom?.multiplier || 1;
  
  const { combo, isComboActive } = useComboCounter();
  
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

  const handlePopWarsVote = () => {
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
        onPopWarsToggle={() => setIsPopWarsOpen(!isPopWarsOpen)}
        onLeaderboardToggle={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
        partyMultiplier={partyMultiplier}
      />

      {/* Main Content */}
      <div className="pt-20 pb-32 px-4 flex flex-col items-center justify-center min-h-screen">
        <TapCharacter 
          onTap={handleTap} 
          partyMultiplier={partyMultiplier}
        />
      </div>

      {/* Floating UI Elements */}
      <ComboDisplay combo={combo} isActive={isComboActive} />

      {/* Bottom Global Taps Card */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="relative">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent h-24 -top-8"></div>
          
          {/* Main card */}
          <div className={`relative backdrop-blur-xl border-t shadow-2xl ${
            currentRoom 
              ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-green-400/20' 
              : 'bg-gradient-to-r from-rose-600/90 to-orange-600/90 border-white/20'
          }`}>
            <div className="px-6 py-4 text-center">
              <div className="flex justify-center">
                <div>
                  <p className="text-white/80 text-xs font-medium tracking-wide uppercase mb-1">
                    Global Taps
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">
                    {isLoading ? (
                      <span className="animate-pulse">---.---</span>
                    ) : (
                      globalTaps.toLocaleString()
                    )}
                  </p>
                </div>
              </div>
              
              {/* Active multipliers display */}
              <div className="mt-2 flex justify-center space-x-2">
                {currentRoom && (
                  <div className="bg-green-500/20 rounded-lg px-3 py-1 border border-green-500/30">
                    <p className="text-green-200 text-sm font-medium">
                      🎉 {currentRoom.name} - {partyMultiplier}x
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsPanel isOpen={isSettingsOpen} onToggle={() => setIsSettingsOpen(!isSettingsOpen)} />
      <PartyRoomModal isOpen={isPartyOpen} onClose={() => setIsPartyOpen(false)} />
      <PopWarsModal 
        isOpen={isPopWarsOpen} 
        onClose={() => setIsPopWarsOpen(false)} 
        onVote={handlePopWarsVote}
      />
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
    </div>
  );
};

export default Index;
