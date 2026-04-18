import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, team_id } = await req.json();

    // Check if user is team owner or admin
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', team_id)
      .eq('user_id', user.id)
      .single();

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Only owners and admins can invite members' },
        { status: 403 }
      );
    }

    // Check seat availability
    const { data: team } = await supabase
      .from('teams')
      .select('plan_tier')
      .eq('id', team_id)
      .single();

    const { data: members, count } = await supabase
      .from('team_members')
      .select('id', { count: 'exact' })
      .eq('team_id', team_id);

    if (count && count >= team.plan_tier) {
      return NextResponse.json(
        {
          error: 'Seat limit reached',
          upgrade_required: true,
          used_seats: count,
          available_seats: team.plan_tier,
        },
        { status: 403 }
      );
    }

    // Create invite token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error } = await supabase.from('pending_invites').insert([
      {
        team_id,
        email,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // TODO: Send email with invite link
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

    return NextResponse.json(
      {
        success: true,
        inviteUrl,
        message: 'Invitation sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { error: 'Failed to invite member' },
      { status: 500 }
    );
  }

    if (count !== null && count >= team.plan_tier) {
      return NextResponse.json(
        { error: `Seat limit reached. Your plan allows up to ${team.plan_tier} members. Please upgrade your plan.` }, 
        { status: 400 }
      );
    }

    // 4. Send Invite via Supabase Admin
    // When the user clicks the link in the email, they join auth.users.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      // If user exists, we retrieve them and add them directly to the team.
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = usersData?.users.find(u => u.email === email);
      
      if (existingUser) {
        const { error: insertError } = await supabaseAdmin
          .from('team_members')
          .insert([{ team_id, user_id: existingUser.id, role: 'member' }]);
          
        if (insertError) throw insertError;
        return NextResponse.json({ message: 'Existing user successfully added to the team.' });
      }
      throw inviteError;
    }

    // 5. Add the newly pending user to team_members
    if (inviteData?.user?.id) {
        const { error: pendingInsertError } = await supabaseAdmin
        .from('team_members')
        .insert([{ team_id, user_id: inviteData.user.id, role: 'member' }]);
        if (pendingInsertError) throw pendingInsertError;
    }

    return NextResponse.json({ message: 'Invitation sent successfully.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
