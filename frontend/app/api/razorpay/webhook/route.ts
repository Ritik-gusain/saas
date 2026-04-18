import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { verifyWebhookSignature, RazorpayWebhookPayload } from '@/lib/razorpay';

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
    const supabase = createRouteHandlerClient({ cookies });

    switch (payload.event) {
      case 'subscription.activated': {
        const subscription = payload.payload.subscription?.entity;
        if (!subscription) break;

        // Get user by email from notes
        const userEmail = subscription.notes?.user_email;
        const planTier = subscription.notes?.plan_tier;

        if (userEmail && planTier) {
          const { data: user } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .single();

          if (user) {
            // Create or update team
            const { data: team } = await supabase
              .from('teams')
              .select('id')
              .eq('owner_id', user.id)
              .single();

            const teamData = {
              owner_id: user.id,
              plan_tier: planTier,
              razorpay_subscription_id: subscription.id,
              razorpay_customer_id: subscription.customer_id,
              subscription_status: 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            };

            if (team) {
              await supabase
                .from('teams')
                .update(teamData)
                .eq('id', team.id);
            } else {
              await supabase
                .from('teams')
                .insert([
                  {
                    name: `${user.id}'s Team`,
                    ...teamData,
                    created_at: new Date().toISOString(),
                  },
                ]);
            }

            // Log audit
            await supabase.from('audit_logs').insert([
              {
                team_id: team?.id,
                user_id: user.id,
                action: 'subscription_activated',
                entity_type: 'subscription',
                metadata: { subscription_id: subscription.id },
                created_at: new Date().toISOString(),
              },
            ]);
          }
        }
        break;
      }

      case 'subscription.charged': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription) {
          // Update subscription status
          await supabase
            .from('teams')
            .update({
              subscription_status: 'active',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('razorpay_subscription_id', subscription.id);
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscription = payload.payload.subscription?.entity;
        if (subscription) {
          // Update subscription status
          await supabase
            .from('teams')
            .update({ subscription_status: 'cancelled' })
            .eq('razorpay_subscription_id', subscription.id);
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload.payment?.entity;
        if (payment) {
          // Log failed payment
          await supabase.from('audit_logs').insert([
            {
              action: 'payment_failed',
              entity_type: 'payment',
              metadata: {
                payment_id: payment.id,
                subscription_id: payment.subscription_id,
                error_code: payment.error_code,
              },
              created_at: new Date().toISOString(),
            },
          ]);
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
