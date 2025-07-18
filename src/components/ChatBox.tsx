
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { MessageCircle, Send, X } from 'lucide-react';

interface ChatBoxProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatBox({ isOpen, onToggle }: ChatBoxProps) {
  const { settings } = useSettings();
  const {
    messages,
    message,
    setMessage,
    messagesEndRef,
    isLoading,
    sendMessage,
    isError,
    error,
    canSendMessage,
    getTimeUntilNextMessage,
    validateUsername,
  } = useChat();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canSendMessage()) return;
    
    if (!validateUsername(settings.username)) {
      return;
    }
    
    sendMessage({
      username: settings.username,
      message: message.trim(),
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 backdrop-blur-md border border-white/20"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h3 className="font-semibold text-lg bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
          Global Chat
        </h3>
        <Button onClick={onToggle} variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm">
            Loading messages...
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <span className="font-semibold text-primary bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                  {msg.username}:
                </span>
                <span className="ml-2 text-foreground">{msg.message}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/20">
        {isError && (
          <div className="text-xs text-red-400 mb-2 bg-red-500/20 backdrop-blur-md rounded-lg p-2 border border-red-500/30">
            {error?.message || 'Failed to send message'}
          </div>
        )}
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm bg-white/20 backdrop-blur-md border-white/30 focus:border-rose-400"
            maxLength={200}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!message.trim() || !canSendMessage()}
            className="h-10 w-10 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!canSendMessage() && (
          <div className="text-xs text-muted-foreground mt-1">
            Please wait {getTimeUntilNextMessage()}s before sending another message
          </div>
        )}
      </form>
    </div>
  );
}
