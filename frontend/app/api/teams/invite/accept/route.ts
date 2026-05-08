import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(
  req: NextRequest
) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }
  try {
    const inviteDoc = await db.collection('pending_invites').doc(token).get();
    const invite = inviteDoc.data();

    if (!inviteDoc.exists || !invite) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if used
    if (invite.usedAt) {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 410 }
      );
    }

    // Check if expired
    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({ 
      teamId: invite.teamId, 
      teamName: invite.teamName,
      email: invite.email 
    });
  } catch (error) {
    console.error('Validate invite error:', error);
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const { token: inviteToken } = await req.json();
    if (!inviteToken) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bearerToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(bearerToken);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email;

    // Start Transaction for atomic updates
    const result = await db.runTransaction(async (transaction) => {
      const inviteRef = db.collection('pending_invites').doc(inviteToken);
      const inviteDoc = await transaction.get(inviteRef);
      const invite = inviteDoc.data();

      if (!inviteDoc.exists || !invite) {
        throw new Error('Invalid invitation');
      }

      if (invite.usedAt) {
        throw new Error('Invitation already used');
      }

      if (new Date(invite.expiresAt) < new Date()) {
        throw new Error('Invitation expired');
      }

      // Optional: Verify email matches if provided in invite
      // if (invite.email && invite.email.toLowerCase() !== userEmail?.toLowerCase()) {
      //   throw new Error('This invitation was sent to a different email address');
      // }

      const teamRef = db.collection('teams').doc(invite.teamId);
      const teamDoc = await transaction.get(teamRef);
      const teamData = teamDoc.data();

      if (!teamDoc.exists || !teamData) {
        throw new Error('Team no longer exists');
      }

      // Check seat limit
      const planTier = Number(teamData.plan_tier) || 1;
      const currentMemberCount = (teamData.member_ids?.length || 0) + 1;

      if (currentMemberCount >= planTier) {
        throw new Error(`Team seat limit (${planTier}) reached. Cannot join.`);
      }

      // Check if already a member
      if (teamData.owner_id === uid || teamData.member_ids?.includes(uid)) {
        return { success: true, alreadyMember: true, teamId: invite.teamId };
      }

      // Update Team member_ids
      transaction.update(teamRef, {
        member_ids: FieldValue.arrayUnion(uid)
      });

      // Create Team Member record
      const memberRef = db.collection('team_members').doc();
      transaction.set(memberRef, {
        teamId: invite.teamId,
        userId: uid,
        email: userEmail,
        role: 'member',
        joinedAt: new Date().toISOString()
      });

      // Mark invite as used
      transaction.update(inviteRef, {
        usedAt: new Date().toISOString(),
        acceptedBy: uid
      });

      return { success: true, teamId: invite.teamId };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept invitation' },
      { status: 400 }
    );
  }
}
