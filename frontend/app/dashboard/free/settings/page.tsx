"use client";

import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FreeTierSettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing API key from local storage if available
    const existingKey = localStorage.getItem('luminescent_user_api_key');
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('luminescent_user_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full bg-transparent overflow-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-black text-white font-[Syne] mb-2">Settings</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Manage your Free Tier preferences and API Keys.</p>

        <div className="glass-panel rounded-2xl p-8 border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--purple)]/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-[var(--purple)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Bring Your Own Key</h2>
              <p className="text-xs text-[var(--muted)]">Connect your Bytez or OpenAI API key to use agents.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-all outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <AlertCircle className="w-4 h-4" />
                Keys are stored locally in your browser.
              </div>
              <button
                onClick={handleSave}
                className="bg-[var(--purple)] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--purple)]/90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--purple)]/20"
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
