"use client";

import { BarChart3, Users, TrendingUp, CreditCard, Settings } from 'lucide-react';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'usage', label: 'Usage Analytics', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex items-center gap-2 mt-6 border-b border-[var(--border)] -mb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-[var(--cyan)]'
                : 'text-[var(--muted)] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
