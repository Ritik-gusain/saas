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

    // Get user's team subscription
    const { data: team } = await supabase
      .from('teams')
      .select('razorpay_customer_id')
      .eq('owner_id', user.user?.id)
      .single();

    if (!team?.razorpay_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Generate customer portal URL
    const portalUrl = `https://customer.razorpay.com/${team.razorpay_customer_id}`;

    return NextResponse.json({ portalUrl });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portal URL' },
      { status: 500 }
    );
  }
}
