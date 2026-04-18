import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get invite details
    const { data: invite, error } = await supabase
      .from('pending_invites')
      .select('team_id, email, expired_at')
      .eq('token', params.token)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if invite is expired
    if (new Date(invite.expired_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({ teamId: invite.team_id, email: invite.email });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get invite details
    const { data: invite, error: inviteError } = await supabase
      .from('pending_invites')
      .select('team_id, email')
      .eq('token', params.token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invalid invitation' },
        { status: 404 }
      );
    }

    // Add user to team
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([
        {
          team_id: invite.team_id,
          user_id: user.id,
          role: 'member',
          joined_at: new Date().toISOString(),
        },
      ]);

    if (memberError) {
      return NextResponse.json(
        { error: memberError.message },
        { status: 400 }
      );
    }

    // Mark invite as used
    await supabase
      .from('pending_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('token', params.token);

    return NextResponse.json({ success: true, teamId: invite.team_id });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
