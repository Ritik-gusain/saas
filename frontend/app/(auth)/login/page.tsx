'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#101418' }}>
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 no-underline">
            <Logo size={40} />
            <span
              className="font-montserrat text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00FFAA, #00D0FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Luminescent
            </span>
          </Link>

          <h1 className="font-montserrat text-3xl font-black text-white mb-3">Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300 }}>
            Sign in to your team workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(248,249,250,0.6)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#F8F9FA',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,208,255,0.3)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(248,249,250,0.6)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl pl-11 pr-12 py-3.5 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#F8F9FA',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,208,255,0.3)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={16} style={{ color: 'rgba(248,249,250,0.4)' }} />
                  ) : (
                    <Eye size={16} style={{ color: 'rgba(248,249,250,0.4)' }} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#00FFAA' }} />
                <span className="text-xs" style={{ color: 'rgba(248,249,250,0.5)' }}>Remember me</span>
              </label>
              <button type="button" className="text-xs font-medium transition-colors hover:text-[#00FFAA]" style={{ color: '#00D0FF' }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00FFAA, #00D0FF)',
                color: '#101418',
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#101418] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'rgba(248,249,250,0.4)' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold transition-colors hover:text-[#00FFAA]" style={{ color: '#00D0FF' }}>
              Get started
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1117 0%, #0A1A1F 100%)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0,255,170,0.08) 0%, rgba(0,208,255,0.04) 40%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,208,255,0.15), rgba(0,255,170,0.1))',
              border: '1px solid rgba(0,208,255,0.2)',
            }}
          >
            <Logo size={48} animated={false} />
          </div>
          <h2 className="font-montserrat text-2xl font-bold text-white mb-4">
            Your team's AI workspace
          </h2>
          <p className="text-sm" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
            Collaborate seamlessly with shared conversations, custom agents, and powerful tools designed for modern teams.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-10">
            {[
              { val: '89k', label: 'Tokens saved' },
              { val: '2,400+', label: 'Teams' },
              { val: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-montserrat text-xl font-black text-white">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgba(248,249,250,0.3)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
