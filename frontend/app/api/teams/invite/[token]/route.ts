import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const inviteDoc = await db.collection('pending_invites').doc(token).get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const inviteData = inviteDoc.data();
    
    // Check expiry
    if (new Date(inviteData?.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    if (inviteData?.usedAt) {
      return NextResponse.json({ error: 'Invitation has already been used' }, { status: 400 });
    }

    return NextResponse.json({
      id: inviteDoc.id,
      teamId: inviteData?.teamId,
      teamName: inviteData?.teamName,
      email: inviteData?.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 });
    }

    const bearerToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(bearerToken);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email;
    const { token } = await params;

    // Get invite
    const inviteRef = db.collection('pending_invites').doc(token);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const inviteData = inviteDoc.data();

    // Verify email matches (optional but recommended)
    if (inviteData?.email && inviteData.email.toLowerCase() !== userEmail?.toLowerCase()) {
      return NextResponse.json({ 
        error: `This invitation was sent to ${inviteData.email}, but you are signed in as ${userEmail}.` 
      }, { status: 403 });
    }

    // Check expiry/status
    if (new Date(inviteData?.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }
    if (inviteData?.usedAt) {
      return NextResponse.json({ error: 'Invitation has already been used' }, { status: 400 });
    }

    const teamId = inviteData?.teamId;
    const teamRef = db.collection('teams').doc(teamId);
    const teamDoc = await teamRef.get();
    const teamData = teamDoc.data();

    if (!teamDoc.exists || !teamData) {
      return NextResponse.json({ error: 'Team no longer exists' }, { status: 404 });
    }

    // --- Seat Limit Validation ---
    const planTier = Number(teamData.plan_tier) || 1;
    const currentMemberCount = (teamData.member_ids?.length || 0) + 1;

    if (currentMemberCount >= planTier) {
      return NextResponse.json({ 
        error: `Team seat limit reached (${planTier} members). Please ask the owner to upgrade their plan.` 
      }, { status: 403 });
    }
    // ----------------------------

    // Accept the invitation
    const batch = db.batch();

    // Add user to team member_ids if not already there
    if (teamData.owner_id !== uid && !teamData.member_ids?.includes(uid)) {
      batch.update(teamRef, {
        member_ids: admin.firestore.FieldValue.arrayUnion(uid),
        updated_at: new Date().toISOString()
      });

      // Create team_members record
      const teamMemberRef = db.collection('team_members').doc();
      batch.set(teamMemberRef, {
        id: teamMemberRef.id,
        team_id: teamId,
        user_id: uid,
        email: userEmail,
        role: 'member',
        joined_at: new Date().toISOString()
      });
    }

    // Mark invite as used
    batch.update(inviteRef, {
      usedAt: new Date().toISOString(),
      usedBy: uid
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      teamId: teamId,
      message: 'Successfully joined the team'
    });
  } catch (error: any) {

    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation', details: error.message },
      { status: 500 }
    );
  }
}
