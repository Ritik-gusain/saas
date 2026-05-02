"use client";

import { useState } from 'react';
import { Bell, Smartphone, Mail, Globe, Monitor, CheckCircle2 } from 'lucide-react';

export default function NotificationSettings() {
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

  const notifyOptions = [
    { id: 'invites', title: 'Team Invites & Mentions', desc: 'When someone invites you or @mentions you in a project.', default: true },
    { id: 'activity', title: 'Agent Activity', desc: 'When a long-running AI agent completes its task.', default: true },
    { id: 'billing', title: 'Billing & Subscriptions', desc: 'Invoices, failed payments, and plan changes. (Owner only)', default: true },
    { id: 'digest', title: 'Weekly Digest', desc: 'A summary of your team\'s token usage and top queries.', default: false },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-8 border-t-4 border-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-5 blur-3xl pointer-events-none" />
        
        <h2 className="text-xl font-bold text-white font-[Syne] mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-emerald-400" />
          Email Notifications
        </h2>

        <div className="space-y-4">
          {notifyOptions.map((opt) => (
            <div key={opt.id} className="flex items-start justify-between p-4 glass-panel rounded-xl">
              <div className="flex-1 pr-4">
                <h3 className="text-sm font-bold text-white mb-1">{opt.title}</h3>
                <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" className="sr-only peer" defaultChecked={opt.default} />
                <div className="w-9 h-5 bg-[var(--surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-[var(--border)]"></div>
              </label>
            </div>
          ))}
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
          className="bg-[var(--surface)] text-white border border-[var(--border)] hover:border-emerald-500/50 px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
