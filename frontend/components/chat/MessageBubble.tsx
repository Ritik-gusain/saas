"use client";

import { Clock, Copy, RefreshCw, Edit2, ThumbsUp, ThumbsDown, MessageSquareWarning } from 'lucide-react';
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

  const renderContent = (text: string) => {
    // Simple regex to detect code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0]?.trim() || '';
        const code = lines.slice(1).join('\n');
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-[var(--border)]">
            <div className="bg-[var(--surface)] px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--muted)]">{lang || 'plaintext'}</span>
              <button className="text-[10px] flex items-center gap-1 text-[var(--muted)] hover:text-white transition-colors">
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <pre className="p-4 bg-[var(--bg)] overflow-x-auto text-xs font-mono leading-relaxed text-[var(--mint)]">
              <code>{code || lang}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap mb-2 last:mb-0">{part}</p>;
    });
  };

  return (
    <div className={`flex gap-5 max-w-4xl animate-fade-in-up group ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
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
      <div className="flex-1 max-w-[calc(100%-4rem)]">
        <div className={`relative rounded-2xl px-6 py-4 text-sm leading-relaxed shadow-xl ${
          isUser 
            ? 'glass-panel border-[var(--cyan)]/30 text-white rounded-tr-sm' 
            : 'glass-panel text-[var(--soft)] rounded-tl-sm'
        }`}>
          {renderContent(content)}
          
          {/* Hover Action Bar */}
          <div className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 p-1 rounded-lg glass-panel shadow-lg ${isUser ? 'left-4' : 'right-4'}`}>
            <button title="Copy" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-all">
              <Copy className="w-3.5 h-3.5" />
            </button>
            {isUser ? (
              <button title="Edit" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-all">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button title="Regenerate" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-all">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3 bg-[var(--border)] mx-1" />
                <button title="Good response" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--mint)] transition-all">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button title="Bad response" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-red-400 transition-all">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button title="Report issue" className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-yellow-400 transition-all">
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-3 mt-2 px-2 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-xs text-[var(--muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timestamp}
          </span>
          {!isUser && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-[var(--border)] text-[var(--cyan)] bg-[var(--surface)]">
              {model || 'GPT-4 Turbo'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
