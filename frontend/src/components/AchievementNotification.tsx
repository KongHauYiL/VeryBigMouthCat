
import React from 'react';
import { Achievement } from '@/hooks/useAchievements';

interface AchievementNotificationProps {
  achievement: Achievement;
}

export function AchievementNotification({ achievement }: AchievementNotificationProps) {
  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-xl border border-yellow-400/20 rounded-2xl shadow-2xl p-4 min-w-[280px]">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-bounce">🏆</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Achievement Unlocked!</p>
            <p className="text-white/90 text-xs">{achievement.name}</p>
            <p className="text-white/70 text-xs mt-1">{achievement.description}</p>
          </div>
          <div className="text-2xl">{achievement.icon}</div>
        </div>
      </div>
    </div>
  );
}
