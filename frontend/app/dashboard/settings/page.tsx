"use client";

import { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, Users, Mail, Key, Globe, ArrowLeft } from 'lucide-react';
import ApiKeysForm from '@/components/settings/ApiKeysForm';
import TeamSettings from '@/components/settings/TeamSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';

type SectionId = 'profile' | 'team' | 'billing' | 'notifications' | 'security' | 'api';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const settingsSections = [
    { id: 'profile' as SectionId, title: 'Profile', icon: User, desc: 'Manage your personal information' },
    { id: 'team' as SectionId, title: 'Team', icon: Users, desc: 'Invite and manage team members' },
    { id: 'billing' as SectionId, title: 'Billing', icon: CreditCard, desc: 'Subscription and payment details' },
    { id: 'notifications' as SectionId, title: 'Notifications', icon: Bell, desc: 'Configure notification preferences' },
    { id: 'security' as SectionId, title: 'Security', icon: Shield, desc: 'Password and authentication settings' },
    { id: 'api' as SectionId, title: 'API Keys', icon: Key, desc: 'Manage personal API access tokens' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'team':
        return <TeamSettings />;
      case 'api':
        return <ApiKeysForm />;
      case 'profile':
        return <ProfileSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-2xl border-dashed border-2 border-[var(--border)]">
            <Settings className="w-12 h-12 text-[var(--muted)] mb-4 animate-spin-slow" />
            <h3 className="text-xl font-bold text-white font-[Syne]">Section Under Development</h3>
            <p className="text-sm text-[var(--muted)]">This configuration module is being optimized for the BYOK architecture.</p>
          </div>
        );
    }
  };

  if (activeSection) {
    return (
      <div className="h-full bg-transparent overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <button 
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </button>
          
          <div className="mb-12">
            <h1 className="text-3xl font-black text-white font-[Syne] mb-2">
              {settingsSections.find(s => s.id === activeSection)?.title}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {settingsSections.find(s => s.id === activeSection)?.desc}
            </p>
          </div>

          {renderSection()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white font-[Syne] mb-2">Settings</h1>
          <p className="text-sm text-[var(--muted)]">Manage your account and team preferences</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="glass-panel-hover glass-panel rounded-2xl p-6 text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[var(--cyan)]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-[Syne]">{section.title}</h3>
                <p className="text-sm text-[var(--muted)]">{section.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 glass-panel rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white font-[Syne] mb-6">Quick Overview</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-5 border-l-4 border-[var(--cyan)]">
              <h3 className="text-sm font-bold text-white mb-1">Active Workspace</h3>
              <p className="text-xs text-[var(--muted)] mb-4">You are currently managing the primary team assets.</p>
              <button 
                onClick={() => setActiveSection('team')}
                className="text-xs font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors"
              >
                Manage Team →
              </button>
            </div>
            <div className="glass-panel rounded-xl p-5 border-l-4 border-purple-500">
              <h3 className="text-sm font-bold text-white mb-1">API Key Status</h3>
              <p className="text-xs text-[var(--muted)] mb-4">Keys are configured for OpenAI and Anthropic.</p>
              <button 
                onClick={() => setActiveSection('api')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Update Keys →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
