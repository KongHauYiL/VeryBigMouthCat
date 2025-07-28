
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Users, Copy, ArrowLeft } from 'lucide-react';
import { usePartyRoom } from '@/hooks/usePartyRoom';
import { toast } from '@/hooks/use-toast';

interface PartyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlowStep = 'main' | 'join-username' | 'create-username' | 'room-view';

export function PartyRoomModal({ isOpen, onClose }: PartyRoomModalProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>('main');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [pendingRoomCode, setPendingRoomCode] = useState('');
  const [pendingRoomName, setPendingRoomName] = useState('');
  
  const {
    currentRoom,
    members,
    username: currentUsername,
    setUsername: setCurrentUsername,
    createRoom,
    joinRoom,
    leaveRoom,
    isCreating,
    isJoining,
    error
  } = usePartyRoom();

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen && !currentRoom) {
      setFlowStep('main');
      setRoomName('');
      setRoomCode('');
      setUsername('');
      setPendingRoomCode('');
      setPendingRoomName('');
    } else if (isOpen && currentRoom) {
      setFlowStep('room-view');
    }
  }, [isOpen, currentRoom]);

  const handleJoinClick = () => {
    if (!roomCode.trim()) {
      toast({ title: "Please enter a room code", variant: "destructive" });
      return;
    }
    setPendingRoomCode(roomCode.trim());
    setFlowStep('join-username');
  };

  const handleCreateClick = () => {
    if (!roomName.trim()) {
      toast({ title: "Please enter a room name", variant: "destructive" });
      return;
    }
    setPendingRoomName(roomName.trim());
    setFlowStep('create-username');
  };

  const handleJoinSubmit = () => {
    if (!username.trim()) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }
    setCurrentUsername(username.trim());
    joinRoom(pendingRoomCode);
    setFlowStep('room-view');
  };

  const handleCreateSubmit = () => {
    if (!username.trim()) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }
    setCurrentUsername(username.trim());
    createRoom(pendingRoomName);
    setFlowStep('room-view');
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.room_code);
      toast({ title: "Room code copied to clipboard!" });
    }
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();
    setFlowStep('main');
    setRoomName('');
    setRoomCode('');
    setUsername('');
    setPendingRoomCode('');
    setPendingRoomName('');
  };

  const handleBack = () => {
    if (flowStep === 'join-username' || flowStep === 'create-username') {
      setFlowStep('main');
      setUsername('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            {(flowStep === 'join-username' || flowStep === 'create-username') && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            )}
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Party Room
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {flowStep === 'main' && (
            <div className="space-y-6">
              {/* Join Room Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Join Room</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="roomCode" className="text-sm font-medium text-white">Room Code</Label>
                    <Input
                      id="roomCode"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Enter 6-digit room code"
                      maxLength={6}
                      className="bg-white/10 border-white/20 text-center text-lg font-mono text-white placeholder:text-white/50"
                    />
                  </div>
                  <Button
                    onClick={handleJoinClick}
                    disabled={!roomCode.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Continue to Join
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white/60 text-sm">OR</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Create Room Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Create Room</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="roomName" className="text-sm font-medium text-white">Room Name</Label>
                    <Input
                      id="roomName"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Button
                    onClick={handleCreateClick}
                    disabled={!roomName.trim()}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  >
                    Continue to Create
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                <p className="text-xs text-blue-200">
                  💡 Party rooms give you 2x multiplier for all taps! Rooms expire after 24 hours.
                </p>
              </div>
            </div>
          )}

          {flowStep === 'join-username' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Choose Your Username</h3>
                <p className="text-sm text-white/70">You're joining room: <span className="font-mono text-blue-400">{pendingRoomCode}</span></p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinSubmit()}
                  />
                </div>
                
                <Button
                  onClick={handleJoinSubmit}
                  disabled={!username.trim() || isJoining}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                    <p className="text-sm text-red-200">
                      {error.message || 'Failed to join room'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {flowStep === 'create-username' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Choose Your Username</h3>
                <p className="text-sm text-white/70">Creating room: <span className="text-rose-400">{pendingRoomName}</span></p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateSubmit()}
                  />
                </div>
                
                <Button
                  onClick={handleCreateSubmit}
                  disabled={!username.trim() || isCreating}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                >
                  {isCreating ? 'Creating...' : 'Create Room'}
                </Button>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                    <p className="text-sm text-red-200">
                      {error.message || 'Failed to create room'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {flowStep === 'room-view' && currentRoom && (
            <div className="space-y-6">
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-green-200">{currentRoom.name}</h3>
                  <Button
                    onClick={copyRoomCode}
                    variant="ghost"
                    size="sm"
                    className="text-green-200 hover:bg-green-500/20"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {currentRoom.room_code}
                  </Button>
                </div>
                <p className="text-sm text-green-200/80">
                  🎉 All clicks worth {currentRoom.multiplier}x in this room!
                </p>
              </div>

              {/* Room Members */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium text-white">Room Members ({members.length})</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <span className={member.username === currentUsername ? 'font-bold text-rose-400' : 'text-white/80'}>
                        {member.username} {member.username === currentUsername && '(You)'}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(member.last_active).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleLeaveRoom}
                variant="outline"
                className="w-full bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-200"
              >
                Leave Room
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
