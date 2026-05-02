"use client";

import { useState, useRef } from 'react';
import { Send, Sparkles, Zap, Paperclip, Mic, Image as ImageIcon, TerminalSquare } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className="p-6 border-t border-[var(--border)] glass-panel">
      <form onSubmit={handleSend} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 group">
          <div className="absolute -inset-4 bg-[var(--cyan)]/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
          <div className="flex-1 relative">
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask your team AI anything..."
              rows={1}
              disabled={isLoading || disabled}
              className="w-full relative glass-panel rounded-2xl pl-6 pr-32 py-4 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none resize-none"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1">
              <button 
                type="button"
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group"
                title="Attach files"
              >
                <Paperclip className="w-4 h-4 text-[var(--muted)] group-hover:text-white" />
              </button>
              <button 
                type="button"
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group"
                title="Generate Image"
              >
                <ImageIcon className="w-4 h-4 text-[var(--muted)] group-hover:text-white" />
              </button>
              <button 
                type="button"
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group"
                title="Voice Input"
              >
                <Mic className="w-4 h-4 text-[var(--muted)] group-hover:text-white" />
              </button>
              <div className="w-px h-4 bg-[var(--border)] mx-1" />
              <button 
                type="button"
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group"
                title="System Prompt / Prompt Templates"
              >
                <TerminalSquare className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !input.trim() || disabled}
            className="p-4 bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] rounded-xl hover:opacity-90 disabled:opacity-30 transition-all shadow-xl shadow-[var(--cyan)]/20 hover:shadow-[var(--cyan)]/40 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-xs text-[var(--muted)] flex items-center gap-2">
            <Zap className="w-3 h-3 text-[var(--mint)]" />
            Luminescent AI Core v1.4 • Powered by Bytez
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--surface)] text-[9px] font-mono border border-[var(--border)]">
              ~240 tokens
            </span>
          </p>
          <p className="text-xs text-[var(--muted)] flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[10px] border border-[var(--border)] font-mono">Enter</kbd> to send</span>
          </p>
        </div>
      </form>
    </div>
  );
}
