import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { razorpayInstance, RAZORPAY_PLANS, PLAN_CONFIG } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { planType } = await req.json();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create Razorpay customer
    const { data: existingCustomer } = await supabase
      .from('teams')
      .select('razorpay_customer_id')
      .eq('owner_id', user.id)
      .single();

    let customerId = existingCustomer?.razorpay_customer_id;

    if (!customerId) {
      const customer = await razorpayInstance.customers.create({
        email: user.email,
        contact: user.phone || undefined,
        gstin: undefined,
      });
      customerId = customer.id;
    }

    const planId = RAZORPAY_PLANS[planType as keyof typeof RAZORPAY_PLANS];
    const planConfig = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];

    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Create subscription checkout
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 months
      start_at: Math.floor(Date.now() / 1000),
      notes: {
        user_email: user.email,
        plan_tier: planConfig.seats,
      },
      customer_id: customerId,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      customerId,
    });
  } catch (error) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
