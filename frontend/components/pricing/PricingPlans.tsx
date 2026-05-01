'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Users, ArrowRight, HelpCircle } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  highlighted: boolean;
  features: string[];
  cta: string;
  accent: string;
}

const plans: Plan[] = [
  {
    id: 'individual',
    name: 'Individual',
    price: 'Free',
    period: '',
    description: 'Perfect for solo developers and personal projects',
    highlighted: false,
    accent: '#00FFAA',
    features: [
      'Bring your own API key',
      'Unlimited personal chats',
      'All AI models supported',
      'Local chat history',
      'Community support',
    ],
    cta: 'Start Free',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '\u20B9999',
    period: '/month',
    description: 'For small teams just getting started',
    highlighted: false,
    accent: '#00FFAA',
    features: [
      'Everything in Individual',
      'Up to 3 team members',
      'Shared workspace',
      'Shared chat history',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Get Started',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '\u20B92,499',
    period: '/month',
    description: 'Best for scaling teams',
    highlighted: true,
    accent: '#00D0FF',
    features: [
      'Everything in Starter',
      'Up to 7 team members',
      'Custom AI agents',
      'Projects & folders',
      'Priority support',
      'Advanced analytics',
      'Team prompts library',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '\u20B93,999',
    period: '/month',
    description: 'For large organizations',
    highlighted: false,
    accent: '#00FFAA',
    features: [
      'Everything in Growth',
      'Up to 15 team members',
      'SSO & advanced security',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'Audit logs',
    ],
    cta: 'Contact Sales',
  },
];

const faqs = [
  { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'What happens when I exceed my token limit?', a: 'We\'ll notify you at 80% usage. You can purchase additional token packs or upgrade your plan seamlessly.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use end-to-end encryption, never train on your data, and are SOC 2 Type II compliant.' },
  { q: 'Can I get a refund?', a: 'We offer a 14-day money-back guarantee on all paid plans. No questions asked.' },
];

export default function PricingPlans() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'individual') {
      router.push('/register');
    } else {
      // In Next.js we can pass query params
      router.push(`/register?plan=${planId}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#101418' }}>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6" style={{ background: 'rgba(16,20,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => router.push('/')} className="flex items-center gap-2.5 no-underline">
          <Logo size={28} />
          <span className="font-montserrat text-sm font-bold" style={{ background: 'linear-gradient(135deg, #00FFAA, #00D0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Luminescent
          </span>
        </button>
        <button onClick={() => router.push('/login')} className="text-sm font-medium transition-colors hover:text-[#00FFAA]" style={{ color: 'rgba(248,249,250,0.6)' }}>
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center">
        <span className="tag inline-flex mb-6">
          <Sparkles size={11} /> Pricing Plans
        </span>
        <h1 className="font-montserrat font-black text-white mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.04em' }}>
          Simple, transparent pricing
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300 }}>
          Start free, upgrade when you need team features. No hidden fees, no surprises.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: billingCycle === 'monthly' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: billingCycle === 'monthly' ? '#F8F9FA' : 'rgba(248,249,250,0.4)',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            style={{
              background: billingCycle === 'yearly' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: billingCycle === 'yearly' ? '#F8F9FA' : 'rgba(248,249,250,0.4)',
            }}
          >
            Yearly
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#00FFAA20', color: '#00FFAA' }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl p-6 flex flex-col transition-all duration-300"
              style={{
                background: plan.highlighted
                  ? 'linear-gradient(135deg, rgba(0,92,105,0.2), rgba(0,208,255,0.05))'
                  : 'rgba(255,255,255,0.03)',
                border: plan.highlighted
                  ? '1px solid rgba(0,208,255,0.3)'
                  : hoveredPlan === plan.id
                    ? '1px solid rgba(0,255,170,0.2)'
                    : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.highlighted ? '0 0 60px rgba(0,208,255,0.08)' : 'none',
                transform: hoveredPlan === plan.id ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.highlighted && (
                <div
                  className="font-mono-dm text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4"
                  style={{ background: 'linear-gradient(135deg, #00FFAA, #00D0FF)', color: '#101418' }}
                >
                  Most Popular
                </div>
              )}

              <h3 className="font-montserrat text-lg font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-montserrat text-4xl font-black text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm" style={{ color: 'rgba(248,249,250,0.4)' }}>
                    {billingCycle === 'yearly' && plan.period !== '' ? '/year' : plan.period}
                  </span>
                )}
              </div>
              <p className="text-sm mb-6" style={{ color: 'rgba(248,249,250,0.4)', fontWeight: 300 }}>{plan.description}</p>

              <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(248,249,250,0.6)' }}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${plan.accent}15` }}
                    >
                      <Check size={12} style={{ color: plan.accent }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: plan.highlighted
                    ? 'linear-gradient(135deg, #00FFAA, #00D0FF)'
                    : hoveredPlan === plan.id
                      ? 'rgba(0,255,170,0.1)'
                      : 'rgba(255,255,255,0.06)',
                  color: plan.highlighted ? '#101418' : hoveredPlan === plan.id ? '#00FFAA' : 'rgba(248,249,250,0.7)',
                  border: plan.highlighted ? 'none' : hoveredPlan === plan.id ? '1px solid rgba(0,255,170,0.3)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-montserrat text-2xl font-bold text-white mb-3">Need a custom enterprise solution?</h3>
          <p className="text-sm max-w-lg mx-auto mb-6" style={{ color: 'rgba(248,249,250,0.4)', fontWeight: 300 }}>
            We offer tailored solutions for large organizations with custom security requirements, dedicated infrastructure, and specialized support.
          </p>
          <button
            className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #00FFAA, #00D0FF)', color: '#101418' }}
          >
            <Users size={16} />
            Contact Sales Team
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-montserrat text-3xl font-black text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <HelpCircle
                    size={18}
                    className="flex-shrink-0 transition-transform"
                    style={{
                      color: openFaq === i ? '#00FFAA' : 'rgba(248,249,250,0.3)',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm" style={{ color: 'rgba(248,249,250,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(248,249,250,0.25)' }}>
          &copy; 2025 Luminescent. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
