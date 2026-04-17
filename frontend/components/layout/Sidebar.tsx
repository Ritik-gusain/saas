import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col py-6 px-4">
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
          <Settings className="w-5 h-5" /> Settings
        </Link>
      </nav>
    </aside>
  );
};
