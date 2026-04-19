import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, RazorpayWebhookPayload } from '@/lib/razorpay';

// TODO: Replace console logs with Firestore writes when DB is set up
// import { db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body);

    switch (payload.event) {
      case 'subscription.activated': {
        const subscription = payload.payload.subscription?.entity;
        if (!subscription) break;

        const firebaseUid = subscription.notes?.firebase_uid;
        const planTier = subscription.notes?.plan_tier;
        const userEmail = subscription.notes?.user_email;

        console.log('[Webhook] subscription.activated', {
          firebaseUid,
          planTier,
          subscriptionId: subscription.id,
        });

        // TODO: Write to Firestore
        // await db.collection('teams').add({
        //   owner_id: firebaseUid,
        //   plan_tier: planTier,
        //   razorpay_subscription_id: subscription.id,
        //   razorpay_customer_id: subscription.customer_id,
        //   subscription_status: 'active',
        //   created_at: new Date().toISOString(),
        // });
        break;
      }

      case 'subscription.charged': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription) {
          console.log('[Webhook] subscription.charged', { subscriptionId: subscription.id });
          // TODO: Update Firestore team subscription status
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription) {
          console.log('[Webhook] subscription.cancelled', { subscriptionId: subscription.id });
          // TODO: Update Firestore team subscription_status to 'cancelled'
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload.payment?.entity;
        if (payment) {
          console.log('[Webhook] payment.failed', {
            paymentId: payment.id,
            subscriptionId: payment.subscription_id,
            errorCode: payment.error_code,
          });
          // TODO: Log to Firestore audit_logs collection
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
