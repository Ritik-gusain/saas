import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // 1. Verify caller is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, team_id } = await req.json();

    // 2. Check if caller is the owner of the team
    const { data: membership, error: memError } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('team_id', team_id)
      .eq('user_id', user.id)
      .single();

    if (memError || !membership || membership.role !== 'owner') {
      return NextResponse.json({ error: 'Only team owners can invite members.' }, { status: 403 });
    }

    // 3. Core Business Logic: Check Team Plan Tier Limits
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('plan_tier')
      .eq('id', team_id)
      .single();

    if (teamError || !team) {
        return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    const { count, error: countError } = await supabaseAdmin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', team_id);

    if (countError) throw countError;

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
