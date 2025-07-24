
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, User, Trophy, Target } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { userStats, getUnlockedAchievements } = useAchievements();
  const [username, setUsername] = useLocalStorage('username', '');
  const [tempUsername, setTempUsername] = React.useState(username);

  const handleSave = () => {
    setUsername(tempUsername);
    onClose();
  };

  if (!isOpen) return null;

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Username</label>
            <Input
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Stats */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-white/90 font-medium mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Statistics</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userStats.totalTaps.toLocaleString()}</div>
                <div className="text-white/60 text-xs">Total Taps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
                <div className="text-white/60 text-xs">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userStats.partiesJoined}</div>
                <div className="text-white/60 text-xs">Parties Joined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userStats.popWarsVotes}</div>
                <div className="text-white/60 text-xs">Pop Wars Votes</div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-white/90 font-medium mb-3 flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Recent Achievements</span>
            </h3>
            {unlockedAchievements.length > 0 ? (
              <div className="space-y-2">
                {unlockedAchievements.slice(-3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                    <div className="text-lg">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="text-white/90 text-sm font-medium">{achievement.name}</div>
                      <div className="text-white/60 text-xs">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No achievements yet. Start tapping!</p>
            )}
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
