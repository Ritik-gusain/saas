import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
        <Bot size={28} className="text-blue-600" />
        Luminescent
      </Link>
      <div className="space-x-4">
        <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium">Login</Link>
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Get Started</Link>
      </div>
    </nav>
  );
};
