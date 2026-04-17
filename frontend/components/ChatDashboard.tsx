import { useState } from 'react';
import { Bot, MessageSquare, Send, Users } from 'lucide-react';
import { sendMessageToModel } from '@/lib/models';

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
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-xl">Luminescent</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Team</h4>
            <div className="bg-blue-50 text-blue-800 rounded-lg p-4 text-sm flex items-start gap-3">
              <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Active Plan</p>
                <p>1 / {selectedPlan} members invited.</p>
                <button className="mt-2 text-blue-600 font-medium hover:underline text-xs">Invite Teammate</button>
              </div>
            </div>
          </div>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-medium">
              <MessageSquare className="w-5 h-5" />
              Team Chat
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={onSignOut}
            className="text-sm text-slate-500 hover:text-slate-900 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="h-16 border-b border-slate-200 flex items-center px-6 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">Team Chat - General</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}`}>
                {msg.role === 'user' ? <Users className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Bytez AI..."
              className="w-full bg-slate-100 border-0 rounded-full pl-6 pr-14 py-4 text-[15px] focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-3">
            AI models can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}