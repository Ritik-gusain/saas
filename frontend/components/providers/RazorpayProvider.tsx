'use client';

import { ReactNode } from 'react';

interface RazorpayContextType {
  scriptLoaded: boolean;
}

export function RazorpayProvider({ children }: { children: ReactNode }) {
  // Load Razorpay script
  if (typeof window !== 'undefined' && !window.Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.head.appendChild(script);
  }

  return <>{children}</>;
}

export const useRazorpay = () => {
  return {
    openCheckout: (options: any) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    },
  };
};
