import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';

// TODO: Add Firebase Admin SDK for ID token verification
// import { adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const subscriptionId = searchParams.get('subscriptionId');
    const planTier = searchParams.get('planTier') || '3';

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 });
    }

    // Fetch subscription from Razorpay
    const subscription = await razorpayInstance.subscriptions.fetch(subscriptionId) as any;

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      planTier: parseInt(planTier),
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      paidCount: subscription.paid_count,
      remainingCount: subscription.remaining_count,
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
