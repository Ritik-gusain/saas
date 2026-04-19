import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';

// TODO: Add Firebase Admin SDK for ID token verification
// import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 });
    }

    // Cancel subscription at end of current cycle
    await razorpayInstance.subscriptions.cancel(subscriptionId, {
      cancel_at_cycle_end: false,
    });

    // TODO: Update subscription status in Firestore
    // await db.collection('teams').doc(teamId).update({ subscription_status: 'cancelled' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
