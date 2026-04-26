import { useState } from 'react';
import { Bot, MessageSquare, Send, Users, ArrowRight, Sparkles, Plus, Search, Settings, MoreVertical, Pin, Archive, Download, Trash2, Clock, Zap } from 'lucide-react';
import { sendMessageToModel } from '@/lib/models';
import { Logo } from './Logo';

interface ChatDashboardProps {
  selectedPlan: number | null;
  onSignOut: () => void;
}

export default function ChatDashboard({ selectedPlan, onSignOut }: ChatDashboardProps) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'system', content: 'You are a helpful AI assistant for Luminescent.io teams.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState('general');

  const conversations = [
    { id: 'general', name: 'General AI', icon: MessageSquare, unread: 0, pinned: true },
    { id: 'research', name: 'Market Research', icon: Search, unread: 3, pinned: false },
    { id: 'code', name: 'Code Review', icon: Bot, unread: 0, pinned: false },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToModel(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-transparent flex overflow-hidden">
      {/* Sidebar - Conversations */}
      <div className="w-80 glass-panel border-r flex flex-col">
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Conversations</h3>
            <button className="p-2 rounded-lg glass-panel hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]/30 transition-all group">
              <Plus className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input 
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.map((conv) => {
            const Icon = conv.icon;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  activeConversation === conv.id
                    ? 'bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-white'
                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  activeConversation === conv.id
                    ? 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)]'
                    : 'bg-[var(--surface)] group-hover:bg-[var(--cyan)]/10'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    activeConversation === conv.id ? 'text-[var(--bg)]' : 'text-[var(--muted)]'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{conv.name}</span>
                    {conv.pinned && <Pin className="w-3 h-3 text-[var(--cyan)]" />}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">2 hours ago</div>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[var(--cyan)] text-[var(--bg)] text-[10px] font-bold flex items-center justify-center">
                    {conv.unread}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-5 border-t border-[var(--border)]">
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--bg)]" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Team Plan</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">Growth • 7 seats</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted)]">Usage today</span>
              <span className="text-[var(--mint)] font-bold">89k tokens</span>
            </div>
            <div className="mt-2 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
              <div className="h-full w-[67%] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 glass-panel">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--mint)] shadow-[0_0_12px_var(--mint)] animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-white">General AI</h2>
              <p className="text-xs text-[var(--muted)]">Team workspace • 7 members active</p>
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-subtle">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex gap-5 max-w-4xl animate-fade-in-up ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)]' 
                  : 'glass-panel'
              }`}>
                {msg.role === 'user' 
                  ? <span className="text-xs font-black text-[var(--bg)]">ME</span> 
                  : <Logo size={20} animated={false} />
                }
              </div>
              <div className="flex-1">
                <div className={`relative rounded-2xl px-6 py-4 text-sm leading-relaxed shadow-xl ${
                  msg.role === 'user' 
                    ? 'glass-panel border-[var(--cyan)]/30 text-white rounded-tr-sm' 
                    : 'glass-panel text-[var(--soft)] rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-3 mt-2 px-2">
                  <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Just now
                  </span>
                  {msg.role === 'assistant' && (
                    <>
                      <button className="text-xs text-[var(--muted)] hover:text-[var(--cyan)] transition-colors">Copy</button>
                      <button className="text-xs text-[var(--muted)] hover:text-[var(--cyan)] transition-colors">Regenerate</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-5 max-w-4xl animate-pulse">
              <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center">
                <Logo size={20} animated={false} />
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-[var(--border)] glass-panel">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 group">
              <div className="absolute -inset-4 bg-[var(--cyan)]/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
              <div className="flex-1 relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Ask your team AI anything..."
                  rows={1}
                  className="w-full relative glass-panel rounded-2xl pl-6 pr-14 py-4 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none resize-none"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button 
                    type="button"
                    className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--muted)]" />
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="p-4 bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] rounded-xl hover:opacity-90 disabled:opacity-30 transition-all shadow-xl shadow-[var(--cyan)]/20 hover:shadow-[var(--cyan)]/40 hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
              <p className="text-xs text-[var(--muted)] flex items-center gap-2">
                <Zap className="w-3 h-3 text-[var(--mint)]" />
                Luminescent AI Core v1.4 • Powered by Bytez
              </p>
              <p className="text-xs text-[var(--muted)]">Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[10px]">Enter</kbd> to send</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
