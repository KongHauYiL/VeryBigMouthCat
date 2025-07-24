
import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Award, Globe } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CountryData {
  country: string;
  flag: string;
  taps: number;
  users: number;
}

const MOCK_LEADERBOARD: CountryData[] = [
  { country: "United States", flag: "🇺🇸", taps: 8542311, users: 1247 },
  { country: "Japan", flag: "🇯🇵", taps: 6234567, users: 892 },
  { country: "Germany", flag: "🇩🇪", taps: 4123890, users: 634 },
  { country: "United Kingdom", flag: "🇬🇧", taps: 3567234, users: 578 },
  { country: "France", flag: "🇫🇷", taps: 2987654, users: 445 },
  { country: "Canada", flag: "🇨🇦", taps: 2456789, users: 367 },
  { country: "Australia", flag: "🇦🇺", taps: 1987432, users: 298 },
  { country: "South Korea", flag: "🇰🇷", taps: 1765234, users: 276 },
  { country: "Brazil", flag: "🇧🇷", taps: 1543267, users: 234 },
  { country: "Italy", flag: "🇮🇹", taps: 1324567, users: 198 },
];

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<CountryData[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Simulate loading delay
      setTimeout(() => {
        setLeaderboard(MOCK_LEADERBOARD);
      }, 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{position}</span>;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Country Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-white/60">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {leaderboard.map((country, index) => {
                const position = index + 1;
                return (
                  <div
                    key={country.country}
                    className={`p-4 rounded-xl border backdrop-blur-sm ${getRankBg(position)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(position)}
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <p className="text-white font-medium">{country.country}</p>
                            <p className="text-white/60 text-sm">{country.users.toLocaleString()} players</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{country.taps.toLocaleString()}</p>
                        <p className="text-white/60 text-sm">taps</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-white/60 text-sm text-center">
            Rankings update every hour
          </p>
        </div>
      </div>
    </div>
  );
}
