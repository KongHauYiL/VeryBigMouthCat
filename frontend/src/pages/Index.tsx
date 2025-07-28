
import React, { useState, useEffect } from 'react';
import { TapCharacter } from '@/components/TapCharacter';
import { Navbar } from '@/components/Navbar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PartyRoomModal } from '@/components/PartyRoomModal';
import { PopWarsModal } from '@/components/PopWarsModal';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { ComboDisplay } from '@/components/ComboDisplay';
import { ContinentSelectionModal } from '@/components/ContinentSelectionModal';
import { GlobalTapsCard } from '@/components/GlobalTapsCard';
import { useGlobalTaps } from '@/hooks/useGlobalTaps';
import { usePartyRoom } from '@/hooks/usePartyRoom';
import { useComboCounter } from '@/hooks/useComboCounter';
import { useSelectedContinent } from '@/hooks/useSelectedContinent';

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isPopWarsOpen, setIsPopWarsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const { currentRoom, updateLastActive } = usePartyRoom();
  const partyMultiplier = currentRoom?.multiplier || 1;
  
  const { combo, isComboActive } = useComboCounter();
  const { selectedContinent, hasSelectedContinent, selectContinent } = useSelectedContinent();
  
  const { globalTaps, handleTap: handleGlobalTap, isLoading } = useGlobalTaps(partyMultiplier, selectedContinent);

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

  const handleContinentSelect = (continent: { code: string; name: string; flag: string }) => {
    selectContinent(continent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-secondary/10 via-muted/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        {currentRoom && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        )}
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
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
      <div className="pt-24 pb-40 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          <TapCharacter 
            onTap={handleTap} 
            partyMultiplier={partyMultiplier}
          />
        </div>
      </div>

      {/* Floating UI Elements */}
      <ComboDisplay combo={combo} isActive={isComboActive} />

      {/* Enhanced Global Taps Card */}
      <GlobalTapsCard 
        globalTaps={globalTaps}
        isLoading={isLoading}
        currentRoom={currentRoom}
        partyMultiplier={partyMultiplier}
        selectedContinent={selectedContinent}
      />

      {/* Modals */}
      <ContinentSelectionModal 
        isOpen={!hasSelectedContinent}
        onSelectContinent={handleContinentSelect}
      />
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
