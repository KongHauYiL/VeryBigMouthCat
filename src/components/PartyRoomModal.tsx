
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Users, Copy, ExternalLink } from 'lucide-react';
import { usePartyRoom } from '@/hooks/usePartyRoom';
import { toast } from '@/hooks/use-toast';

interface PartyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PartyRoomModal({ isOpen, onClose }: PartyRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  
  const {
    currentRoom,
    members,
    username,
    setUsername,
    createRoom,
    joinRoom,
    leaveRoom,
    isCreating,
    isJoining,
    error
  } = usePartyRoom();

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast({ title: "Please enter a room name", variant: "destructive" });
      return;
    }
    createRoom(roomName.trim());
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast({ title: "Please enter a room code", variant: "destructive" });
      return;
    }
    joinRoom(roomCode.trim());
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.room_code);
      toast({ title: "Room code copied to clipboard!" });
    }
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Party Room
          </h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Your Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-white/10 border-white/20"
            />
          </div>

          {currentRoom ? (
            /* Current Room Display */
            <div className="space-y-4">
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
                  <span className="text-sm font-medium">Room Members ({members.length})</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <span className={member.username === username ? 'font-bold text-rose-400' : 'text-white/80'}>
                        {member.username} {member.username === username && '(You)'}
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
          ) : (
            /* Join/Create Room Interface */
            <div className="space-y-4">
              {/* Tab Buttons */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('join')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'join'
                      ? 'bg-rose-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Join Room
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'create'
                      ? 'bg-rose-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Create Room
                </button>
              </div>

              {activeTab === 'join' ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="roomCode" className="text-sm font-medium">Room Code</Label>
                    <Input
                      id="roomCode"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Enter 6-digit room code"
                      maxLength={6}
                      className="bg-white/10 border-white/20 text-center text-lg font-mono"
                    />
                  </div>
                  <Button
                    onClick={handleJoinRoom}
                    disabled={isJoining || !roomCode.trim()}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  >
                    {isJoining ? 'Joining...' : 'Join Room'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="roomName" className="text-sm font-medium">Room Name</Label>
                    <Input
                      id="roomName"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={isCreating || !roomName.trim()}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  >
                    {isCreating ? 'Creating...' : 'Create Room'}
                  </Button>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                  <p className="text-sm text-red-200">
                    {error.message || 'An error occurred'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
            <p className="text-xs text-blue-200">
              💡 Party rooms expire after 24 hours. All clicks in a party room count for 2x towards the global counter!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
