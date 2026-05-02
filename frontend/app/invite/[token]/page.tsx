'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authFetch } from '@/lib/api-client';

interface InviteData {
  id: string;
  teamId: string;
  teamName: string;
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
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(`/api/teams/invite/${params.token}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || 'This invitation is invalid or has expired.');
          return;
        }

        setInvite(data);
      } catch (err) {
        setError('Failed to connect to the invitation server.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [params.token]);

  const handleAcceptInvite = async () => {
    setAccepting(true);
    try {
      const res = await authFetch(`/api/teams/invite/${params.token}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to join the team.');
        return;
      }

      // Successful acceptance
      router.push(`/dashboard?teamId=${data.teamId}`);
    } catch (err) {
      setError('An authentication error occurred. Please ensure you are signed in.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080a14] text-white">
        <Loader2 className="w-12 h-12 text-[var(--cyan)] animate-spin mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase text-[var(--muted)]">Verifying Protocol...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a14] flex items-center justify-center p-6 selection:bg-[var(--cyan)] selection:text-[var(--bg)]">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--cyan)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--mint)]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="glass-panel rounded-[2rem] p-10 shadow-2xl border border-white/10">
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-2xl font-black text-white font-[Syne] mb-4">Invitation Error</h1>
              <p className="text-[var(--muted)] mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10"
              >
                Return Home
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center mx-auto mb-8 relative">
                <Users className="w-10 h-10 text-[var(--cyan)]" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--mint)] border-4 border-[#0B0E14] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[var(--bg)]" />
                </div>
              </div>

              <h1 className="text-3xl font-black text-white font-[Syne] mb-2">Join Workspace</h1>
              <p className="text-[var(--muted)] mb-10">
                You've been invited to collaborate with <span className="text-white font-bold">{invite?.teamName}</span>
              </p>

              <div className="space-y-4 mb-10">
                <div className="glass-panel rounded-2xl p-6 text-left border-l-4 border-[var(--cyan)]">
                  <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Invited as</p>
                  <p className="text-lg font-bold text-white">{invite?.email}</p>
                </div>
              </div>

              <button
                onClick={handleAcceptInvite}
                disabled={accepting}
                className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-black text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {accepting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Initialize Connection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="mt-8 text-xs text-[var(--muted)]">
                By joining, you agree to the team's shared workspace protocols and data governance.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-[var(--muted)]">
          Signed in as another user? <button onClick={() => router.push('/login')} className="text-[var(--cyan)] font-bold hover:underline">Switch Account</button>
        </p>
      </div>
    </div>
  );
}
