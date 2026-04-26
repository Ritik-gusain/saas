"use client";

import MessageBubble from './MessageBubble';
import { Logo } from '@/components/shared/Logo';

interface MessageThreadProps {
  messages: Array<{
    id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at?: string;
    model?: string;
  }>;
  isLoading?: boolean;
}

export default function MessageThread({ messages, isLoading }: MessageThreadProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-subtle">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-6 animate-float">
            <Logo size={32} />
          </div>
          <h3 className="text-xl font-bold text-white font-[Montserrat] mb-2">How can I help you today?</h3>
          <p className="text-sm text-[var(--muted)] max-w-xs">
            Start a conversation with your team AI. I can help with research, coding, or marketing strategies.
          </p>
        </div>
      ) : (
        messages.filter(m => m.role !== 'system').map((msg, idx) => (
          <MessageBubble 
            key={msg.id || idx}
            role={msg.role as 'user' | 'assistant'}
            content={msg.content}
            timestamp={msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : undefined}
          />
        ))
      )}

      {isLoading && (
        <div className="flex gap-5 max-w-4xl animate-pulse">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center">
            <Logo size={20} animated={false} />
          </div>
          <div className="glass-panel rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );
}
