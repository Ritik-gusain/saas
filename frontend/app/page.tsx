"use client";

import { useState } from 'react';
import PricingPlans from '@/components/PricingPlans';
import ChatDashboard from '@/components/ChatDashboard';

export default function SaaSApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleLogin = (planMembers: number) => {
    setSelectedPlan(planMembers);
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setSelectedPlan(null);
  };

  if (!isLoggedIn) {
    return <PricingPlans onSelectPlan={handleLogin} />;
  }

  return <ChatDashboard selectedPlan={selectedPlan} onSignOut={handleSignOut} />;
}
