
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'tapping' | 'social' | 'time' | 'special';
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-tap',
    name: 'First Contact',
    description: 'Make your first tap',
    icon: '👋',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'tapping'
  },
  {
    id: 'hundred-taps',
    name: 'Getting Started',
    description: 'Tap 100 times',
    icon: '💫',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'tapping'
  },
  {
    id: 'thousand-taps',
    name: 'Tap Master',
    description: 'Tap 1,000 times',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
    category: 'tapping'
  },
  {
    id: 'laser-mode',
    name: 'Speed Demon',
    description: 'Activate laser mode',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'special'
  },
  {
    id: 'party-joiner',
    name: 'Party Animal',
    description: 'Join a party room',
    icon: '🎉',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'social'
  },
  {
    id: 'pop-wars-voter',
    name: 'Opinion Maker',
    description: 'Vote in Pop Wars',
    icon: '🗳️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'social'
  }
];

export function useAchievements() {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', defaultAchievements);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useLocalStorage('userStats', {
    totalTaps: 0,
    laserModeActivated: false,
    partiesJoined: 0,
    popWarsVotes: 0,
    streakDays: 0,
    lastPlayDate: null as string | null
  });

  const updateProgress = (achievementId: string, progress: number) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const newProgress = Math.min(progress, achievement.maxProgress);
          const shouldUnlock = newProgress >= achievement.maxProgress;
          
          if (shouldUnlock) {
            const unlockedAchievement = {
              ...achievement,
              progress: newProgress,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };
            
            setRecentUnlocks(prev => [...prev, unlockedAchievement]);
            
            // Remove from recent unlocks after 5 seconds
            setTimeout(() => {
              setRecentUnlocks(prev => prev.filter(a => a.id !== achievementId));
            }, 5000);
            
            return unlockedAchievement;
          }
          
          return {
            ...achievement,
            progress: newProgress
          };
        }
        return achievement;
      })
    );
  };

  const recordTap = () => {
    const newTotalTaps = userStats.totalTaps + 1;
    setUserStats(prev => ({
      ...prev,
      totalTaps: newTotalTaps,
      lastPlayDate: new Date().toISOString()
    }));
    
    updateProgress('first-tap', 1);
    updateProgress('hundred-taps', newTotalTaps);
    updateProgress('thousand-taps', newTotalTaps);
  };

  const recordLaserMode = () => {
    if (!userStats.laserModeActivated) {
      setUserStats(prev => ({ ...prev, laserModeActivated: true }));
      updateProgress('laser-mode', 1);
    }
  };

  const recordPartyJoin = () => {
    const newPartiesJoined = userStats.partiesJoined + 1;
    setUserStats(prev => ({ ...prev, partiesJoined: newPartiesJoined }));
    updateProgress('party-joiner', 1);
  };

  const recordPopWarsVote = () => {
    const newVotes = userStats.popWarsVotes + 1;
    setUserStats(prev => ({ ...prev, popWarsVotes: newVotes }));
    updateProgress('pop-wars-voter', 1);
  };

  const getUnlockedAchievements = () => achievements.filter(a => a.unlocked);
  const getTotalProgress = () => {
    const total = achievements.reduce((sum, a) => sum + a.maxProgress, 0);
    const completed = achievements.reduce((sum, a) => sum + (a.unlocked ? a.maxProgress : a.progress), 0);
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return {
    achievements,
    recentUnlocks,
    userStats,
    recordTap,
    recordLaserMode,
    recordPartyJoin,
    recordPopWarsVote,
    getUnlockedAchievements,
    getTotalProgress
  };
}
