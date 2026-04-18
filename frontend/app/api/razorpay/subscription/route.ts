import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { razorpayInstance } from '@/lib/razorpay';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = req.nextUrl.searchParams.get('teamId');

    const { data: team } = await supabase
      .from('teams')
      .select('razorpay_subscription_id, subscription_status, plan_tier')
      .eq('id', teamId)
      .single();

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Fetch subscription from Razorpay
    const subscription = await razorpayInstance.subscriptions.fetch(
      team.razorpay_subscription_id
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      planTier: team.plan_tier,
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
