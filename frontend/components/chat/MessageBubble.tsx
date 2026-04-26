"use client";

import { Clock } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  model?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  role,
  content,
  timestamp = "Just now",
  onCopy,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-5 max-w-4xl animate-fade-in-up ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)]' 
          : 'glass-panel'
      }`}>
        {isUser 
          ? <span className="text-xs font-black text-[var(--bg)]">ME</span> 
          : <Logo size={20} animated={false} />
        }
      </div>
      <div className="flex-1">
        <div className={`relative rounded-2xl px-6 py-4 text-sm leading-relaxed shadow-xl ${
          isUser 
            ? 'glass-panel border-[var(--cyan)]/30 text-white rounded-tr-sm' 
            : 'glass-panel text-[var(--soft)] rounded-tl-sm'
        }`}>
          {content}
        </div>
        <div className={`flex items-center gap-3 mt-2 px-2 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-xs text-[var(--muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timestamp}
          </span>
          {!isUser && (
            <>
              <button 
                onClick={onCopy}
                className="text-xs text-[var(--muted)] hover:text-[var(--cyan)] transition-colors"
              >
                Copy
              </button>
              <button 
                onClick={onRegenerate}
                className="text-xs text-[var(--muted)] hover:text-[var(--cyan)] transition-colors"
              >
                Regenerate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
