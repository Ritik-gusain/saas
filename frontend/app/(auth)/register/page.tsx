"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    
    console.log('Sync successful');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      await syncUser(userCredential.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080a14] relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-radial from-indigo-600/15 via-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-radial from-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-float" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="relative z-50 px-6 py-6 border-b border-white/[0.06] bg-transparent">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Luminescent<span className="text-violet-400">.io</span>
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 lg:-mt-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">Get started with your free account</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-black/50">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm animate-fade-in-up">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                 <input 
                   type="text" 
                   value={name} 
                   onChange={(e) => setName(e.target.value)} 
                   placeholder="John Doe"
                   required 
                   className="w-full bg-[#0c0e1a] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder-slate-600"
                 />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                 <input 
                   type="email" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   placeholder="you@example.com"
                   required 
                   className="w-full bg-[#0c0e1a] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder-slate-600"
                 />
                </div>
              </div>
              
              <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
               <div className="relative">
                 <input 
                   type="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   placeholder="••••••••"
                   required 
                   minLength={6}
                   className="w-full bg-[#0c0e1a] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder-slate-600"
                 />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-2.5 mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? "Creating Account..." : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px bg-white/[0.08] flex-1"></div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Or continue with</span>
              <div className="h-px bg-white/[0.08] flex-1"></div>
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
                    setError(err.message || 'Google sign-up failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-2.5 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-white text-sm font-medium rounded-xl transition-all"
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
                    setError(err.message || 'GitHub sign-up failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-2.5 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-white text-sm font-medium rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
