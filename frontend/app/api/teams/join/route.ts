import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

/**
 * POST /api/teams/join
 * Body: { join_code: string }
 *
 * Allows any authenticated user to join a team using a short alphanumeric code.
 * The join code is stored on the team document as `join_code`.
 *
 * If the user is already a member of the team, returns success (idempotent).
 * If the user is a brand-new individual user with only their personal workspace,
 * they are added to the team workspace in addition to their own.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bearerToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(bearerToken);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email || '';

    const body = await req.json();
    const join_code: string = (body.join_code || '').trim().toUpperCase();

    if (!join_code || join_code.length < 6) {
      return NextResponse.json({ error: 'A valid 6-character join code is required.' }, { status: 400 });
    }

    // Find team with matching join_code
    const teamsSnapshot = await db.collection('teams')
      .where('join_code', '==', join_code)
      .limit(1)
      .get();

    if (teamsSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid join code. No team found.' }, { status: 404 });
    }

    const teamDoc = teamsSnapshot.docs[0];
    const teamId = teamDoc.id;
    const teamData = teamDoc.data();

    // Check if code is expired
    if (teamData.join_code_expires_at && new Date(teamData.join_code_expires_at) < new Date()) {
      return NextResponse.json({ error: 'This join code has expired. Ask the team owner for a new one.' }, { status: 410 });
    }

    // Check plan tier allows more members (free tier = solo only)
    const planTier = Number(teamData.plan_tier) || 1;
    if (planTier <= 1) {
      return NextResponse.json({
        error: 'This team is on the free plan and cannot have additional members. Ask the owner to upgrade.'
      }, { status: 403 });
    }

    // Check if already a member — idempotent success
    if (teamData.owner_id === uid || teamData.member_ids?.includes(uid)) {
      return NextResponse.json({
        success: true,
        already_member: true,
        teamId,
        teamName: teamData.name,
        message: 'You are already a member of this team.'
      });
    }

    // Check seat limit
    const currentMemberCount = (teamData.member_ids?.length || 0) + 1; // +1 for owner
    if (currentMemberCount >= planTier) {
      return NextResponse.json({
        error: `Team seat limit reached (${planTier} seats). Ask the owner to upgrade the plan.`
      }, { status: 403 });
    }

    // Atomic join: add to member_ids + create team_members record
    const batch = db.batch();
    const teamRef = db.collection('teams').doc(teamId);

    batch.update(teamRef, {
      member_ids: admin.firestore.FieldValue.arrayUnion(uid),
      updated_at: new Date().toISOString(),
    });

    const memberRef = db.collection('team_members').doc();
    batch.set(memberRef, {
      id: memberRef.id,
      team_id: teamId,
      user_id: uid,
      email: userEmail,
      role: 'member',
      join_method: 'code',
      joined_at: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      teamId,
      teamName: teamData.name,
      message: `Successfully joined ${teamData.name}!`,
    });
  } catch (error: any) {
    console.error('Join by code error:', error);
    return NextResponse.json(
      { error: 'Failed to join team', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/teams/join
 * Body: { teamId: string }
 *
 * Allows a team OWNER to generate (or regenerate) a 6-character alphanumeric join code.
 * Codes expire in 30 days by default.
 */
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bearerToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(bearerToken);
    const uid = decodedToken.uid;

    const { teamId } = await req.json();
    if (!teamId) return NextResponse.json({ error: 'teamId is required' }, { status: 400 });

    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    const teamData = teamDoc.data();
    // Only the owner can generate/regenerate join codes
    if (teamData?.owner_id !== uid) {
      return NextResponse.json({ error: 'Only the team owner can generate join codes.' }, { status: 403 });
    }

    const planTier = Number(teamData?.plan_tier) || 1;
    if (planTier <= 1) {
      return NextResponse.json({
        error: 'Join codes are only available on paid plans. Please upgrade your plan.'
      }, { status: 403 });
    }

    // Generate a unique 6-char alphanumeric code (uppercase)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0,O,1,I)
    let join_code = '';
    for (let i = 0; i < 6; i++) {
      join_code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.collection('teams').doc(teamId).update({
      join_code,
      join_code_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      join_code,
      join_code_expires_at: expiresAt.toISOString(),
      message: 'Join code generated successfully. Share it with your teammates!',
    });
  } catch (error: any) {
    console.error('Generate join code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate join code', details: error.message },
      { status: 500 }
    );
  }
}
