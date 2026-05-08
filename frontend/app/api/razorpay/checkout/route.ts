import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance, RAZORPAY_PLANS, PLAN_CONFIG } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email;

    const { planType, teamId } = await req.json();

    if (!planType || !teamId) {
      return NextResponse.json({ error: 'planType and teamId are required' }, { status: 400 });
    }

    const planId = RAZORPAY_PLANS[planType as keyof typeof RAZORPAY_PLANS];
    const planConfig = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];

    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Create Razorpay customer
    const customer = await razorpayInstance.customers.create({
      email: userEmail,
    });

    // Create subscription
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 120, // 10 years
      start_at: Math.floor(Date.now() / 1000) + 60, // Start in 1 minute
      notes: {
        user_email: userEmail,
        plan_tier: planConfig?.seats,
        firebase_uid: uid,
        team_id: teamId
      },
      customer_id: customer.id,
    } as any);

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

