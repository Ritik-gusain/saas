'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Building2, Check } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const plans = [
  { id: 'individual', name: 'Individual', price: 'Free', accent: '#00FFAA' },
  { id: 'starter', name: 'Starter', price: '\u20B9999/mo', accent: '#00FFAA' },
  { id: 'growth', name: 'Growth', price: '\u20B92,499/mo', accent: '#00D0FF' },
  { id: 'pro', name: 'Pro', price: '\u20B93,999/mo', accent: '#00FFAA' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlanFromState = searchParams.get('plan');

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(selectedPlanFromState || 'growth');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  const isStep1Valid = selectedPlan;
  const isStep2Valid = formData.fullName && formData.email && formData.password && formData.password === formData.confirmPassword && agreedToTerms;

  return (
    <div className="min-h-screen flex" style={{ background: '#101418' }}>
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 no-underline">
            <Logo size={36} />
            <span
              className="font-montserrat text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, #00FFAA, #00D0FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Luminescent.io
            </span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: step >= 1 ? 'linear-gradient(135deg, #00FFAA, #00D0FF)' : 'rgba(255,255,255,0.08)',
                color: step >= 1 ? '#101418' : 'rgba(248,249,250,0.4)',
              }}
            >
              {step > 1 ? <Check size={14} /> : '1'}
            </div>
            <div className="flex-1 h-0.5 rounded-full" style={{ background: step >= 2 ? 'linear-gradient(90deg, #00FFAA, #00D0FF)' : 'rgba(255,255,255,0.08)' }} />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: step >= 2 ? 'linear-gradient(135deg, #00FFAA, #00D0FF)' : 'rgba(255,255,255,0.08)',
                color: step >= 2 ? '#101418' : 'rgba(248,249,250,0.4)',
              }}
            >
              2
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="font-montserrat text-2xl font-black text-white mb-2">Choose your plan</h1>
              <p className="text-sm mb-6" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300 }}>
                Select the plan that works best for your team. You can always change later.
              </p>

              <div className="space-y-3 mb-8">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selectedPlan === plan.id ? `${plan.accent}10` : 'rgba(255,255,255,0.03)',
                      border: selectedPlan === plan.id ? `1px solid ${plan.accent}40` : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: selectedPlan === plan.id ? plan.accent : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {selectedPlan === plan.id && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: plan.accent }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{plan.name}</span>
                        {plan.id === 'growth' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#00FFAA20', color: '#00FFAA' }}>
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: plan.accent }}>{plan.price}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full py-4 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #00FFAA, #00D0FF)', color: '#101418' }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <h1 className="font-montserrat text-2xl font-black text-white mb-2">Create your account</h1>
              <p className="text-sm mb-6" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300 }}>
                Join {plans.find(p => p.id === selectedPlan)?.name} plan. Let's set up your workspace.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      required
                      className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    Company (optional)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Acme Inc."
                      className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(248,249,250,0.3)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className="w-full rounded-xl pl-11 pr-12 py-3 text-sm outline-none transition-all"
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

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat password"
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F8F9FA',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,208,255,0.3)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs mt-1 text-red-400">Passwords don't match</p>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded"
                    style={{ accentColor: '#00FFAA' }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(248,249,250,0.5)' }}>
                    I agree to the{' '}
                    <button type="button" className="underline hover:text-[#00FFAA]" style={{ color: '#00D0FF' }}>Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="underline hover:text-[#00FFAA]" style={{ color: '#00D0FF' }}>Privacy Policy</button>
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(248,249,250,0.6)',
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isStep2Valid || isLoading}
                    className="flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #00FFAA, #00D0FF)', color: '#101418' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#101418] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-sm" style={{ color: 'rgba(248,249,250,0.4)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors hover:text-[#00FFAA]" style={{ color: '#00D0FF' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1117 0%, #0A1A1F 100%)' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0,255,170,0.06) 0%, rgba(0,208,255,0.03) 40%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,208,255,0.15), rgba(0,255,170,0.1))',
              border: '1px solid rgba(0,208,255,0.2)',
            }}
          >
            <Logo size={40} animated={false} />
          </div>

          <h2 className="font-montserrat text-2xl font-bold text-white mb-4">
            Start building with AI
          </h2>
          <p className="text-sm mb-10" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
            Join thousands of teams using Luminescent to collaborate smarter, ship faster, and scale their AI workflows.
          </p>

          {/* Testimonials */}
          <div
            className="rounded-xl p-5 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-sm mb-4 italic" style={{ color: 'rgba(248,249,250,0.7)', lineHeight: 1.7 }}>
              "Luminescent transformed how our team uses AI. The shared workspace and custom agents alone saved us 20+ hours per week."
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #00D0FF, #00FFAA)', color: '#101418' }}
              >
                PS
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Priya Sharma</div>
                <div className="text-xs" style={{ color: 'rgba(248,249,250,0.4)' }}>Engineering Lead, TechFlow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#101418] flex items-center justify-center"><Logo size={40} animated={true} /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
