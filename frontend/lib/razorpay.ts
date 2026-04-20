// Razorpay configuration and utilities
import Razorpay from 'razorpay';

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const RAZORPAY_PLANS = {
  starter: process.env.RAZORPAY_PLAN_STARTER_ID || '',
  growth: process.env.RAZORPAY_PLAN_GROWTH_ID || '',
  pro: process.env.RAZORPAY_PLAN_PRO_ID || '',
};

export const PLAN_CONFIG = {
  starter: { seats: 3, price: 2400, currency: 'INR' },
  growth: { seats: 7, price: 4900, currency: 'INR' },
  pro: { seats: 12, price: 8200, currency: 'INR' },
};

export interface RazorpaySubscription {
  id: string;
  plan_id: string;
  customer_id: string;
  status: 'active' | 'cancelled' | 'pending' | 'halted' | 'completed';
  current_period_start: number;
  current_period_end: number;
  paid_count: number;
  customer_notify: number;
  created_at: number;
  expire_by?: number;
  short_url?: string;
  has_scheduled_changes?: boolean;
  change_scheduled_at?: number;
  remaining_count?: number;
  notes?: Record<string, any>;
}

export interface RazorpayWebhookPayload {
  event: string;
  created_at: number;
  payload: {
    subscription?: {
      entity: RazorpaySubscription;
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        subscription_id: string;
      };
    };
  };
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}
