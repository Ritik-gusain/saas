"use client";

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useTeamStore } from '@/stores/teamStore';
import { Logo } from '@/components/shared/Logo';
import {
  Plus, Search, MessageSquare, Pin, Trash2, Archive,
  ChevronDown, Zap, Share2, Download, MoreVertical,
  Sparkles, Bot, Send, Paperclip, Loader2, Copy, Check
} from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', color: 'var(--cyan)' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI', color: 'var(--cyan)' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: 'var(--mint)' },
  { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'Anthropic', color: 'var(--mint)' },
  { id: 'gemini/gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'Google', color: 'var(--purple)' },
];

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

function MessageBubble({ role, content }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role === 'user') {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="max-w-[75%] bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/10 border border-[var(--cyan)]/25 rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm text-white leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center flex-shrink-0 mt-1 border border-[var(--cyan)]/20">
        <Logo size={18} animated={false} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="glass-panel rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-[var(--soft)] leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] transition-all"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PremiumChatDashboard() {
  const {
    conversations, currentConversation, messages,
    isLoading, isStreaming, streamingContent, error,
    fetchConversations, createConversation, loadConversation, sendMessage,
    setCurrentConversation, deleteConversation, pinConversation, unpinConversation,
  } = useChatStore();

  const { currentTeam } = useTeamStore();
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (currentTeam?.id) {
      fetchConversations(currentTeam.id);
    }
  }, [currentTeam?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleNewConversation = async () => {
    if (!currentTeam?.id) return;
    await createConversation(currentTeam.id, 'New Conversation');
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !currentConversation) return;
    const content = inputValue.trim();
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(currentConversation.id, content, selectedModel.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter(c => c.is_pinned);
  const unpinnedConversations = filteredConversations.filter(c => !c.is_pinned);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Conversation Sidebar */}
      <div className="w-72 border-r border-[var(--border)] glass-panel flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Conversations</h3>
            <button
              onClick={handleNewConversation}
              className="p-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group"
              title="New conversation"
            >
              <Plus className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)]/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {isLoading && conversations.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-[var(--cyan)] animate-spin" />
            </div>
          )}

          {pinnedConversations.length > 0 && (
            <div className="mb-2">
              <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest px-3 py-1">Pinned</p>
              {pinnedConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={currentConversation?.id === conv.id}
                  onSelect={() => loadConversation(conv.id)}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setShowContextMenu}
                  onPin={() => unpinConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}

          {unpinnedConversations.length > 0 && (
            <div>
              {pinnedConversations.length > 0 && (
                <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest px-3 py-1">Recent</p>
              )}
              {unpinnedConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={currentConversation?.id === conv.id}
                  onSelect={() => loadConversation(conv.id)}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setShowContextMenu}
                  onPin={() => pinConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-[var(--muted)]/30 mx-auto mb-2" />
              <p className="text-xs text-[var(--muted)]">No conversations yet</p>
              <button
                onClick={handleNewConversation}
                className="mt-3 text-xs font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors"
              >
                Start one →
              </button>
            </div>
          )}
        </div>

        {/* Team usage bar */}
        {currentTeam && (
          <div className="p-3 border-t border-[var(--border)]">
            <div className="glass-panel rounded-xl p-3">
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="text-[var(--muted)]">Daily usage</span>
                <span className="text-[var(--mint)] font-bold">89k tokens</span>
              </div>
              <div className="h-1 bg-[var(--surface)] rounded-full overflow-hidden">
                <div className="h-full w-[67%] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] rounded-full" />
              </div>
              <p className="text-[9px] text-[var(--muted)] mt-1.5">{currentTeam.plan_tier} seats • {currentTeam.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 glass-panel flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--mint)] shadow-[0_0_8px_var(--mint)] animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-white">
                {currentConversation?.title || 'Select a conversation'}
              </h2>
              <p className="text-[10px] text-[var(--muted)]">
                {currentTeam?.name} • {messages.filter(m => m.role !== 'system').length} messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--cyan)]/30 transition-all"
              >
                <Zap className="w-3.5 h-3.5" style={{ color: selectedModel.color }} />
                <span className="text-xs font-bold text-white">{selectedModel.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform ${showModelPicker ? 'rotate-180' : ''}`} />
              </button>

              {showModelPicker && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-xl border border-[var(--border)] shadow-2xl z-50 overflow-hidden">
                  {MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model); setShowModelPicker(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs hover:bg-[var(--surface)] transition-all ${selectedModel.id === model.id ? 'text-white bg-[var(--surface)]' : 'text-[var(--muted)]'}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: model.color }} />
                      <div className="text-left">
                        <p className="font-bold text-white">{model.label}</p>
                        <p className="text-[10px] text-[var(--muted)]">{model.provider}</p>
                      </div>
                      {selectedModel.id === model.id && <Check className="w-3.5 h-3.5 text-[var(--cyan)] ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 transition-all group" title="Share">
              <Share2 className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
            </button>
            <button className="p-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 transition-all group" title="Export">
              <Download className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
            </button>
            <button className="p-1.5 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 transition-all group" title="More">
              <MoreVertical className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" onClick={() => { setShowModelPicker(false); setShowContextMenu(null); }}>
          {!currentConversation && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/20 flex items-center justify-center mb-6 animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-[var(--cyan)]" />
              </div>
              <h3 className="text-2xl font-black text-white font-[Syne] mb-2">Start a Conversation</h3>
              <p className="text-sm text-[var(--muted)] max-w-sm mb-8">
                Select an existing conversation or create a new one to begin chatting with your AI assistant.
              </p>
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--cyan)]/20"
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </button>
            </div>
          )}

          {currentConversation && messages.filter(m => m.role !== 'system').length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Bot className="w-12 h-12 text-[var(--muted)]/30 mb-4" />
              <p className="text-sm text-[var(--muted)]">Send a message to get started</p>
            </div>
          )}

          {messages.filter(m => m.role !== 'system').map((msg) => (
            <MessageBubble key={msg.id} role={msg.role as 'user' | 'assistant'} content={msg.content} />
          ))}

          {isStreaming && streamingContent && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center flex-shrink-0 mt-1 border border-[var(--cyan)]/20">
                <Logo size={18} animated={false} />
              </div>
              <div className="flex-1 glass-panel rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-[var(--soft)] leading-relaxed whitespace-pre-wrap">
                {streamingContent}
                <span className="inline-block w-2 h-4 bg-[var(--cyan)] ml-1 animate-pulse rounded-sm" />
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center flex-shrink-0">
                <Logo size={18} animated={false} />
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-[var(--bg)] to-transparent">
          {!currentConversation ? (
            <div className="max-w-3xl mx-auto glass-panel rounded-2xl px-5 py-4 opacity-40 cursor-not-allowed">
              <p className="text-sm text-[var(--muted)] text-center">Select or create a conversation first</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="glass-panel rounded-2xl border border-[var(--border)] focus-within:border-[var(--cyan)]/40 transition-all overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message your AI assistant... (Shift+Enter for new line)"
                  rows={1}
                  className="w-full bg-transparent px-5 pt-4 pb-2 text-sm text-white placeholder:text-[var(--muted)] outline-none resize-none scrollbar-hide"
                  disabled={isStreaming}
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] transition-all" title="Attach file">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-[var(--muted)]">
                      {selectedModel.label} • {selectedModel.provider}
                    </span>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isStreaming}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-bold text-xs hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--cyan)]/20"
                  >
                    {isStreaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conv, isActive, onSelect, showContextMenu, setShowContextMenu, onPin, onDelete
}: {
  conv: any; isActive: boolean; onSelect: () => void;
  showContextMenu: string | null; setShowContextMenu: (id: string | null) => void;
  onPin: () => void; onDelete: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
          isActive
            ? 'bg-[var(--cyan)]/10 border border-[var(--cyan)]/25 text-white'
            : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-white'
        }`}
      >
        <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[var(--cyan)]' : ''}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{conv.title}</p>
          <p className="text-[9px] text-[var(--muted)] mt-0.5">
            {new Date(conv.updated_at).toLocaleDateString()}
          </p>
        </div>
        {conv.is_pinned && <Pin className="w-3 h-3 text-[var(--cyan)] flex-shrink-0" />}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); setShowContextMenu(showContextMenu === conv.id ? null : conv.id); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[var(--surface)] transition-all"
      >
        <MoreVertical className="w-3.5 h-3.5 text-[var(--muted)]" />
      </button>

      {showContextMenu === conv.id && (
        <div className="absolute right-0 top-full mt-1 w-40 glass-panel rounded-xl border border-[var(--border)] shadow-2xl z-50 overflow-hidden">
          <button
            onClick={() => { onPin(); setShowContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] transition-all"
          >
            <Pin className="w-3.5 h-3.5" />
            {conv.is_pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => { onDelete(); setShowContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
