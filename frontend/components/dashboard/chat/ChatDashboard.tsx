"use client";

import { useState } from 'react';
import { sendMessageToModel } from '@/lib/models';
import { ChatHeader } from './ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import { Logo } from '@/components/shared/Logo';

interface ChatDashboardProps {
  selectedPlan?: number | null;
  onSignOut?: () => void;
}

export default function ChatDashboard({ selectedPlan, onSignOut }: ChatDashboardProps) {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant' | 'system', content: string}[]>([
    { role: 'system', content: 'You are a helpful AI assistant for Luminescent.io teams.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState('general');

  const handleSend = async (content: string) => {
    const userMsg = { role: 'user' as const, content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await sendMessageToModel(newMessages);
      setMessages([...newMessages, { role: 'assistant' as const, content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant' as const, content: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-transparent flex overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent">
        <ChatHeader 
          title="General AI" 
          subtitle="Team workspace • 7 members active" 
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-subtle">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <MessageBubble 
              key={idx}
              role={msg.role as 'user' | 'assistant'}
              content={msg.content}
            />
          ))}
          
          {loading && (
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

        {/* Input */}
        <MessageInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
