import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { razorpayInstance } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await req.json();

    const { data: team } = await supabase
      .from('teams')
      .select('razorpay_subscription_id')
      .eq('id', teamId)
      .single();

    if (!team?.razorpay_subscription_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Cancel subscription
    await razorpayInstance.subscriptions.cancel(team.razorpay_subscription_id, {
      cancel_at_cycle_end: false,
    });

    // Update team status
    await supabase
      .from('teams')
      .update({ subscription_status: 'cancelled' })
      .eq('id', teamId);

    // Log audit
    await supabase.from('audit_logs').insert([
      {
        team_id: teamId,
        user_id: user.user?.id,
        action: 'subscription_cancelled',
        entity_type: 'subscription',
        metadata: { subscription_id: team.razorpay_subscription_id },
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
