"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquare, FolderKanban, Settings, Users, BarChart3, LogOut, ChevronRight, Sparkles, Zap, ChevronDown, Plus, Hash, Lock } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string>('Loading...');
  const [activeRoute, setActiveRoute] = useState('chat');
  const [chatExpanded, setChatExpanded] = useState(true);
  const [activeChannel, setActiveChannel] = useState('general');
  const [isPremium, setIsPremium] = useState(false);
  const [teamInfo, setTeamInfo] = useState<{ name: string; tier: string; members: number } | null>(null);

  const channels = [
    { id: 'general', name: 'General AI', icon: Hash, locked: false },
    { id: 'research', name: 'Market Research', icon: Hash, locked: false },
    { id: 'code', name: 'Code Review', icon: Hash, locked: false },
    { id: 'design', name: 'Design Sprint', icon: Lock, locked: true },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || 'User');
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/teams', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const teams = await res.json();
            const activeTeam = teams.find((t: any) => t.subscription_status === 'active');
            if (activeTeam) {
              setIsPremium(true);
              setTeamInfo({
                name: activeTeam.name || 'Team Workspace',
                tier: activeTeam.plan_tier === 1 ? 'Starter' : activeTeam.plan_tier === 2 ? 'Growth' : 'Pro',
                members: activeTeam.member_ids?.length || 1,
              });
            }
          }
        } catch (err) {
          console.error('Failed to fetch subscription status:', err);
        }
      }
    });

    if (pathname.includes('projects')) setActiveRoute('projects');
    else if (pathname.includes('settings')) setActiveRoute('settings');
    else if (pathname.includes('analytics')) setActiveRoute('analytics');
    else setActiveRoute('chat');

    return () => unsubscribe();
  }, [pathname]);

  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, href: '/dashboard/pro', expandable: true },
    { id: 'projects', label: 'Projects', icon: FolderKanban, href: '/dashboard/pro/projects', expandable: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/pro/analytics', expandable: false },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/pro/settings', expandable: false },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.expandable) {
      setChatExpanded(!chatExpanded);
    } else {
      router.push(item.href);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[var(--bg)] text-[var(--soft)] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-texture opacity-[0.04] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--cyan)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />

        {/* Sidebar */}
        <div className="w-72 glass-panel border-r flex flex-col z-10 relative">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/dashboard/pro')}>
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--cyan)] blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                <Logo size={36} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight font-[Montserrat] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
                  Luminescent
                </h2>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Team Workspace</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <div key={item.id}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative overflow-hidden cursor-pointer ${
                      isActive && !item.expandable
                        ? 'bg-gradient-to-r from-[var(--cyan)]/10 to-[var(--mint)]/10 border border-[var(--cyan)]/30 text-white shadow-lg shadow-[var(--cyan)]/5'
                        : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface)]'
                    }`}
                    onClick={() => handleNavigation(item)}
                  >
                    {isActive && !item.expandable && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--cyan)]/5 to-[var(--mint)]/5 animate-pulse" />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${
                      isActive && !item.expandable ? 'text-[var(--cyan)]' : 'text-[var(--muted)] group-hover:text-white'
                    }`} />
                    <span className="relative z-10 flex-1">{item.label}</span>
                    {item.expandable ? (
                      <ChevronDown className={`w-4 h-4 relative z-10 transition-transform ${
                        chatExpanded ? 'rotate-180' : ''
                      }`} />
                    ) : (
                      isActive && <ChevronRight className="w-4 h-4 text-[var(--cyan)] relative z-10" />
                    )}
                  </div>

                  {/* Nested Channels */}
                  {item.expandable && chatExpanded && (
                    <div className="mt-1 ml-4 space-y-1 animate-slide-in-right">
                      {isPremium ? (
                        <>
                          {channels.map((channel) => {
                            const ChannelIcon = channel.icon;
                            const isChannelActive = activeChannel === channel.id;
                            return (
                              <button
                                key={channel.id}
                                onClick={() => !channel.locked && setActiveChannel(channel.id)}
                                disabled={channel.locked}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                  isChannelActive
                                    ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20'
                                    : channel.locked
                                    ? 'text-[var(--muted)]/40 cursor-not-allowed'
                                    : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface)]'
                                }`}
                              >
                                <ChannelIcon className="w-3.5 h-3.5" />
                                <span className="flex-1 text-left truncate">{channel.name}</span>
                                {channel.locked && (
                                  <Lock className="w-3 h-3 text-[var(--muted)]/40" />
                                )}
                              </button>
                            );
                          })}
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/5 transition-all border border-dashed border-[var(--border)] hover:border-[var(--cyan)]/30">
                            <Plus className="w-3.5 h-3.5" />
                            <span>New Channel</span>
                          </button>
                        </>
                      ) : (
                        <div className="px-3 py-4 glass-panel rounded-xl border-dashed border-[var(--border)] text-center">
                          <Lock className="w-5 h-5 text-[var(--muted)] mx-auto mb-2 opacity-50" />
                          <p className="text-[10px] text-[var(--muted)] font-medium leading-relaxed">
                            Group features are locked.<br/>
                            <span className="text-[var(--cyan)] cursor-pointer hover:underline" onClick={() => router.push('/')}>Upgrade to unlock</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Team Plan Box */}
          <div className="p-4 border-t border-[var(--border)]">
            {isPremium ? (
              <div className="glass-panel rounded-xl p-4 mb-4 relative overflow-hidden group hover:border-[var(--cyan)]/30 transition-all cursor-pointer">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--cyan)] opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-4 mb-4 bg-gradient-to-br from-[var(--purple)]/5 to-[var(--cyan)]/5 border-dashed border-[var(--purple)]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-[var(--purple)]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Free Tier</span>
                </div>
                <p className="text-[10px] text-[var(--muted)] mb-3 leading-relaxed">
                  Unlock team collaboration, shared history, and custom agents.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full py-2 rounded-lg bg-[var(--purple)]/20 text-[var(--purple)] text-[10px] font-bold hover:bg-[var(--purple)]/30 transition-all"
                >
                  UPGRADE NOW
                </button>
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface)] transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--purple)] to-[var(--cyan)] flex items-center justify-center text-white text-xs font-bold">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{email}</div>
                <div className="text-[10px] text-[var(--muted)]">Team Owner</div>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--muted)] hover:text-red-400"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
