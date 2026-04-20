"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import { auth } from '@/lib/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string>('Loading...');

  useEffect(() => {
    // AuthGuard ensures this only mounts when auth state is resolved.
    setEmail(auth.currentUser?.email || 'User');
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[var(--bg)] text-[var(--soft)] font-['DM_Sans'] relative overflow-hidden">
        {/* Grid Texture Background */}
        <div className="absolute inset-0 bg-grid-texture opacity-[0.03] pointer-events-none" />

        {/* Sidebar */}
        <div className="w-64 bg-[var(--hud)]/20 backdrop-blur-xl border-r border-[var(--border)] p-6 flex flex-col z-10 relative">
          <div className="flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="Luminescent Logo" width={32} height={20} className="opacity-90" />
            <h2 className="text-xl font-black text-white tracking-tight font-[Syne] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">Luminescent</h2>
          </div>

          <nav className="space-y-2 flex-1">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--soft)] bg-[var(--cyan)]/5 border border-[var(--cyan)]/20 transition-all">
              Chat
            </a>
            <a href="/projects" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--soft)] hover:text-white hover:bg-[var(--cyan)]/5 transition-all">
              Projects
            </a>
            <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--soft)] hover:text-white hover:bg-[var(--cyan)]/5 transition-all">
              Settings
            </a>
          </nav>

          <div className="mt-12 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--soft)]/60 mb-4 truncate">{email}</p>
            <button 
              onClick={() => auth.signOut()}
              className="w-full text-left text-xs font-bold text-white hover:text-[var(--cyan)] transition-colors px-4"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col z-10 relative">
          <header className="bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <p className="text-[13px] font-bold text-[var(--cyan)] uppercase tracking-widest">Dashboard</p>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-[var(--mint)] animate-pulse" />
                <span className="text-[11px] text-[var(--soft)]/70 uppercase tracking-tighter">System Active</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
