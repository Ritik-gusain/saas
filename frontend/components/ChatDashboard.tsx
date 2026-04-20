import { useState } from 'react';
import { Bot, MessageSquare, Send, Users, ArrowRight } from 'lucide-react';
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
      {/* Sidebar - Inner */}
      <div className="w-72 bg-[var(--hud)]/10 border-r border-[var(--border)] flex flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-[var(--soft)]/50 uppercase tracking-[0.2em] mb-4">Team Hub</h4>
            <div className="bg-[var(--cyan)]/5 border border-[var(--cyan)]/20 rounded-xl p-5 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-4 h-4 text-[var(--cyan)]" />
                <p className="text-xs font-bold text-white uppercase tracking-wider">Active Plan</p>
              </div>
              <p className="text-[13px] text-[var(--soft)] leading-relaxed">
                <span className="text-white font-bold">1</span> / {selectedPlan} members invited.
              </p>
              <button className="mt-4 text-[11px] font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors uppercase tracking-widest flex items-center gap-2">
                Invite Teammate <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--cyan)]/10 text-white rounded-xl border border-[var(--cyan)]/20 font-bold text-sm shadow-lg shadow-[var(--cyan)]/5">
              <MessageSquare className="w-4 h-4 text-[var(--cyan)]" />
              Main Terminal
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--soft)] hover:text-white hover:bg-[var(--cyan)]/5 transition-all rounded-xl text-sm font-medium">
              <Bot className="w-4 h-4 opacity-70" />
              Custom Agents
            </button>
          </nav>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent">
        <header className="h-14 border-b border-[var(--border)] flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Channel: General_AI</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex gap-5 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-fade-in-up`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] border-transparent' 
                  : 'bg-[var(--hud)]/40 border-[var(--border)]'
              }`}>
                {msg.role === 'user' ? <span className="text-[10px] font-black tracking-tighter text-[var(--bg)]">ME</span> : <Logo size={18} animated={false} />}
              </div>
              <div className={`relative rounded-2xl px-6 py-4 text-[14px] leading-relaxed shadow-2xl border ${
                msg.role === 'user' 
                  ? 'bg-[var(--cyan)]/10 text-white border-[var(--cyan)]/30 rounded-tr-none' 
                  : 'bg-[var(--hud)]/20 text-[var(--soft)] border-[var(--border)] rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-5 max-w-4xl animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-[var(--hud)]/40 border border-[var(--border)] flex items-center justify-center">
                <Logo size={18} animated={false} />
              </div>
              <div className="bg-[var(--hud)]/20 border border-[var(--border)] rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center group">
            <div className="absolute inset-0 bg-[var(--cyan)]/5 blur-xl group-focus-within:bg-[var(--cyan)]/10 transition-all rounded-full" />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject command to Bytez AI..."
              className="w-full relative bg-[var(--hud)]/40 border border-[var(--border)] rounded-2xl pl-6 pr-16 py-4.5 text-[14px] text-white placeholder:text-[var(--soft)]/30 focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 p-3 bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] rounded-xl hover:opacity-90 disabled:opacity-30 transition-all shadow-xl shadow-[var(--cyan)]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-[var(--soft)]/30 uppercase tracking-[0.2em] mt-5">
            Luminescent AI Core // Experimental V1.4
          </p>
        </div>
      </div>
    </div>
  );
}
