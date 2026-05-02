"use client";

import { Pin, Archive, MoreVertical, Share2, Download, ChevronDown, Zap } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 glass-panel z-10 relative">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--mint)] shadow-[0_0_12px_var(--mint)] animate-pulse" />
        <div className="group cursor-text">
          <h2 className="text-sm font-bold text-white group-hover:text-[var(--cyan)] transition-colors inline-flex items-center gap-2">
            {title}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Edit Icon could go here */}
            </div>
          </h2>
          <p className="text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Model Selector */}
        <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:border-[var(--cyan)]/30 transition-all">
          <Zap className="w-3.5 h-3.5 text-[var(--cyan)]" />
          <span className="text-xs font-bold text-white">GPT-4 Turbo</span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)] ml-1" />
        </div>

        {/* Action Buttons */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all text-[var(--muted)] hover:text-[var(--cyan)] text-xs font-semibold group">
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        
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
