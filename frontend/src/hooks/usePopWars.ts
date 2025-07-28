
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PopWarsChoice {
  id: string;
  choice_text: string;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export function usePopWars() {
  const queryClient = useQueryClient();

  // Fetch choices
  const { data: choices = [], isLoading, error } = useQuery({
    queryKey: ['popWarsChoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pop_wars_choices')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as PopWarsChoice[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (choiceId: string) => {
      // Insert vote record
      const { error: voteError } = await supabase
        .from('pop_wars_votes')
        .insert({ choice_id: choiceId });
      
      if (voteError) throw voteError;

      // Update vote count
      const { error: updateError } = await supabase
        .from('pop_wars_choices')
        .update({ 
          vote_count: (choices.find(c => c.id === choiceId)?.vote_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', choiceId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popWarsChoices'] });
    },
    onError: (error) => {
      console.error('Failed to vote:', error);
    }
  });

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('pop-wars-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pop_wars_choices'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['popWarsChoices'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const vote = (choiceId: string) => {
    voteMutation.mutate(choiceId);
  };

  return {
    choices,
    isLoading,
    error,
    vote,
    isVoting: voteMutation.isPending,
  };
}
