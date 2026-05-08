"use client";
import { Pin, Archive, MoreVertical, Share2, Download, ChevronDown, Zap, Sparkles } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { useChatStore } from '@/stores/chatStore';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  const { currentTeam } = useTeamStore();
  const isPremium = currentTeam?.plan_tier && currentTeam.plan_tier >= 3;

  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 glass-panel z-10 relative">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--mint)] shadow-[0_0_12px_var(--mint)] animate-pulse" />
        <div className="group cursor-text">
          <h2 className="text-sm font-bold text-white group-hover:text-[var(--cyan)] transition-colors inline-flex items-center gap-2">
            {title}
            {isPremium && <Sparkles className="w-3 h-3 text-[var(--cyan)]" />}
          </h2>
          <p className="text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Model Indicator */}
        <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] cursor-default">
          <Zap className="w-3.5 h-3.5 text-[var(--cyan)]" />
          <span className="text-xs font-bold text-white uppercase tracking-tighter">AI Assistant</span>
        </div>

        {/* Action Buttons */}
        {isPremium ? (
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 transition-all text-[var(--cyan)] text-xs font-bold group shadow-[0_0_15px_rgba(0,255,255,0.1)]">
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collaborate</span>
          </button>
        ) : (
          <button 
            onClick={() => window.location.href = '/dashboard/settings'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--cyan)]/50 transition-all text-[var(--muted)] hover:text-white text-xs font-bold group"
          >
            <Zap className="w-3.5 h-3.5 group-hover:text-[var(--cyan)]" />
            <span className="hidden sm:inline">Upgrade for Teams</span>
          </button>
        )}
        
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all text-[var(--muted)] hover:text-[var(--cyan)] text-xs font-semibold group">
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        <button className="p-2 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <Pin className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
        <button className="p-2 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <Archive className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
        <button className="p-2 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <MoreVertical className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
      </div>
    </header>
  );
}
