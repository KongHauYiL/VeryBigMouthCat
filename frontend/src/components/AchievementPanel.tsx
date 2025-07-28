
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Trophy, Target } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementPanel({ isOpen, onClose }: AchievementPanelProps) {
  const { achievements, getUnlockedAchievements, getTotalProgress } = useAchievements();

  if (!isOpen) return null;

  const unlockedCount = getUnlockedAchievements().length;
  const totalProgress = getTotalProgress();

  const categoryGroups = {
    tapping: achievements.filter(a => a.category === 'tapping'),
    social: achievements.filter(a => a.category === 'social'),
    time: achievements.filter(a => a.category === 'time'),
    special: achievements.filter(a => a.category === 'special')
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Achievements
            </h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Summary */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm">Overall Progress</span>
            <span className="text-white/80 text-sm">{unlockedCount}/{achievements.length}</span>
          </div>
          <Progress value={totalProgress.percentage} className="h-2" />
          <p className="text-white/60 text-xs mt-2">
            {totalProgress.completed.toLocaleString()} / {totalProgress.total.toLocaleString()} points
          </p>
        </div>

        {/* Achievement List */}
        <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
          {Object.entries(categoryGroups).map(([category, categoryAchievements]) => (
            <div key={category}>
              <h3 className="text-white/90 font-medium mb-3 capitalize flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>{category}</span>
              </h3>
              <div className="space-y-3">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      achievement.unlocked
                        ? 'bg-green-500/20 border-green-500/30'
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium text-sm">{achievement.name}</h4>
                          {achievement.unlocked && (
                            <div className="text-green-400 text-xs">✓ Unlocked</div>
                          )}
                        </div>
                        <p className="text-white/70 text-xs mt-1">{achievement.description}</p>
                        
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1"
                            />
                            <p className="text-white/60 text-xs mt-1">
                              {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
