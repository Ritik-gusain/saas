"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { MessageSquare, FolderKanban, Settings, LogOut, ChevronRight, Zap, Key } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { auth } from '@/lib/firebase';

export default function FreeTierLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState('chat');

  // Simple route detection
  React.useEffect(() => {
    if (pathname.includes('/projects')) setActiveRoute('projects');
    else if (pathname.includes('/settings')) setActiveRoute('settings');
    else setActiveRoute('chat');
  }, [pathname]);

  const navItems = [
    { id: 'chat', label: 'AI Agents', icon: MessageSquare, href: '/dashboard/free' },
    { id: 'projects', label: 'My Projects', icon: FolderKanban, href: '/dashboard/free/projects' },
    { id: 'settings', label: 'API Keys & Settings', icon: Settings, href: '/dashboard/free/settings' },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[var(--bg)] text-[var(--soft)] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-texture opacity-[0.04] pointer-events-none" />

        {/* Sidebar */}
        <div className="w-72 glass-panel border-r flex flex-col z-10 relative">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/dashboard/free')}>
              <Logo size={36} />
              <div>
                <h2 className="text-lg font-black text-white tracking-tight font-[Montserrat] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)] bg-clip-text text-transparent">
                  Luminescent
                </h2>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Free Tier (Local)</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--purple)]/10 to-[var(--cyan)]/10 border border-[var(--purple)]/30 text-white shadow-lg shadow-[var(--purple)]/5'
                      : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface)]'
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--purple)]' : 'text-[var(--muted)] group-hover:text-white'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-[var(--purple)]" />}
                </div>
              );
            })}
          </nav>

          {/* Upgrade Box */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="glass-panel rounded-xl p-4 mb-4 bg-gradient-to-br from-[var(--purple)]/5 to-[var(--cyan)]/5 border-dashed border-[var(--purple)]/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-[var(--purple)]" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Free Tier</span>
              </div>
              <p className="text-[10px] text-[var(--muted)] mb-3 leading-relaxed">
                Using your own API Key. Upgrade to unlock team collaboration, shared history, and unlimited tokens.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-2 rounded-lg bg-[var(--purple)]/20 text-[var(--purple)] text-[10px] font-bold hover:bg-[var(--purple)]/30 transition-all"
              >
                UPGRADE NOW
              </button>
            </div>

            {/* Logout */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface)] transition-all cursor-pointer group text-[var(--muted)] hover:text-red-400" onClick={() => auth.signOut()}>
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-semibold flex-1">Sign Out</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col z-10 relative">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
