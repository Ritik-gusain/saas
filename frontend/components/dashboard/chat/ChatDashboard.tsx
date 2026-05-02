"use client";

import { useState } from 'react';
import { sendMessageToModel } from '@/lib/models';
import { ChatHeader } from './ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import { Logo } from '@/components/shared/Logo';
import { Activity, Database, Key, Server, Terminal } from 'lucide-react';

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
  const [showAgentPanel, setShowAgentPanel] = useState(true);

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
      <div className="flex-1 flex flex-col bg-transparent relative">
        <ChatHeader 
          title="General AI" 
          subtitle="Team workspace • 7 members active" 
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-subtle scrollbar-hide">
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
        <div className="px-4 pb-4 bg-gradient-to-t from-[var(--bg)] to-transparent pt-10">
          <MessageInput onSend={handleSend} disabled={loading} />
        </div>
      </div>

      {/* Agent Status Panel */}
      {showAgentPanel && (
        <div className="w-80 border-l border-[var(--border)] glass-panel bg-[var(--bg)]/50 backdrop-blur-md flex flex-col hidden lg:flex animate-fade-in">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--cyan)]" />
              Agent Orchestration
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Active Connections</h4>
              
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--cyan)]/10 flex items-center justify-center text-[var(--cyan)]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">PostgreSQL Vector</p>
                  <p className="text-[10px] text-[var(--mint)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] inline-block"></span> Connected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Anthropic API</p>
                  <p className="text-[10px] text-[var(--mint)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] inline-block"></span> Secure BYOK
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Execution Log</h4>
              <div className="bg-[#0a0a0a] rounded-xl border border-[var(--border)] p-3 font-mono text-[10px] space-y-2 max-h-60 overflow-y-auto">
                <div className="text-[var(--muted)]">
                  <span className="text-[var(--cyan)]">[INFO]</span> Agent loop initialized...
                </div>
                <div className="text-[var(--muted)]">
                  <span className="text-[var(--cyan)]">[INFO]</span> Loading workspace context...
                </div>
                <div className="text-[var(--muted)]">
                  <span className="text-purple-400">[TOOL]</span> Querying token usage tables...
                </div>
                <div className="text-white">
                  <span className="text-[var(--mint)]">[SUCCESS]</span> Context loaded (244ms)
                </div>
                {loading && (
                  <div className="text-[var(--cyan)] animate-pulse">
                    <span>[EXEC]</span> Generating response...
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
