'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingPlansProps {
  onSelectPlan?: (plan: 'starter' | 'growth' | 'pro') => void;
}

const plans = [
  {
    id: 'starter',
    name: 'Starter Team',
    price: 2400,
    currency: '₹',
    seats: 3,
    features: [
      'Up to 3 team members',
      'Shared AI chatbot',
      'Basic chat features',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Team',
    price: 4900,
    currency: '₹',
    seats: 7,
    popular: true,
    features: [
      'Up to 7 team members',
      'All Starter features',
      'Projects & collaboration',
      'Team system prompts',
      'Priority support',
      'Usage analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Team',
    price: 8200,
    currency: '₹',
    seats: 12,
    features: [
      'Up to 12 team members',
      'All Growth features',
      'Custom agents',
      'API access',
      'Dedicated account manager',
      '24/7 support',
    ],
  },
];

export default function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (onSelectPlan) {
      onSelectPlan(planId as any);
    } else {
      // Redirect to checkout
      router.push(`/checkout?plan=${planId}`);
    }
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3 text-gray-900">Simple Pricing</h2>
        <p className="text-center text-gray-600 mb-12">
          One flat fee for your entire team. Stop paying for individual ChatGPT subscriptions.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border-2 p-6 relative transition-all ${
                plan.popular
                  ? 'border-purple-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </p>

              <p className="text-sm text-gray-500 mb-6">{plan.seats} team members included</p>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id}
                className={`w-full py-2 rounded-lg font-semibold transition mb-6 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                    : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                }`}
              >
                {selectedPlan === plan.id ? 'Selecting...' : 'Get Started'}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-12 text-sm">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
