import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, RazorpayWebhookPayload } from '@/lib/razorpay';

import { db } from '@/lib/firebase-admin';

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

        const teamId = subscription.notes?.team_id;
        const planTier = Number(subscription.notes?.plan_tier) || 1;

        console.log('[Webhook] subscription.activated', {
          teamId,
          planTier,
          subscriptionId: subscription.id,
        });

        if (teamId) {
          await db.collection('teams').doc(teamId).update({
            plan_tier: planTier,
            razorpay_subscription_id: subscription.id,
            razorpay_customer_id: subscription.customer_id,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'subscription.charged': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription && subscription.notes?.team_id) {
          console.log('[Webhook] subscription.charged', { subscriptionId: subscription.id });
          await db.collection('teams').doc(subscription.notes.team_id).update({
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription && subscription.notes?.team_id) {
          console.log('[Webhook] subscription.cancelled', { subscriptionId: subscription.id });
          await db.collection('teams').doc(subscription.notes.team_id).update({
            subscription_status: 'cancelled',
            // Do NOT reset plan_tier until the period ends, or handle as needed
            // For now, just mark status
            updated_at: new Date().toISOString(),
          });
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
          // Log failure
          await db.collection('audit_logs').add({
            type: 'payment_failed',
            paymentId: payment.id,
            subscriptionId: payment.subscription_id,
            error: payment.error_code,
            createdAt: new Date().toISOString()
          });
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
