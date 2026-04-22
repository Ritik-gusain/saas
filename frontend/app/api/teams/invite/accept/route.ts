import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with Firestore-backed invite store
// Temporary in-memory invite store — shared with /api/teams/invite/route.ts
// In production, read from Firestore collection 'pending_invites'
const pendingInvites: Record<string, { teamId: string; email: string; expiresAt: string; usedAt?: string }> = {};

export async function GET(
  req: NextRequest
) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }
  try {
    const invite = pendingInvites[token];

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({ teamId: invite.teamId, email: invite.email });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }
  try {
    // TODO: Verify Firebase ID token from Authorization header
    // const authHeader = req.headers.get('Authorization');
    // const decodedToken = await adminAuth.verifyIdToken(token);

    const invite = pendingInvites[token];

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invitation' },
        { status: 404 }
      );
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { error: 'Invitation already used' },
        { status: 410 }
      );
    }

    // Mark invite as used
    pendingInvites[token].usedAt = new Date().toISOString();

    // TODO: Add user to team in Firestore
    // await db.collection('team_members').add({ teamId: invite.teamId, userId, role: 'member' });

    return NextResponse.json({ success: true, teamId: invite.teamId });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
