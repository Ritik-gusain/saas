import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const inviteDoc = await db.collection('invites').doc(params.token).get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const inviteData = inviteDoc.data();
    
    // Check expiry
    if (new Date(inviteData?.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    if (inviteData?.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation has already been used' }, { status: 400 });
    }

    return NextResponse.json({
      id: inviteDoc.id,
      teamId: inviteData?.team_id,
      teamName: inviteData?.team_name,
      email: inviteData?.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
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

    // Get invite
    const inviteRef = db.collection('invites').doc(params.token);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const inviteData = inviteDoc.data();

    // Verify email matches (optional but recommended)
    if (inviteData?.email && inviteData.email !== userEmail) {
      return NextResponse.json({ 
        error: `This invitation was sent to ${inviteData.email}, but you are signed in as ${userEmail}.` 
      }, { status: 403 });
    }

    // Check expiry/status
    if (new Date(inviteData?.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }
    if (inviteData?.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation has already been used' }, { status: 400 });
    }

    const teamId = inviteData?.team_id;

    // 1. Add user to team_members
    const memberRef = db.collection('team_members').doc();
    await memberRef.set({
      id: memberRef.id,
      team_id: teamId,
      user_id: uid,
      role: 'member',
      joined_at: new Date().toISOString(),
    });

    // 2. Add user to team's member_ids array
    await db.collection('teams').doc(teamId).update({
      member_ids: adminAuth ? (await (await db.collection('teams').doc(teamId).get()).get('member_ids') || []).concat(uid) : []
    });
    
    // Better way for atomic update in Firestore
    const teamRef = db.collection('teams').doc(teamId);
    // Use dynamic import or direct reference if possible. 
    // In firebase-admin we use FieldValue.
    const adminRef = require('firebase-admin');
    await teamRef.update({
      member_ids: adminRef.firestore.FieldValue.arrayUnion(uid)
    });

    // 3. Mark invite as accepted
    await inviteRef.update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_by: uid,
    });

    return NextResponse.json({ success: true, teamId });
  } catch (error: any) {
    console.error('Accept invite error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
