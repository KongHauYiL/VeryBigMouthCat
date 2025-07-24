
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PartyRoom {
  id: string;
  room_code: string;
  name: string;
  multiplier: number;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

interface PartyMember {
  id: string;
  room_id: string;
  username: string;
  joined_at: string;
  last_active: string;
}

export function usePartyRoom() {
  const queryClient = useQueryClient();
  const [currentRoom, setCurrentRoom] = useState<PartyRoom | null>(null);
  const [username, setUsername] = useState(() => {
    const stored = localStorage.getItem('partyUsername');
    return stored || `Player${Math.floor(Math.random() * 9999)}`;
  });

  // Generate random room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create party room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (roomName: string) => {
      const roomCode = generateRoomCode();
      const { data, error } = await supabase
        .from('party_rooms')
        .insert({
          room_code: roomCode,
          name: roomName,
          multiplier: 2,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (room) => {
      setCurrentRoom(room);
      // Automatically join the created room
      joinRoomMutation.mutate(room.room_code);
    }
  });

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: async (roomCode: string) => {
      // First find the room
      const { data: room, error: roomError } = await supabase
        .from('party_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (roomError) throw new Error('Room not found or expired');
      
      // Check if room is expired
      if (new Date(room.expires_at) < new Date()) {
        throw new Error('Room has expired');
      }

      // Join the room
      const { error: memberError } = await supabase
        .from('party_members')
        .upsert({
          room_id: room.id,
          username: username,
          last_active: new Date().toISOString()
        }, {
          onConflict: 'room_id,username'
        });
      
      if (memberError) throw memberError;
      
      return room;
    },
    onSuccess: (room) => {
      setCurrentRoom(room);
      localStorage.setItem('currentPartyRoom', room.id);
      localStorage.setItem('partyUsername', username);
    }
  });

  // Get room members
  const { data: members = [] } = useQuery({
    queryKey: ['partyMembers', currentRoom?.id],
    queryFn: async () => {
      if (!currentRoom) return [];
      
      const { data, error } = await supabase
        .from('party_members')
        .select('*')
        .eq('room_id', currentRoom.id)
        .order('joined_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentRoom,
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;
    
    await supabase
      .from('party_members')
      .delete()
      .eq('room_id', currentRoom.id)
      .eq('username', username);
    
    setCurrentRoom(null);
    localStorage.removeItem('currentPartyRoom');
  }, [currentRoom, username]);

  // Update last active
  const updateLastActive = useCallback(async () => {
    if (!currentRoom) return;
    
    await supabase
      .from('party_members')
      .update({ last_active: new Date().toISOString() })
      .eq('room_id', currentRoom.id)
      .eq('username', username);
  }, [currentRoom, username]);

  // Auto-rejoin room on page load
  useEffect(() => {
    const savedRoomId = localStorage.getItem('currentPartyRoom');
    if (savedRoomId && !currentRoom) {
      supabase
        .from('party_rooms')
        .select('*')
        .eq('id', savedRoomId)
        .eq('is_active', true)
        .single()
        .then(({ data, error }) => {
          if (!error && data && new Date(data.expires_at) > new Date()) {
            setCurrentRoom(data);
            // Rejoin the room
            supabase
              .from('party_members')
              .upsert({
                room_id: data.id,
                username: username,
                last_active: new Date().toISOString()
              });
          } else {
            localStorage.removeItem('currentPartyRoom');
          }
        });
    }
  }, [currentRoom, username]);

  // Listen for real-time updates
  useEffect(() => {
    if (!currentRoom) return;

    const channel = supabase
      .channel(`party-room-${currentRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'party_members',
          filter: `room_id=eq.${currentRoom.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['partyMembers', currentRoom.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom, queryClient]);

  // Periodic activity update
  useEffect(() => {
    if (!currentRoom) return;

    const interval = setInterval(updateLastActive, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [updateLastActive, currentRoom]);

  const joinRoom = (roomCode: string) => {
    joinRoomMutation.mutate(roomCode);
  };

  const createRoom = (roomName: string) => {
    createRoomMutation.mutate(roomName);
  };

  return {
    currentRoom,
    members,
    username,
    setUsername,
    createRoom,
    joinRoom,
    leaveRoom,
    updateLastActive,
    isCreating: createRoomMutation.isPending,
    isJoining: joinRoomMutation.isPending,
    error: createRoomMutation.error || joinRoomMutation.error,
  };
}
