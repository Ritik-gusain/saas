'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InviteData {
  teamId: string;
  email: string;
}

export default function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(`/api/teams/invite/${params.token}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Invalid invitation');
          return;
        }

        const data = await res.json();
        setInvite(data);
      } catch (err) {
        setError('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [params.token]);

  const handleAcceptInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/invite/${params.token}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to accept invitation');
        return;
      }

      // Redirect to dashboard
      router.push(`/dashboard?teamId=${data.teamId}`);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a14]">
        <p className="text-slate-400">Loading invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a14]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-lg">
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-sm underline hover:no-underline"
          >
            Go to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a14] flex items-center justify-center">
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Join Team</h1>

        {invite && (
          <div className="space-y-6">
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Invited email:</p>
              <p className="text-lg font-semibold text-white">{invite.email}</p>
            </div>

            <button
              onClick={handleAcceptInvite}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Accepting...' : 'Accept Invitation'}
            </button>

            <p className="text-center text-sm text-slate-500">
              or{' '}
              <a href="/login" className="text-violet-400 hover:text-violet-300">
                sign in to continue
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
