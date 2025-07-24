
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, History } from 'lucide-react';
import { usePopWars } from '@/hooks/usePopWars';

interface PopWarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: () => void;
}

export function PopWarsModal({ isOpen, onClose, onVote }: PopWarsModalProps) {
  const { choices, isLoading, vote, isVoting } = usePopWars();

  if (!isOpen) return null;

  const handleVote = (choiceId: string) => {
    vote(choiceId);
    onVote();
  };

  // Fixed order mapping to prevent button switching
  const getChoiceDisplay = (choice: any) => {
    if (choice.choice_text === 'Choice 1') {
      return { text: 'Pepsi', emoji: '🥤', color: 'from-blue-600 to-blue-700' };
    } else if (choice.choice_text === 'Choice 2') {
      return { text: 'Coke', emoji: '🥤', color: 'from-red-600 to-red-700' };
    }
    return { text: choice.choice_text, emoji: '🗳️', color: 'from-purple-600 to-pink-600' };
  };

  const totalVotes = choices.reduce((sum, choice) => sum + choice.vote_count, 0);
  const sortedChoices = [...choices].sort((a, b) => a.choice_text.localeCompare(b.choice_text));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ⚔️ Pop Wars
          </h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white/70 mt-2">Loading choices...</p>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">The Superior Soda?</h3>
                <p className="text-white/80 text-sm">
                  Vote for your choice! You can vote as many times as you want.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-white/60" />
                    <span className="text-white/60 text-xs">
                      {totalVotes.toLocaleString()} total votes
                    </span>
                  </div>
                </div>
              </div>

              {/* Voting Options */}
              <div className="space-y-4">
                {sortedChoices.map((choice) => {
                  const displayInfo = getChoiceDisplay(choice);
                  const percentage = totalVotes > 0 ? (choice.vote_count / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={choice.id} className="space-y-2">
                      <Button
                        onClick={() => handleVote(choice.id)}
                        disabled={isVoting}
                        className={`w-full bg-gradient-to-r ${displayInfo.color} hover:opacity-90 text-white font-medium py-6 text-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>{displayInfo.emoji}</span>
                          <span>{displayInfo.text}</span>
                        </span>
                      </Button>
                      
                      {/* Vote statistics */}
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/80 text-sm font-medium">
                            {choice.vote_count.toLocaleString()} votes
                          </span>
                          <span className="text-white/80 text-sm font-bold">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${displayInfo.color} h-3 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Battle Status */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <History className="h-4 w-4 text-purple-300" />
                  <span className="text-purple-300 text-sm font-medium">Battle Status</span>
                </div>
                <div className="text-center">
                  {totalVotes > 0 ? (
                    <div className="text-white/90 text-sm">
                      {sortedChoices[0]?.vote_count === sortedChoices[1]?.vote_count ? (
                        <>🤝 It's a tie! The battle continues...</>
                      ) : (
                        <>
                          🏆 {getChoiceDisplay(sortedChoices.reduce((a, b) => a.vote_count > b.vote_count ? a : b)).text} is winning!
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-white/90 text-sm">🎯 Be the first to vote!</div>
                  )}
                </div>
              </div>

              {/* Rewards Info */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-200 text-sm">
                  💡 Each vote counts toward global taps and benefits from all active multipliers!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
