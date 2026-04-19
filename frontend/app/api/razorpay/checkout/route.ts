import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance, RAZORPAY_PLANS, PLAN_CONFIG } from '@/lib/razorpay';

// TODO: Import Firebase Admin SDK to verify ID token server-side
// import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // const token = authHeader.replace('Bearer ', '');
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // const uid = decodedToken.uid;
    // const userEmail = decodedToken.email;

    const { planType, userEmail, userId } = await req.json();

    if (!planType) {
      return NextResponse.json({ error: 'planType is required' }, { status: 400 });
    }

    const planId = RAZORPAY_PLANS[planType as keyof typeof RAZORPAY_PLANS];
    const planConfig = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];

    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Create Razorpay customer
    const customer = await razorpayInstance.customers.create({
      email: userEmail,
      gstin: undefined,
    });

    // Create subscription
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12,
      start_at: Math.floor(Date.now() / 1000),
      notes: {
        user_email: userEmail,
        plan_tier: planConfig?.seats,
        firebase_uid: userId,
      },
      customer_id: customer.id,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
