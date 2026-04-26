"use client";

import { Download, UserPlus } from 'lucide-react';

export function AdminHeader() {
  return (
    <div className="glass-panel border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white font-[Montserrat] mb-1">Admin Dashboard</h1>
            <p className="text-sm text-[var(--muted)]">Manage your team, usage, and billing</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-panel px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white hover:border-[var(--cyan)] transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--cyan)]/20">
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
