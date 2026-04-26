"use client";

import { Plus, Search, MessageSquare, Bot, Pin, Users } from 'lucide-react';

interface ChatSidebarProps {
  activeConversation: string;
  setActiveConversation: (id: string) => void;
}

export function ChatSidebar({ activeConversation, setActiveConversation }: ChatSidebarProps) {
  const conversations = [
    { id: 'general', name: 'General AI', icon: MessageSquare, unread: 0, pinned: true },
    { id: 'research', name: 'Market Research', icon: Search, unread: 3, pinned: false },
    { id: 'code', name: 'Code Review', icon: Bot, unread: 0, pinned: false },
  ];

  return (
    <div className="w-80 glass-panel border-r flex flex-col">
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Conversations</h3>
          <button className="p-2 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
            <Plus className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {conversations.map((conv) => {
          const Icon = conv.icon;
          return (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                activeConversation === conv.id
                  ? 'bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-white'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeConversation === conv.id
                  ? 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)]'
                  : 'bg-[var(--surface)] group-hover:bg-[var(--cyan)]/10'
              }`}>
                <Icon className={`w-4 h-4 ${
                  activeConversation === conv.id ? 'text-[var(--bg)]' : 'text-[var(--muted)]'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{conv.name}</span>
                  {conv.pinned && <Pin className="w-3 h-3 text-[var(--cyan)]" />}
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">2 hours ago</div>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--cyan)] text-[var(--bg)] text-[10px] font-bold flex items-center justify-center">
                  {conv.unread}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 border-t border-[var(--border)]">
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--bg)]" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Team Plan</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">Growth • 7 seats</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">Usage today</span>
            <span className="text-[var(--mint)] font-bold">89k tokens</span>
          </div>
          <div className="mt-2 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
            <div className="h-full w-[67%] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
