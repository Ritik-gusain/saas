"use client";

import { Users, Zap, Activity, DollarSign, TrendingUp, MoreVertical } from 'lucide-react';

export function AdminStats() {
  const stats = [
    { label: 'Total Members', value: '7', change: '+2 this month', icon: Users, color: 'cyan' },
    { label: 'Tokens Used', value: '89k', change: '59% of limit', icon: Zap, color: 'mint' },
    { label: 'Active Sessions', value: '12', change: '4 right now', icon: Activity, color: 'purple' },
    { label: 'Monthly Cost', value: '₹2,499', change: 'Next billing: Jan 15', icon: DollarSign, color: 'cyan' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-panel-hover glass-panel rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--${stat.color})]/20 to-[var(--${stat.color})]/10 border border-[var(--${stat.color})]/30 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-[var(--${stat.color})]`} />
              </div>
              <button className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-all">
                <MoreVertical className="w-4 h-4 text-[var(--muted)]" />
              </button>
            </div>
            <div className="text-3xl font-black text-white font-[Montserrat] mb-1">{stat.value}</div>
            <div className="text-xs text-[var(--muted)] mb-2">{stat.label}</div>
            <div className="text-xs text-[var(--mint)] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
