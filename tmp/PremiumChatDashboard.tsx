"use client";
import React, { useState, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useTeamStore } from '@/stores/teamStore';
import { useUIStore } from '@/stores/uiStore';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AGENTS, getAgent } from '@/lib/agents';
import { AI_MODELS, getModel } from '@/lib/models';
import AgentModelSelector from '@/components/chat/AgentModelSelector';

export default function PremiumChatDashboard() {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('general');
  const [selectedModelId, setSelectedModelId] = useState('openrouter/google/gemini-2.0-flash-001');
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        await sendMessage(newConv.id, content, selectedModelId, selectedAgentId, isWebSearchEnabled);
      }
    } else {
      await sendMessage(currentConversation.id, content, selectedModelId, selectedAgentId, isWebSearchEnabled);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };
    
    recognition.start();
  };

  const VoiceWaveform = () => (
    <div className="flex items-center gap-1 h-4 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i}
          className="w-1 bg-[var(--cyan)] rounded-full animate-voice-bar"
          style={{ 
            height: '100%',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );

  const activeAgent = getAgent(selectedAgentId);
  const activeModel = getModel(selectedModelId);

  // Suggest 6 quick-access agents on the home screen
  const featuredAgents = ['general','coder','researcher','analyst','writer','designer'];

  const providers_placeholder = [
    { 
      id: 'openai', 
      name: 'ChatGPT', 
      logo: '/ai-logos/penailogo.svg', 
      color: '#74aa9c',
      variants: [
        { id: 'openrouter/openai/gpt-4o', name: 'GPT-4o' },
        { id: 'openrouter/openai/gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'openrouter/openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'openrouter/openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      ]
    },
    { 
      id: 'anthropic', 
      name: 'Claude', 
      logo: '/ai-logos/Anthropic.svg', 
      color: '#d97757',
      variants: [
        { id: 'openrouter/anthropic/claude-3-5-sonnet', name: '3.5 Sonnet' },
        { id: 'openrouter/anthropic/claude-3-5-haiku', name: '3.5 Haiku' },
        { id: 'openrouter/anthropic/claude-3-opus', name: '3 Opus' },
        { id: 'openrouter/anthropic/claude-3-sonnet', name: '3 Sonnet' },
      ]
    },
    { 
      id: 'google', 
      name: 'Gemini', 
      logo: '/ai-logos/GoogleGemini.svg', 
      color: '#4285f4',
      variants: [
        { id: 'openrouter/google/gemini-2.0-flash-001', name: '2.0 Flash' },
        { id: 'openrouter/google/gemini-pro-1.5', name: '1.5 Pro' },
        { id: 'openrouter/google/gemini-flash-1.5', name: '1.5 Flash' },
        { id: 'openrouter/google/gemini-pro', name: 'Pro' },
      ]
    },
    { 
      id: 'meta', 
      name: 'Llama', 
      logo: '/ai-logos/Meta.png', 
      color: '#0668E1',
      variants: [
        { id: 'openrouter/meta-llama/llama-3.1-405b', name: '3.1 405B' },
        { id: 'openrouter/meta-llama/llama-3.1-70b', name: '3.1 70B' },
        { id: 'openrouter/meta-llama/llama-3.1-8b', name: '3.1 8B' },
        { id: 'openrouter/meta-llama/llama-3-70b', name: '3 70B' },
      ]
    },
    { 
      id: 'mistral', 
      name: 'Mistral', 
      logo: '/ai-logos/Mistral.png', 
      color: '#f5d142',
      variants: [
        { id: 'openrouter/mistralai/mistral-large', name: 'Large' },
        { id: 'openrouter/mistralai/mistral-medium', name: 'Medium' },
        { id: 'openrouter/mistralai/mistral-small', name: 'Small' },
        { id: 'openrouter/mistralai/pixtral-12b', name: 'Pixtral' },
      ]
    },
    { 
      id: 'deepseek', 
      name: 'DeepSeek', 
      logo: '/ai-logos/DeepSeek.png', 
      color: '#007bff',
      variants: [
        { id: 'openrouter/deepseek/deepseek-chat', name: 'V3' },
        { id: 'openrouter/deepseek/deepseek-coder', name: 'Coder' },
      ]
    },
    { 
      id: 'perplexity', 
      name: 'Perplexity', 
      logo: '/ai-logos/Perplexity.svg', 
      color: '#20b2aa',
      variants: [
        { id: 'openrouter/perplexity/sonar-reasoning', name: 'Reasoning' },
        { id: 'openrouter/perplexity/sonar', name: 'Sonar' },
      ]
    },
    { 
      id: 'xai', 
      name: 'Grok', 
      logo: '/ai-logos/xai.png', 
      color: '#ffffff',
      variants: [
        { id: 'openrouter/xai/grok-2', name: 'Grok 2' },
        { id: 'openrouter/xai/grok-2-mini', name: '2 Mini' },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent w-full relative">
      {selectorOpen && (
        <AgentModelSelector
          selectedAgentId={selectedAgentId}
          selectedModelId={selectedModelId}
          onAgentChange={(a) => setSelectedAgentId(a.id)}
          onModelChange={(m) => setSelectedModelId(m.id)}
          onClose={() => setSelectorOpen(false)}
        />
      )}
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

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) alert(`File selected: ${file.name}`);
        }}
      />

      {/* Top Navigation Banner */}
      <div className="h-14 flex items-center justify-between px-4 glass-panel border-b z-20">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-[var(--muted)] hover:text-[var(--cyan)] transition-colors rounded-md hover:bg-[var(--surface)]"
            >
              <Lucide.LayoutTemplate className="w-5 h-5" />
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
                <Lucide.Star className={`w-4 h-4 ${currentConversation.is_pinned ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => {
                  deleteConversation(currentConversation.id);
                }}
                className="p-2 text-[var(--muted)] hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
                title="Delete chat"
              >
                <Lucide.Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleSidebar}
                className="p-2 text-[var(--muted)] hover:text-white rounded-md hover:bg-[var(--surface)] transition-colors"
                title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Lucide.Maximize2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
            {/* Claude-style Hero */}
            <div className="mb-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--purple)]/20 border border-[var(--border)] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_var(--cyan)]/20">
                <Lucide.Sparkles className="w-8 h-8 text-[var(--cyan)]" />
              </div>
              <h1 className="text-[32px] font-['Montserrat'] font-bold text-white tracking-tight leading-tight">
                Good afternoon
              </h1>
            </div>

            {/* Agent quick-access chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {AGENTS.filter(a => featuredAgents.includes(a.id)).map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[var(--surface)] border-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]/20 text-white' 
                        : 'glass-panel border-[var(--border)] text-[var(--muted)] hover:border-[var(--cyan)]/30 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{agent.emoji}</span>
                    <span className="text-[13px] font-medium">{agent.name}</span>
                  </button>
                );
              })}
              {/* "Browse all" button */}
              <button
                onClick={() => setSelectorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-white/20 text-white/40 hover:border-violet-500/50 hover:text-violet-400 transition-all text-[13px]"
              >
                +{AGENTS.length - featuredAgents.length} more <Lucide.ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="w-full max-w-2xl relative mb-4">
              {/* Agent + Model pill selector */}
              <div className="flex items-center justify-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                <button
                  onClick={() => setSelectorOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group"
                >
                  <span className="text-base">{activeAgent.emoji}</span>
                  <span className="text-white/70 text-xs font-semibold group-hover:text-white">{activeAgent.name}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-base">{activeModel.providerLogo}</span>
                  <span className="text-white/50 text-xs group-hover:text-white/80 max-w-[120px] truncate">{activeModel.name}</span>
                  {activeModel.free && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">FREE</span>}
                  <Lucide.ChevronDown className="w-3 h-3 text-white/30" />
                </button>
              </div>

              <div className={`relative glass-panel rounded-2xl border p-1 transition-all duration-300 ${
                isFocused ? 'border-[var(--cyan)]/50 shadow-[0_0_20px_var(--cyan)]/20' : 'border-[var(--border)] hover:border-[var(--cyan)]/30'
              }`}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${activeAgent.name} anything...`}
                  className="w-full max-h-[200px] min-h-[80px] p-4 bg-transparent resize-none outline-none text-[16px] placeholder-[var(--muted)] text-white scrollbar-hide"
                  rows={1}
                />
                <div className="flex items-center justify-between p-2 pt-0 px-3">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-lg transition-colors tooltip-trigger" 
                      title="Add attachment"
                    >
                      <Lucide.Paperclip className="w-[19px] h-[19px]" />
                    </button>
                    {isPremium && (
                      <>
                        <button 
                          onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
                          className={`p-2 rounded-lg transition-colors tooltip-trigger ${
                            isWebSearchEnabled ? 'text-[var(--cyan)] bg-[var(--cyan)]/10 border border-[var(--cyan)]/20' : 'text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)]'
                          }`} 
                          title="Web search"
                        >
                          <Lucide.Globe className="w-[19px] h-[19px]" />
                        </button>
                        <button 
                          onClick={startVoiceInput}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-2 tooltip-trigger ${
                            isListening ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)]'
                          }`} 
                          title="Voice input"
                        >
                          <Lucide.Mic className={`w-[19px] h-[19px] ${isListening ? 'animate-pulse' : ''}`} />
                          {isListening && <VoiceWaveform />}
                        </button>
                      </>
                    )}
                    {isWebSearchEnabled && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-[9px] font-bold text-[var(--cyan)] uppercase tracking-wider animate-pulse">
                        Live Search
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isStreaming}
                    className={`p-2.5 px-4 rounded-xl flex items-center justify-center transition-all gap-2 ${
                      inputValue.trim() && !isStreaming
                        ? 'bg-[var(--cyan)] text-[#0f0f11] hover:brightness-110 shadow-[0_0_15px_var(--cyan)]/30 font-bold' 
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] cursor-not-allowed'
                    }`}
                  >
                    <span className="text-sm">Chat</span>
                    <Lucide.Send className="w-[16px] h-[16px]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[12px] text-[var(--muted)] flex items-center justify-center gap-2">
                <Lucide.Command className="w-3 h-3" /> Press Shift + Enter for new line
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-3xl mx-auto py-8 px-4 flex flex-col">
            <div className="space-y-6 pb-64">
              {messages.map((msg, idx) => {
                // Resolve agent name for assistant messages
                const msgAgentId = msg.agentId || selectedAgentId;
                const msgAgent = getAgent(msgAgentId);
                const isStreamingThis = isStreaming && idx === messages.length - 1 && msg.role === 'assistant';

                return (
                  <div key={msg.id || idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base ${
                      msg.role === 'user' 
                        ? 'bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)]' 
                        : 'bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg'
                    }`}>
                      {msg.role === 'user' ? <div className="font-bold text-xs">U</div> : msgAgent.emoji}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-[13px] font-semibold text-white">
                          {msg.role === 'user' ? 'You' : msgAgent.name}
                        </span>
                        {msg.role === 'assistant' && msg.model && (
                          <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                            {msg.model.split('/').pop()}
                          </span>
                        )}
                        {msg.created_at && (
                          <span className="text-[11px] text-[var(--muted)]">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      
                      <div className={`prose prose-invert max-w-none text-[15px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tr-sm text-white'
                          : 'text-[var(--soft)] px-2'
                      }`}>
                        {msg.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        ) : isStreamingThis ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    <Lucide.StopCircle className="w-3.5 h-3.5" />
                    Stop generating
                  </button>
                </div>
              )}
            {/* Floating Agent+Model pill */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={() => setSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group text-xs"
              >
                <span>{activeAgent.emoji}</span>
                <span className="text-white/60 font-medium group-hover:text-white">{activeAgent.name}</span>
                <span className="text-white/20">·</span>
                <span>{activeModel.providerLogo}</span>
                <span className="text-white/50 group-hover:text-white/80 max-w-[100px] truncate">{activeModel.name}</span>
                <Lucide.ChevronDown className="w-3 h-3 text-white/30" />
              </button>
            </div>

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
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded-md transition-colors tooltip-trigger" 
                    title="Add attachment"
                  >
                    <Lucide.Paperclip className="w-4 h-4" />
                  </button>
                  <>
                    <button 
                      onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
                      className={`p-1.5 rounded-md transition-colors tooltip-trigger ${
                        isWebSearchEnabled ? 'text-[var(--cyan)] bg-[var(--cyan)]/10 border border-[var(--cyan)]/20' : 'text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)]'
                      }`} 
                      title="Web search"
                    >
                      <Lucide.Globe className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={startVoiceInput}
                      className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 tooltip-trigger ${
                        isListening ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--surface)]'
                      }`} 
                      title="Voice input"
                    >
                      <Lucide.Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                      {isListening && <VoiceWaveform />}
                    </button>
                  </>
                  {isWebSearchEnabled && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-[9px] font-bold text-[var(--cyan)] uppercase tracking-wider animate-pulse">
                      Live Search
                    </span>
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
                  <Lucide.Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
               <span className="text-[10px] text-[var(--muted)]">Luminescent AI may produce inaccurate information about people, places, or facts.</span>
            </div>
          </div>
        </div>
      )}
      {/* Floating selector button (bottom-right) */}
      <button
        onClick={() => setSelectorOpen(true)}
        className="absolute right-5 bottom-24 z-30 w-12 h-12 rounded-full bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-all hover:scale-105 backdrop-blur-md"
        title="Switch agent or model"
      >
        <span className="text-xl">{activeAgent.emoji}</span>
      </button>
    </div>
  );
}
