"use client";

import { useState } from 'react';
import { User, Mail, Briefcase, Building, Shield, CheckCircle2 } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-8 border-t-4 border-[var(--cyan)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cyan)] opacity-5 blur-3xl pointer-events-none" />
        
        <h2 className="text-xl font-bold text-white font-[Syne] mb-6">Personal Information</h2>
        
        <div className="flex items-start gap-8 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center relative group cursor-pointer">
            <User className="w-10 h-10 text-[var(--cyan)] group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <span className="text-xs font-bold text-white">Upload</span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Last Name</label>
                <input type="text" defaultValue="Chen" className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input type="email" defaultValue="alex@luminescent.io" disabled className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-[var(--muted)] opacity-70 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Job Title
            </label>
            <input type="text" defaultValue="Product Lead" className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white font-[Syne] mb-6">AI Preferences</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Default Model</label>
            <select className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none appearance-none">
              <option value="gpt-4-turbo">GPT-4 Turbo (Recommended)</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="gemini-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Personal System Prompt</label>
            <textarea 
              rows={4}
              placeholder="E.g., 'I prefer concise answers in bullet points. I write code in TypeScript.'"
              className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none resize-none"
            />
            <p className="text-[10px] text-[var(--muted)] mt-2">This instruction is appended to your team's global system prompt.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-[var(--mint)] animate-slide-up">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-bold">Preferences Saved</span>
          </div>
        )}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
