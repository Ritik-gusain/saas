"use client";

import React, { useState } from 'react';
import { 
  User, Shield, CreditCard, Key, 
  Bell, Globe, LogOut, Trash2,
  Sparkles, Settings as SettingsIcon
} from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import TeamSettings from '@/components/settings/TeamSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useTeamStore } from '@/stores/teamStore';

type Tab = 'profile' | 'team' | 'billing' | 'security' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { currentTeam } = useTeamStore();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-[var(--cyan)]' },
    { id: 'team', label: 'Team', icon: Shield, color: 'text-[var(--mint)]' },
    { id: 'billing', label: 'Billing', icon: CreditCard, color: 'text-purple-400' },
    { id: 'security', label: 'Security', icon: Key, color: 'text-amber-400' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-blue-400' },
  ];

  return (
    <div className="h-full bg-transparent overflow-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white font-[Syne]">Settings</h1>
            <p className="text-sm text-[var(--muted)]">Manage your personal preferences and team workspace configurations.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white/10 text-white shadow-sm shadow-white/5' 
                    : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                  {tab.label}
                  {tab.id === 'team' && currentTeam?.plan_tier && currentTeam.plan_tier > 1 && (
                    <Sparkles className="w-3 h-3 text-[var(--cyan)] ml-auto" />
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-12 pt-8 border-t border-white/5">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600/50 hover:text-red-600 transition-all mt-1">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'team' && <TeamSettings />}
              {activeTab === 'billing' && <BillingSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
