import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { email } = await req.json();
    const { teamId } = await params;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify requester is owner or admin
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    
    const teamData = teamDoc.data();
    if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    if (teamData.owner_id !== uid && !teamData.member_ids?.includes(uid)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // --- Subscription & Seat Validation ---
    const planTier = Number(teamData.plan_tier) || 1;
    
    // Only paid plans (Starter=3, Growth=7, Pro=12) can invite members
    if (planTier <= 1) {
      return NextResponse.json({ 
        error: 'Team invitations are only available on paid plans. Please upgrade your plan to invite collaborators.' 
      }, { status: 403 });
    }

    // Count current members
    const currentMemberCount = (teamData.member_ids?.length || 0) + 1; // +1 for the owner if not in member_ids

    // Count active pending invites (not used and not expired)
    const now = new Date().toISOString();
    const activeInvitesSnapshot = await db.collection('pending_invites')
      .where('teamId', '==', teamId)
      .get();
    
    const pendingInvitesCount = activeInvitesSnapshot.docs.filter(doc => {
      const data = doc.data();
      return !data.usedAt && data.expiresAt > now;
    }).length;

    if (currentMemberCount + pendingInvitesCount >= planTier) {
      return NextResponse.json({ 
        error: `Seat limit reached. Your ${teamData.plan_name || 'current'} plan allows up to ${planTier} members. Please upgrade for more seats.` 
      }, { status: 403 });
    }
    // --------------------------------------

    // Create invite
    const inviteToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const inviteData = {
      teamId: teamId,
      teamName: teamData.name || 'Workspace',
      email: email.toLowerCase(),
      invitedBy: uid,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      token: inviteToken
    };

    await db.collection('pending_invites').doc(inviteToken).set(inviteData);

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inviteToken}`;

    return NextResponse.json({ 
      success: true, 
      inviteUrl,
      message: 'Invitation generated successfully'
    });
  } catch (error: any) {
    console.error('Invite POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);
    
    const { teamId } = await params;

    // Return pending invites list for a team
    const invitesSnapshot = await db.collection('pending_invites')
      .where('teamId', '==', teamId)
      .get();
      
    const invites = invitesSnapshot.docs
      .map(doc => ({
        token: doc.id,
        ...doc.data()
      }))
      // Filter out used/expired in memory if needed, or better in query
      .filter((inv: any) => !inv.usedAt && new Date(inv.expiresAt) > new Date());
    
    return NextResponse.json(invites);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

