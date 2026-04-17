import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Team Settings</h1>
        
        <div className="max-w-3xl space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Plan Details</h2>
            <p className="text-slate-600 mb-6">You are currently on the <span className="font-semibold text-slate-900">Starter Team (3 Members)</span> plan.</p>
            <Button variant="primary">Upgrade Plan</Button>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invite Members</h2>
            <p className="text-slate-600 mb-6">Invite your teammates to join Luminescent.</p>
            <form className="flex gap-3">
              <div className="flex-1">
                <Input type="email" placeholder="colleague@company.com" />
              </div>
              <Button type="button" variant="primary">Send Invite</Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
