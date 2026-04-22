'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, Save } from 'lucide-react';
import { authFetch } from '@/lib/api-client';

export default function ApiKeysForm() {
  const [keys, setKeys] = useState({
    openrouter: '',
    anthropic: '',
    google: '',
    openai: '',
  });
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleChange = (provider: string, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const toggleShow = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const res = await authFetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_keys: keys }),
      });
      if (res.ok) setStatus('saved');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-12 glass-panel rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center">
          <Key className="w-5 h-5 text-[var(--cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-[Syne]">Bring Your Own Key (BYOK)</h2>
          <p className="text-sm text-[var(--muted)]">Provide your own API keys for free individual usage. Team usage will use the subscription.</p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        {['openrouter', 'anthropic', 'google', 'openai'].map((provider) => (
          <div key={provider} className="glass-panel rounded-xl p-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-white capitalize">{provider} API Key</label>
            <div className="relative">
              <input
                type={showKeys[provider] ? 'text' : 'password'}
                value={keys[provider as keyof typeof keys]}
                onChange={(e) => handleChange(provider, e.target.value)}
                placeholder={`sk-...`}
                className="w-full bg-[#0B0E14]/50 border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all"
              />
              <button
                type="button"
                onClick={() => toggleShow(provider)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
              >
                {showKeys[provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        <div className="pt-4 flex items-center justify-between">
          <p className="text-xs text-[var(--muted)]">Keys are stored locally and in your encrypted profile preferences.</p>
          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Keys'}
          </button>
        </div>
      </div>
    </div>
  );
}
