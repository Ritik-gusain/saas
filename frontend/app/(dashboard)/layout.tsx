import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Luminescent</h2>

        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium">
            Chat
          </a>
          <a href="/projects" className="block text-gray-700 hover:text-blue-600 font-medium">
            Projects
          </a>
          <a href="/settings" className="block text-gray-700 hover:text-blue-600 font-medium">
            Settings
          </a>
        </nav>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">{session.user.email}</p>
          <a href="/api/auth/logout" className="text-sm text-red-600 hover:text-red-700 font-medium">
            Sign Out
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <p className="text-gray-600">Dashboard</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
