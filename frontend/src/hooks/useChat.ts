
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export function useChat() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const RATE_LIMIT_MS = 3000; // 3 seconds between messages
  const MESSAGE_EXPIRE_MS = 5 * 60 * 1000; // 5 minutes

  // Fetch messages (only from last 5 minutes)
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const fiveMinutesAgo = new Date(Date.now() - MESSAGE_EXPIRE_MS).toISOString();
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds to clean up expired messages
  });

  // Validate username
  const validateUsername = (username: string): boolean => {
    const lowerUsername = username.toLowerCase();
    return !lowerUsername.includes('server');
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ username, message }: { username: string; message: string }) => {
      const now = Date.now();
      if (now - lastMessageTime < RATE_LIMIT_MS) {
        throw new Error(`Please wait ${Math.ceil((RATE_LIMIT_MS - (now - lastMessageTime)) / 1000)} seconds before sending another message`);
      }

      if (!validateUsername(username)) {
        throw new Error('Username cannot contain "server"');
      }

      const { error } = await supabase
        .from('messages')
        .insert([{ username, message }]);
      
      if (error) throw error;
      setLastMessageTime(now);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSendMessage = () => {
    return Date.now() - lastMessageTime >= RATE_LIMIT_MS;
  };

  const getTimeUntilNextMessage = () => {
    const remaining = RATE_LIMIT_MS - (Date.now() - lastMessageTime);
    return Math.ceil(remaining / 1000);
  };

  return {
    messages,
    message,
    setMessage,
    messagesEndRef,
    isLoading,
    sendMessage: sendMessageMutation.mutate,
    isError: sendMessageMutation.isError,
    error: sendMessageMutation.error,
    canSendMessage,
    getTimeUntilNextMessage,
    validateUsername,
  };
}
