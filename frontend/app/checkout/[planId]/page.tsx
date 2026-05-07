'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CreditCard, Wallet, AlertCircle, Loader2, Lock, ArrowLeft } from 'lucide-react';

import { useTeamStore } from '@/stores/teamStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const PLANS = {
  individual: { name: 'Individual', price: 'Free', tier: 1 },
  starter: { name: 'Starter', price: '₹999', tier: 3 },
  growth: { name: 'Growth', price: '₹2,499', tier: 7 },
  pro: { name: 'Pro', price: '₹3,999', tier: 12 },
};

export default function CheckoutPage({ params }: { params: Promise<{ planId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { currentTeam, isLoading, updateTeamSettings, fetchTeams } = useTeamStore();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const planId = unwrappedParams.planId as keyof typeof PLANS;
  const plan = PLANS[planId];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTeams();
      } else {
        router.push('/login');
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [fetchTeams, router]);

  useEffect(() => {
    if (authChecked && !isLoading && !currentTeam) {
      // In case they have an account but no team, we might need to handle this
      // But typically fetchTeams creates one if it doesn't exist
    } else if (authChecked && !plan) {
      router.push('/pricing');
    }
  }, [authChecked, currentTeam, isLoading, plan, router]);

  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader2 className="animate-spin text-[var(--cyan)]" size={32} />
      </div>
    );
  }

  if (!currentTeam || !plan) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateTeamSettings(currentTeam.id, { plan_tier: plan.tier as 1 | 3 | 7 | 12 });
      
      const path = plan.tier === 12 ? '/dashboard/pro' : plan.tier === 7 ? '/dashboard/growth' : plan.tier === 3 ? '/dashboard/starter' : '/dashboard/free';
      router.push(path);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white font-['Plus_Jakarta_Sans'] relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-texture opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--cyan)] opacity-[0.02] blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 glass-panel border-b border-[var(--border)]">
        <button onClick={() => router.push('/pricing')} className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Plans
        </button>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 shadow-[0_0_20px_var(--cyan)]/20">
             <Lock size={22} className="text-[var(--cyan)]" />
           </div>
           <div>
             <h1 className="font-['Montserrat'] text-3xl font-bold tracking-tight bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">Secure Checkout</h1>
             <p className="text-[15px] text-[var(--muted)] mt-1">Upgrade your workspace to the {plan.name} plan.</p>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Payment Method Selector */}
            <div className="p-6 rounded-2xl glass-panel border border-[var(--border)]">
               <h2 className="text-lg font-bold text-white mb-5 font-['Montserrat']">Payment Method</h2>
               <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setPaymentMethod('card')}
                   className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${
                     paymentMethod === 'card' 
                       ? 'bg-[var(--cyan)]/10 border-[var(--cyan)]/50 text-white shadow-[0_0_15px_var(--cyan)]/20' 
                       : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--cyan)]/30'
                   }`}
                 >
                   <CreditCard size={20} className={paymentMethod === 'card' ? 'text-[var(--cyan)]' : ''} />
                   <span className="font-medium">Credit Card</span>
                 </button>
                 <button 
                   onClick={() => setPaymentMethod('crypto')}
                   className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${
                     paymentMethod === 'crypto' 
                       ? 'bg-[var(--mint)]/10 border-[var(--mint)]/50 text-white shadow-[0_0_15px_var(--mint)]/20' 
                       : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--cyan)]/30'
                   }`}
                 >
                   <Wallet size={20} className={paymentMethod === 'crypto' ? 'text-[var(--mint)]' : ''} />
                   <span className="font-medium">Crypto Wallet</span>
                 </button>
               </div>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handleCheckout} className="p-6 rounded-2xl space-y-6 glass-panel border border-[var(--border)]">
              <h2 className="text-lg font-bold text-white mb-4 font-['Montserrat']">Payment Details</h2>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {paymentMethod === 'card' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-[var(--cyan)]/50 focus:shadow-[0_0_15px_var(--cyan)]/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-[var(--cyan)]/50 focus:shadow-[0_0_15px_var(--cyan)]/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest">CVC</label>
                      <input required type="text" placeholder="123" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-[var(--cyan)]/50 focus:shadow-[0_0_15px_var(--cyan)]/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest">Cardholder Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-[var(--cyan)]/50 focus:shadow-[0_0_15px_var(--cyan)]/20 transition-all" />
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F6851B]/20 to-[#F6851B]/5 border border-[#F6851B]/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_#F6851B]/10">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Connect Wallet</h3>
                    <p className="text-[14px] text-[var(--muted)] mt-1">Pay securely using MetaMask or WalletConnect.</p>
                  </div>
                  <button type="button" className="px-8 py-3 rounded-xl bg-[#F6851B] hover:bg-[#F6851B]/90 text-white font-bold transition-all shadow-[0_0_20px_#F6851B]/30 hover:scale-105 active:scale-95">
                    Connect Wallet
                  </button>
                  <p className="text-[12px] text-[var(--muted)] pt-2">Or send {plan.price} equivalent in ETH/USDC.</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 bg-[var(--cyan)] text-[#0f0f11] hover:brightness-110 shadow-[0_0_20px_var(--cyan)]/30 hover:scale-[1.02] active:scale-95"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                {isProcessing ? 'Processing...' : `Pay ${plan.price} & Upgrade`}
              </button>
              
              <p className="text-[11px] text-center text-[var(--muted)] mt-4 flex items-center justify-center gap-1">
                <Lock size={10} /> Payments are processed securely. You can cancel your subscription at any time.
              </p>
            </form>
          </div>

          {/* Summary Side */}
          <div>
            <div className="p-6 rounded-2xl sticky top-24 glass-panel border border-[var(--border)] shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 font-['Montserrat']">Order Summary</h2>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">{plan.name} Plan</h3>
                  <p className="text-[13px] text-[var(--muted)] mt-1">Billed monthly</p>
                </div>
                <span className="font-['Montserrat'] font-black text-white text-xl">{plan.price}</span>
              </div>

              <div className="h-px w-full bg-[var(--border)] mb-6" />

              <div className="space-y-4 mb-6">
                 <div className="flex items-center justify-between text-[15px]">
                   <span className="text-[var(--muted)]">Subtotal</span>
                   <span className="text-white font-medium">{plan.price}</span>
                 </div>
                 <div className="flex items-center justify-between text-[15px]">
                   <span className="text-[var(--muted)]">Taxes</span>
                   <span className="text-[var(--muted)] text-[13px]">Calculated at next step</span>
                 </div>
              </div>

              <div className="h-px w-full bg-[var(--border)] mb-6" />

              <div className="flex items-center justify-between mb-8">
                 <span className="font-bold text-white">Total due today</span>
                 <span className="font-['Montserrat'] font-black text-2xl bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] bg-clip-text text-transparent">
                   {plan.price}
                 </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--cyan)]/5 border border-[var(--cyan)]/20 flex items-start gap-3">
                <Sparkles size={18} className="text-[var(--cyan)] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[var(--soft)] leading-relaxed">
                  You're upgrading to the <strong className="text-white font-bold">{plan.name}</strong> tier. You will get instant access to all premium features upon successful payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
