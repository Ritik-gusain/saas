"use client";

import { Settings, User, Bell, Shield, CreditCard, Users, Mail, Key, Globe } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    { id: 'profile', title: 'Profile', icon: User, desc: 'Manage your personal information' },
    { id: 'team', title: 'Team', icon: Users, desc: 'Invite and manage team members' },
    { id: 'billing', title: 'Billing', icon: CreditCard, desc: 'Subscription and payment details' },
    { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Configure notification preferences' },
    { id: 'security', title: 'Security', icon: Shield, desc: 'Password and authentication settings' },
    { id: 'api', title: 'API Keys', icon: Key, desc: 'Manage API access tokens' },
  ];

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
          <h2 className="text-xl font-bold text-white font-[Syne] mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">Current Plan</h3>
              <p className="text-xs text-[var(--muted)] mb-4">Growth Team • 7 members</p>
              <button className="text-xs font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors">
                Upgrade Plan →
              </button>
            </div>
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">Invite Members</h3>
              <p className="text-xs text-[var(--muted)] mb-4">Add teammates to your workspace</p>
              <button className="text-xs font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors">
                Send Invite →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
