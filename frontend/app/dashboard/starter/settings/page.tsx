"use client";

import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Users, Key, ArrowLeft } from 'lucide-react';
import ApiKeysForm from '@/components/settings/ApiKeysForm';
import TeamSettings from '@/components/settings/TeamSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';

type SectionId = 'profile' | 'team' | 'billing' | 'notifications' | 'security' | 'api';

const sections = [
  { id: 'profile' as SectionId, title: 'Profile', icon: User, desc: 'Manage your personal information', color: 'var(--cyan)' },
  { id: 'team' as SectionId, title: 'Team', icon: Users, desc: 'Invite and manage team members (3 seats)', color: 'var(--mint)' },
  { id: 'billing' as SectionId, title: 'Billing', icon: CreditCard, desc: 'Subscription and payment details', color: 'var(--purple)' },
  { id: 'notifications' as SectionId, title: 'Notifications', icon: Bell, desc: 'Configure notification preferences', color: '#f59e0b' },
  { id: 'security' as SectionId, title: 'Security', icon: Shield, desc: 'Password and authentication settings', color: '#ef4444' },
  { id: 'api' as SectionId, title: 'API Keys', icon: Key, desc: 'Manage shared team API keys (BYOK)', color: 'var(--cyan)' },
];

function renderSection(id: SectionId) {
  switch (id) {
    case 'team': return <TeamSettings />;
    case 'api': return <ApiKeysForm />;
    case 'profile': return <ProfileSettings />;
    case 'billing': return <BillingSettings />;
    case 'notifications': return <NotificationSettings />;
    case 'security': return <SecuritySettings />;
  }
}

export default function StarterSettingsPage() {
  const [active, setActive] = useState<SectionId | null>(null);

  if (active) {
    return (
      <div className="h-full bg-transparent overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <button onClick={() => setActive(null)} className="flex items-center gap-2 text-[var(--muted)] hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </button>
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white font-[Syne] mb-1">{sections.find(s => s.id === active)?.title}</h1>
            <p className="text-sm text-[var(--muted)]">{sections.find(s => s.id === active)?.desc}</p>
          </div>
          {renderSection(active)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white font-[Syne] mb-1">Settings</h1>
          <p className="text-sm text-[var(--muted)]">Starter Plan — 3 seats</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActive(s.id)} className="glass-panel-hover glass-panel rounded-2xl p-6 text-left group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${s.color} 30%, transparent)` }}>
                  <Icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 font-[Syne]">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
