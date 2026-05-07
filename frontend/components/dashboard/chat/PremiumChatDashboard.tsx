"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Maximize2, Image as ImageIcon, 
  Paperclip, Globe, Command, Mic, 
  Code, Sparkles, PenTool, LayoutTemplate,
  Terminal, FileCode2, Blocks, Wand2,
  StopCircle, Star, Trash2
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useTeamStore } from '@/stores/teamStore';
import { useUIStore } from '@/stores/uiStore';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PremiumChatDashboard() {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { currentTeam } = useTeamStore();
  const router = useRouter();
  
  const { 
    currentConversation, 
    messages, 
    isStreaming,
    sendMessage,
    createConversation,
    stopGeneration,
    pinConversation,
    unpinConversation,
    deleteConversation,
    error,
    setError
  } = useChatStore();

  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const isPremium = currentTeam?.plan_tier && currentTeam.plan_tier >= 3;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || !currentTeam?.id || isStreaming) return;
    
    const content = inputValue;
    setInputValue('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (!currentConversation) {
      const newConv = await createConversation(currentTeam.id, content.substring(0, 30) + '...');
      if (newConv) {
        await sendMessage(newConv.id, content);
      }
    } else {
      await sendMessage(currentConversation.id, content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestions = [
    { icon: Code, text: "Write a React hook", desc: "for intersection observer", color: "text-[var(--cyan)]" },
    { icon: Sparkles, text: "Brainstorm ideas", desc: "for a SaaS landing page", color: "text-[var(--purple)]" },
    { icon: PenTool, text: "Draft an email", desc: "to a potential investor", color: "text-[var(--mint)]" },
    { icon: LayoutTemplate, text: "Design a schema", desc: "for a chat application", color: "text-[var(--cyan)]" }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent w-full relative">
      {/* Error Message */}
      {error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="glass-panel border border-red-500/50 bg-red-500/10 px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl shadow-red-500/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-200 font-medium">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Banner */}
      <div className="h-14 flex items-center justify-between px-4 glass-panel border-b z-20">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-[var(--muted)] hover:text-[var(--cyan)] transition-colors rounded-md hover:bg-[var(--surface)]"
            >
              <LayoutTemplate className="w-5 h-5" />
            </button>
          )}
         
          {!isPremium && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[11px] font-bold text-[var(--cyan)] uppercase tracking-wider cursor-pointer hover:bg-[var(--cyan)]/10 transition-colors" onClick={() => router.push('/pricing')}>
              Free Plan
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {currentConversation && (
            <>
              <button 
                onClick={() => currentConversation.is_pinned ? unpinConversation(currentConversation.id) : pinConversation(currentConversation.id)}
                className={`p-2 rounded-md hover:bg-[var(--surface)] transition-colors ${currentConversation.is_pinned ? 'text-yellow-500' : 'text-[var(--muted)] hover:text-white'}`}
                title={currentConversation.is_pinned ? "Unstar chat" : "Star chat"}
              >
                <Star className={`w-4 h-4 ${currentConversation.is_pinned ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => {
                  deleteConversation(currentConversation.id);
                }}
                className="p-2 text-[var(--muted)] hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleSidebar}
                className="p-2 text-[var(--muted)] hover:text-white rounded-md hover:bg-[var(--surface)] transition-colors"
                title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center" ref={scrollRef}>
        {!currentConversation || messages.length === 0 ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
            {/* Claude-style Hero */}
            <div className="mb-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--purple)]/20 border border-[var(--border)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--cyan)]/20">
                <Sparkles className="w-8 h-8 text-[var(--cyan)]" />
              </div>
              <h1 className="text-[32px] font-['Montserrat'] font-bold text-white tracking-tight leading-tight">
                Good afternoon
              </h1>
            </div>

            <div className="w-full max-w-2xl mb-8">
              <div className={`relative glass-panel rounded-xl border p-1 transition-all duration-300 ${
                isFocused ? 'border-[var(--cyan)]/50 shadow-[0_0_20px_var(--cyan)]/20' : 'border-[var(--border)] hover:border-[var(--cyan)]/30'
              }`}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="How can Luminescent help you today?"
                  className="w-full max-h-[200px] min-h-[60px] p-4 bg-transparent resize-none outline-none text-[15px] placeholder-[var(--muted)] text-white scrollbar-hide"
                  rows={1}
                />
                <div className="flex items-center justify-between p-2 pt-0">
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-lg transition-colors tooltip-trigger" title="Add attachment">
                      <Paperclip className="w-[18px] h-[18px]" />
                    </button>
                    {isPremium && (
                      <>
                        <button className="p-2 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-lg transition-colors tooltip-trigger" title="Web search">
                          <Globe className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-2 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-lg transition-colors tooltip-trigger" title="Voice input">
                          <Mic className="w-[18px] h-[18px]" />
                        </button>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isStreaming}
                    className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                      inputValue.trim() && !isStreaming
                        ? 'bg-[var(--cyan)] text-[#0f0f11] hover:brightness-110 shadow-[0_0_15px_var(--cyan)]/30' 
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions Grid */}
            <div className="w-full max-w-2xl grid grid-cols-2 gap-3">
              {suggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button 
                    key={idx}
                    onClick={() => setInputValue(`${suggestion.text} ${suggestion.desc}`)}
                    className="flex flex-col items-start p-4 glass-panel border border-[var(--border)] hover:border-[var(--cyan)]/30 hover:bg-[var(--surface)] rounded-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-[18px] h-[18px] ${suggestion.color}`} strokeWidth={2} />
                      <span className="text-[14px] font-semibold text-white group-hover:text-[var(--cyan)] transition-colors">{suggestion.text}</span>
                    </div>
                    <span className="text-[13px] text-[var(--muted)]">{suggestion.desc}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <span className="text-[12px] text-[var(--muted)] flex items-center justify-center gap-2">
                <Command className="w-3 h-3" /> Press Shift + Enter for new line
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-3xl mx-auto py-8 px-4 flex flex-col">
            <div className="space-y-6 pb-32">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)]' 
                      : 'bg-[var(--cyan)] text-[#0f0f11] shadow-[0_0_15px_var(--cyan)]/30'
                  }`}>
                    {msg.role === 'user' ? <div className="font-bold text-xs">U</div> : <Sparkles className="w-5 h-5" />}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-[13px] font-semibold text-white">
                        {msg.role === 'user' ? 'You' : 'Luminescent'}
                      </span>
                      {msg.createdAt && (
                        <span className="text-[11px] text-[var(--muted)]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    
                    <div className={`prose prose-invert max-w-none text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tr-sm text-white'
                        : 'text-[var(--soft)] px-2'
                    }`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Area for Active Chat */}
      {currentConversation && messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative">
             {isStreaming && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex justify-center">
                  <button 
                    onClick={stopGeneration}
                    className="flex items-center gap-2 px-4 py-1.5 glass-panel border border-[var(--border)] hover:border-red-500/50 hover:text-red-400 rounded-full text-xs font-semibold text-white transition-all shadow-lg"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    Stop generating
                  </button>
                </div>
              )}
            <div className={`relative glass-panel rounded-xl border p-1 transition-all duration-300 shadow-2xl ${
              isFocused ? 'border-[var(--cyan)]/50 shadow-[0_0_30px_var(--cyan)]/20' : 'border-[var(--border)]'
            }`}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Reply to Luminescent..."
                className="w-full max-h-[200px] min-h-[50px] p-3 px-4 bg-transparent resize-none outline-none text-[15px] placeholder-[var(--muted)] text-white scrollbar-hide"
                rows={1}
              />
              <div className="flex items-center justify-between p-2 pt-0">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-md transition-colors tooltip-trigger" title="Add attachment">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  {isPremium && (
                    <button className="p-1.5 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-md transition-colors tooltip-trigger" title="Web search">
                      <Globe className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isStreaming}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    inputValue.trim() && !isStreaming
                      ? 'bg-[var(--cyan)] text-[#0f0f11] shadow-[0_0_15px_var(--cyan)]/30' 
                      : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
               <span className="text-[10px] text-[var(--muted)]">Luminescent AI may produce inaccurate information about people, places, or facts.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
