"use client";

import { CreditCard, Download, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';

export default function BillingSettings() {
  const { teamInfo } = useTeamStore();
  const isPremium = teamInfo?.plan === 'Growth' || teamInfo?.plan === 'Pro';
  
  const invoices = [
    { id: 'INV-2026-04', date: 'Apr 01, 2026', amount: '₹4,900', status: 'Paid' },
    { id: 'INV-2026-03', date: 'Mar 01, 2026', amount: '₹4,900', status: 'Paid' },
    { id: 'INV-2026-02', date: 'Feb 01, 2026', amount: '₹4,900', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-8 border-t-4 border-purple-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 opacity-5 blur-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white font-[Syne] mb-2">Current Plan</h2>
            <p className="text-sm text-[var(--muted)]">Manage your team's subscription and billing details.</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-[var(--cyan)]/20 border border-purple-500/30 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white">{teamInfo?.plan || 'Growth'} Tier</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel rounded-xl p-5">
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Billing Cycle</div>
            <div className="text-lg font-bold text-white mb-1">Monthly</div>
            <div className="text-xs text-[var(--muted)]">Next charge: May 01, 2026</div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Active Seats</div>
            <div className="text-lg font-bold text-white mb-1">{teamInfo?.members || 1} / 7 Used</div>
            <div className="text-xs text-[var(--mint)] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Within limit
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Monthly Cost</div>
            <div className="text-lg font-bold text-white mb-1">₹4,900<span className="text-xs text-[var(--muted)] font-normal">/mo</span></div>
            <div className="text-xs text-[var(--muted)]">Flat rate. No hidden fees.</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-gradient-to-r from-purple-500 to-[var(--cyan)] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
            <CreditCard className="w-4 h-4" />
            Manage Subscription
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
          <button className="glass-panel px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white transition-all">
            Change Plan
          </button>
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-4">Subscription management is securely handled by Razorpay.</p>
      </div>

      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-[Syne]">Billing History</h2>
          <button className="text-sm font-semibold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors">
            Download All
          </button>
        </div>
        
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 glass-panel-hover rounded-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[var(--muted)]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{inv.amount}</div>
                  <div className="text-xs text-[var(--muted)]">{inv.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 rounded-md bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/20 text-[10px] font-bold uppercase tracking-wider">
                  {inv.status}
                </span>
                <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all text-[var(--muted)] hover:text-[var(--cyan)]">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
