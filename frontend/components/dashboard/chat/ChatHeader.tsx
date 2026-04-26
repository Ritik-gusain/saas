"use client";

import { Pin, Archive, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 glass-panel">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--mint)] shadow-[0_0_12px_var(--mint)] animate-pulse" />
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <p className="text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <Pin className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
        <button className="p-2.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <Archive className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
        <button className="p-2.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
          <MoreVertical className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
        </button>
      </div>
    </header>
  );
}
