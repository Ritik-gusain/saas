"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  MessageSquare, FolderKanban, Settings,
  Search, Code, Download, MoreHorizontal,
  PanelLeftClose, FileText, Plus, Briefcase, Layers, Sparkles, Trash2
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useTeamStore } from '@/stores/teamStore';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentTeam } = useTeamStore();
  const { conversations, currentConversation, loadConversation, createConversation, fetchConversations, unpinConversation, deleteConversation } = useChatStore();
  const { toggleSidebar } = useUIStore();
  const [email, setEmail] = useState<string>('Loading...');
  const [activeRoute, setActiveRoute] = useState('chat');

  const isPremium = currentTeam?.plan_tier && currentTeam.plan_tier >= 3;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) setEmail(user.email || 'User');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (pathname.includes('projects')) setActiveRoute('projects');
    else if (pathname.includes('settings')) setActiveRoute('settings');
    else if (pathname.includes('analytics')) setActiveRoute('analytics');
    else setActiveRoute('chat');
  }, [pathname]);

  useEffect(() => {
    if (currentTeam?.id) fetchConversations(currentTeam.id);
  }, [currentTeam?.id, fetchConversations]);

  const getBaseRoute = () => '/dashboard';


  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleNewConversation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTeam?.id) return;
    await createConversation(currentTeam.id, 'New Conversation');
    router.push(getBaseRoute());
  };

  const NavItem = ({ icon: Icon, label, onClick, isActive, badge }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group ${isActive ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20 shadow-[0_0_15px_var(--cyan)]/5' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-white'
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[var(--cyan)]' : 'text-[var(--muted)] group-hover:text-white'}`} strokeWidth={2} />
        {label}
      </div>
      {badge && (
        <span className="text-[10px] border border-[var(--border)] text-[var(--muted)] px-2 py-0.5 rounded-full uppercase tracking-wider bg-[var(--surface)]">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="w-64 glass-panel border-r flex flex-col z-10 relative flex-shrink-0 text-white h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[var(--border)]/50">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push(getBaseRoute())}>
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--cyan)] blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            <Logo size={22} />
          </div>
          <h2 className="text-[17px] font-black tracking-tight ml-1 font-['Montserrat'] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
            Luminescent
          </h2>
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-[var(--muted)] hover:text-[var(--cyan)] transition-colors p-1 rounded-md hover:bg-[var(--surface)]"
        >
          <PanelLeftClose className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-3 overflow-y-auto flex-1 scrollbar-hide py-3">
        {/* New Chat Button */}
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-white hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] rounded-md mb-3 group transition-all"
        >
          <Plus className="w-[18px] h-[18px] text-[var(--cyan)]" strokeWidth={2} />
          New chat
        </button>

        {/* Top Nav Items */}
        <div className="space-y-1 mb-6 border-b border-[var(--border)]/50 pb-4">
          <NavItem icon={Search} label="Search" />
          <NavItem icon={MessageSquare} label="Chats" onClick={() => handleNavigation('/dashboard/chat')} isActive={activeRoute === 'chat'} />
          <NavItem icon={Layers} label="Projects" onClick={() => handleNavigation('/dashboard/projects')} isActive={activeRoute === 'projects'} />
          <NavItem icon={Briefcase} label="Analytics" onClick={() => handleNavigation('/dashboard/analytics')} isActive={activeRoute === 'analytics'} />
          <NavItem icon={Settings} label="Settings" onClick={() => handleNavigation('/dashboard/settings')} isActive={activeRoute === 'settings'} />
        </div>

        {/* Starred */}
        <div className="mb-6">
          <h3 className="px-3 text-[10px] font-bold text-[var(--muted)] mb-2 tracking-widest uppercase">Starred</h3>
          <div className="space-y-0.5">
            {conversations.filter(c => c.is_pinned).map(conv => {
              const isActive = currentConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    loadConversation(conv.id);
                    if (activeRoute !== 'chat') handleNavigation(getBaseRoute());
                  }}
                  className={`px-3 py-2 text-[13px] rounded-md cursor-pointer flex justify-between items-center group transition-colors
                    ${isActive ? 'bg-[var(--cyan)]/10 text-white border border-[var(--cyan)]/10' : 'text-[var(--soft)] hover:bg-[var(--surface)] hover:text-white'}
                  `}
                >
                  <span className="truncate pr-2">{conv.title || 'New Conversation'}</span>
                  <div className={`flex items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-1 rounded-md hover:bg-red-500/20 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-[var(--cyan)]/20 transition-colors">
                      <MoreHorizontal className={`w-[14px] h-[14px] ${isActive ? 'text-[var(--cyan)]' : 'text-[var(--muted)] hover:text-white'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
            {conversations.filter(c => c.is_pinned).length === 0 && (
              <div className="px-3 py-2 text-[13px] text-[var(--muted)] italic">No starred chats</div>
            )}
          </div>
        </div>

        {/* Recents */}
        <div className="pb-4">
          <h3 className="px-3 text-[10px] font-bold text-[var(--muted)] mb-2 tracking-widest uppercase">Recents</h3>
          <div className="space-y-0.5">
            {conversations.filter(c => !c.is_pinned).map(conv => {
              const isActive = currentConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    loadConversation(conv.id);
                    if (activeRoute !== 'chat') handleNavigation(getBaseRoute());
                  }}
                  className={`px-3 py-2 text-[13px] rounded-md cursor-pointer flex justify-between items-center group transition-colors
                    ${isActive ? 'bg-[var(--cyan)]/10 text-white border border-[var(--cyan)]/10' : 'text-[var(--soft)] hover:bg-[var(--surface)] hover:text-white'}
                  `}
                >
                  <span className="truncate pr-2">{conv.title || 'New Conversation'}</span>
                  <div className={`flex items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-1 rounded-md hover:bg-red-500/20 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-[var(--cyan)]/20 transition-colors">
                      <MoreHorizontal className={`w-[14px] h-[14px] ${isActive ? 'text-[var(--cyan)]' : 'text-[var(--muted)] hover:text-white'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
            {conversations.filter(c => !c.is_pinned).length === 0 && (
              <div className="px-3 py-2 text-[13px] text-[var(--muted)] italic">No recent chats</div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 mt-auto border-t border-[var(--border)]/50">
        <div className="flex items-center justify-between p-2 hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] rounded-md cursor-pointer group transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--cyan)] flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-none mb-1">{email.split('@')[0]}</div>
              <div className="text-[10px] text-[var(--cyan)] capitalize font-semibold tracking-wide">
                {currentTeam?.plan_tier === 12 ? 'Pro plan' : currentTeam?.plan_tier === 7 ? 'Growth plan' : currentTeam?.plan_tier === 3 ? 'Starter plan' : 'Free plan'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-[var(--cyan)]/20 text-[var(--muted)] hover:text-[var(--cyan)] transition-colors">
              <Download className="w-[14px] h-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
