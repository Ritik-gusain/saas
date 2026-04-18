'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';

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
  const supabase = useSupabase();
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Join Team</h1>

        {invite && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Invited email:</p>
              <p className="text-lg font-semibold text-gray-900">{invite.email}</p>
            </div>

            <button
              onClick={handleAcceptInvite}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Accepting...' : 'Accept Invitation'}
            </button>

            <p className="text-center text-sm text-gray-600">
              or{' '}
              <a href="/auth/login" className="text-blue-600 hover:underline">
                sign in to continue
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
