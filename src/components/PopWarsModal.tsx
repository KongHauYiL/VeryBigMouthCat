
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
    onVote(); // This will trigger the global tap increment
  };

  const totalVotes = choices.reduce((sum, choice) => sum + choice.vote_count, 0);

  // Map choices to fixed display order
  const getDisplayText = (choice: any) => {
    if (choice.choice_text === 'Choice 1') return 'Pepsi';
    if (choice.choice_text === 'Choice 2') return 'Coke';
    return choice.choice_text;
  };

  // Sort choices to ensure consistent order (Choice 1 first, then Choice 2)
  const sortedChoices = [...choices].sort((a, b) => {
    if (a.choice_text === 'Choice 1') return -1;
    if (b.choice_text === 'Choice 1') return 1;
    return 0;
  });

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
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">The Superior Soda?</h3>
                <p className="text-white/80 text-sm">
                  Vote for your choice! You can vote as many times as you want.
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Total votes: {totalVotes.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                {sortedChoices.map((choice) => {
                  const percentage = totalVotes > 0 ? (choice.vote_count / totalVotes) * 100 : 0;
                  const displayText = getDisplayText(choice);
                  
                  return (
                    <div key={choice.id} className="space-y-2">
                      <Button
                        onClick={() => handleVote(choice.id)}
                        disabled={isVoting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-4 text-lg"
                      >
                        {displayText}
                      </Button>
                      
                      {/* Vote count and percentage */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70">
                          {choice.vote_count.toLocaleString()} votes
                        </span>
                        <span className="text-white/70">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mt-6">
                <p className="text-blue-200 text-sm">
                  💡 Each vote also counts toward the global tap counter and benefits from party multipliers!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
