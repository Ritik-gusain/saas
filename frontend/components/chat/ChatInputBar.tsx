'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Agent, getAgent } from '@/lib/agents';
import { AIModel, getModel } from '@/lib/models';
import AgentModelSelector from './AgentModelSelector';

interface ChatInputBarProps {
  onSend: (message: string, agentId: string, modelId: string, webSearch: boolean) => void;
  isStreaming?: boolean;
  defaultAgentId?: string;
  defaultModelId?: string;
}

export default function ChatInputBar({
  onSend,
  isStreaming = false,
  defaultAgentId = 'general',
  defaultModelId = 'openrouter/google/gemini-2.0-flash-001',
}: ChatInputBarProps) {
  const [message, setMessage] = useState('');
  const [agentId, setAgentId] = useState(defaultAgentId);
  const [modelId, setModelId] = useState(defaultModelId);
  const [webSearch, setWebSearch] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const agent = getAgent(agentId);
  const model = getModel(modelId);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed, agentId, modelId, webSearch);
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <>
      {selectorOpen && (
        <AgentModelSelector
          selectedAgentId={agentId}
          selectedModelId={modelId}
          onAgentChange={(a: Agent) => setAgentId(a.id)}
          onModelChange={(m: AIModel) => setModelId(m.id)}
          onClose={() => setSelectorOpen(false)}
        />
      )}

      <div className="w-full px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          {/* Pill row — agent & model selectors */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* Agent pill */}
            <button
              id="agent-selector-btn"
              onClick={() => setSelectorOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/60 hover:bg-violet-500/10 transition-all group"
            >
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${agent.color} flex items-center justify-center text-xs`}>
                {agent.emoji}
              </div>
              <span className="text-white/70 text-xs font-medium group-hover:text-white">{agent.name}</span>
              <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Model pill */}
            <button
              id="model-selector-btn"
              onClick={() => setSelectorOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all group"
            >
              <span className="text-base">{model.providerLogo}</span>
              <span className="text-white/70 text-xs font-medium group-hover:text-white max-w-[140px] truncate">{model.name}</span>
              {model.free && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">FREE</span>}
              <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Web search toggle */}
            <button
              id="web-search-toggle"
              onClick={() => setWebSearch(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                webSearch
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              🌐 Web Search
            </button>
          </div>

          {/* Input area */}
          <div className="relative flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/60 transition-colors">
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={message}
              onChange={e => { setMessage(e.target.value); handleInput(); }}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agent.name}...`}
              rows={1}
              disabled={isStreaming}
              className="flex-1 bg-transparent text-white placeholder-white/25 text-sm resize-none outline-none leading-relaxed"
              style={{ maxHeight: '200px', overflowY: 'auto' }}
            />
            <button
              id="send-message-btn"
              onClick={handleSend}
              disabled={!message.trim() || isStreaming}
              className="shrink-0 w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              {isStreaming ? (
                <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              )}
            </button>
          </div>

          <p className="text-center text-white/20 text-[10px] mt-2">
            Luminescent can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </>
  );
}
