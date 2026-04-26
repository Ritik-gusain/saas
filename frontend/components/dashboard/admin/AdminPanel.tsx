"use client";

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { AdminTabs } from './AdminTabs';
import { AdminOverview } from './AdminOverview';
import { AdminMembers } from './AdminMembers';

interface AdminPanelProps {
  teamData?: {
    name: string;
    plan: string;
    members: number;
    tokensUsed: number;
    tokensLimit: number;
  };
}

export default function AdminPanel({ teamData = {
  name: "Growth Team",
  plan: "Growth",
  members: 7,
  tokensUsed: 89000,
  tokensLimit: 150000
}}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'usage' | 'billing' | 'settings'>('overview');

  return (
    <div className="h-full bg-transparent overflow-auto">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-8">
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && <AdminOverview />}

        {/* Members Tab */}
        {activeTab === 'members' && <AdminMembers tokensLimit={teamData.tokensLimit} />}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && activeTab !== 'members' && (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-[var(--muted)]" />
            </div>
            <h3 className="text-xl font-bold text-white font-[Montserrat] mb-2">Coming Soon</h3>
            <p className="text-sm text-[var(--muted)]">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}
