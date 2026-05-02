"use client";

import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-8 border-t-4 border-rose-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 opacity-5 blur-3xl pointer-events-none" />
        
        <h2 className="text-xl font-bold text-white font-[Syne] mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-400" />
          Password & Authentication
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 glass-panel rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Key className="w-5 h-5 text-[var(--muted)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Change Password</h3>
                <p className="text-xs text-[var(--muted)]">Update your account password</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[var(--surface)] text-sm font-semibold hover:bg-[var(--border)] transition-colors">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-5 glass-panel rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[var(--muted)]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">Two-Factor Auth</h3>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">Disabled</span>
                </div>
                <p className="text-xs text-[var(--muted)]">Secure your account with an authenticator app</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-300 border border-rose-500/30 text-sm font-bold hover:opacity-90 transition-opacity">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8 border border-red-500/20">
        <h2 className="text-xl font-bold text-red-400 font-[Syne] mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        
        <p className="text-sm text-[var(--muted)] mb-6">
          Permanently delete your account and all associated personal data. This action cannot be undone. 
          If you are the owner of a team, you must transfer ownership or delete the team first.
        </p>

        <button className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}
