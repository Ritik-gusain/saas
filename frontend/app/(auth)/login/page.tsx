"use client";
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const syncUser = async (user: any) => {
    const token = await user.getIdToken();
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to sync user data with server');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(userCredential.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] relative overflow-hidden font-['DM_Sans'] text-[var(--soft)]">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial-gradient from-[var(--cyan)]/10 via-[var(--cyan)]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-radial-gradient from-[var(--mint)]/5 to-transparent rounded-full blur-[80px] pointer-events-none animate-float" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-texture opacity-[0.05] pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="relative z-50 px-8 py-6 border-b border-[var(--border)] bg-transparent">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Logo size={32} />
          <span className="text-white font-black text-lg tracking-tight font-[Syne] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
            Luminescent.io
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 lg:-mt-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight font-[Syne]">Welcome Back</h2>
            <p className="text-[var(--soft)]/60 text-sm uppercase tracking-widest font-bold">Terminal Login // V1.4</p>
          </div>

          <div className="bg-[var(--hud)]/20 border border-[var(--border)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-black/50">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[13px] animate-fade-in-up">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--soft)] uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative">
                 <input 
                   type="email" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   placeholder="operator@luminescent.io"
                   required 
                   className="w-full bg-[var(--bg)] border border-[var(--border)] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)]/20 transition-all placeholder:text-[var(--soft)]/20 text-sm"
                 />
                </div>
              </div>
              
              <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                 <label className="text-[10px] font-bold text-[var(--soft)] uppercase tracking-[0.2em]">Security Key</label>
                 <a href="#" className="text-[10px] text-[var(--cyan)] hover:text-[var(--mint)] transition-colors uppercase tracking-widest font-bold">Recover?</a>
               </div>
               <div className="relative">
                 <input 
                   type="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   placeholder="••••••••"
                   required 
                   className="w-full bg-[var(--bg)] border border-[var(--border)] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)]/20 transition-all placeholder:text-[var(--soft)]/20 text-sm"
                 />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] font-black text-sm rounded-xl shadow-lg shadow-[var(--cyan)]/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group uppercase tracking-[0.1em]"
              >
                {loading ? "Decrypting..." : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px bg-[var(--border)] flex-1"></div>
              <span className="text-[9px] text-[var(--soft)]/40 uppercase tracking-[0.2em] font-bold">Protocol Auth</span>
              <div className="h-px bg-[var(--border)] flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
                    const provider = new GoogleAuthProvider();
                    const cred = await signInWithPopup(auth, provider);
                    await syncUser(cred.user);
                    router.push('/dashboard');
                  } catch (err: any) {
                    setError(err.message || 'Google sign-in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-3 flex items-center justify-center gap-2 bg-[var(--cyan)]/5 hover:bg-[var(--cyan)]/10 border border-[var(--border)] hover:border-[var(--cyan)]/30 text-white text-[12px] font-bold rounded-xl transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.17v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.17C1.43 8.55 1 10.22 1 12s.43 3.45 1.17 4.93l2.85-2.22.82-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.17-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { GithubAuthProvider, signInWithPopup } = await import('firebase/auth');
                    const provider = new GithubAuthProvider();
                    const cred = await signInWithPopup(auth, provider);
                    await syncUser(cred.user);
                    router.push('/dashboard');
                  } catch (err: any) {
                    setError(err.message || 'GitHub sign-in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-3 flex items-center justify-center gap-2 bg-[var(--cyan)]/5 hover:bg-[var(--cyan)]/10 border border-[var(--border)] hover:border-[var(--cyan)]/30 text-white text-[12px] font-bold rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
            
            <div className="mt-8 text-center text-[12px] text-[var(--soft)]/50 font-medium">
              New operator?{" "}
              <Link href="/register" className="text-[var(--cyan)] hover:text-[var(--mint)] font-bold transition-colors">
                Apply for Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
