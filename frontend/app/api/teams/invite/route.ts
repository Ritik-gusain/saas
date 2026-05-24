import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { email, team_id } = await req.json();

    if (!email || !team_id) {
      return NextResponse.json(
        { error: 'email and team_id are required' },
        { status: 400 }
      );
    }

    // Verify user is owner or admin of the team
    const teamDoc = await db.collection('teams').doc(team_id).get();
    if (!teamDoc.exists) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const teamData = teamDoc.data();
    if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    if (teamData.owner_id !== uid && !teamData.member_ids?.includes(uid)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // --- Subscription & Seat Validation ---
    const planTier = Number(teamData.plan_tier) || 1;
    if (planTier <= 1) {
      return NextResponse.json({ 
        error: 'Team invitations are only available on paid plans. Please upgrade your plan to invite collaborators.' 
      }, { status: 403 });
    }

    const currentMemberCount = (teamData.member_ids?.length || 0) + 1;
    const now = new Date().toISOString();
    const activeInvitesSnapshot = await db.collection('pending_invites')
      .where('teamId', '==', team_id)
      .get();
    
    const pendingInvitesCount = activeInvitesSnapshot.docs.filter(doc => {
      const data = doc.data();
      return !data.usedAt && data.expiresAt > now;
    }).length;

    if (currentMemberCount + pendingInvitesCount >= planTier) {
      return NextResponse.json({ 
        error: `Seat limit reached. Your plan allows up to ${planTier} members.` 
      }, { status: 403 });
    }
    // --------------------------------------

    // Create invite token (7-day expiry)
    const inviteToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store invite in Firestore
    await db.collection('pending_invites').doc(inviteToken).set({
      teamId: team_id,
      teamName: teamData.name || 'Workspace',
      email: email.toLowerCase(),
      expiresAt: expiresAt.toISOString(),
      invitedBy: uid,
      createdAt: new Date().toISOString(),
      token: inviteToken
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inviteToken}`;

    return NextResponse.json(
      {
        success: true,
        inviteUrl,
        message: 'Invitation generated successfully',
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
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    const teamId = req.nextUrl.searchParams.get('teamId');
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
    }

    // Return pending invites list for a team (filter in memory since Firestore can't query null fields)
    const invitesSnapshot = await db.collection('pending_invites')
      .where('teamId', '==', teamId)
      .get();
      
    const now = new Date().toISOString();
    const invites = invitesSnapshot.docs
      .map(doc => ({ token: doc.id, ...doc.data() }))
      .filter((inv: any) => !inv.usedAt && inv.expiresAt > now);
    
    return NextResponse.json(invites);
  } catch (error) {
    console.error('Fetch invites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}
