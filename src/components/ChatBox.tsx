
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
  } = useChat();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canSendMessage()) return;
    
    sendMessage({
      username: settings.username,
      message: message.trim(),
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Global Chat</h3>
        <Button onClick={onToggle} variant="ghost" size="icon" className="h-8 w-8">
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
              <div key={msg.id} className="text-sm">
                <span className="font-medium text-primary">{msg.username}:</span>
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
      <form onSubmit={handleSend} className="p-4 border-t border-border">
        {isError && (
          <div className="text-xs text-red-500 mb-2">
            {error?.message || 'Failed to send message'}
          </div>
        )}
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm"
            maxLength={200}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!message.trim() || !canSendMessage()}
            className="h-10 w-10"
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
