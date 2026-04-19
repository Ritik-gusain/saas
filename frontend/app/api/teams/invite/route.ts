import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// TODO: Replace in-memory store with Firebase Firestore
// Temporary in-memory pending invites store
const pendingInvites: Record<string, { teamId: string; email: string; expiresAt: string }> = {};

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token from Authorization header
    // const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // const uid = decodedToken.uid;

    const { email, team_id } = await req.json();

    if (!email || !team_id) {
      return NextResponse.json(
        { error: 'email and team_id are required' },
        { status: 400 }
      );
    }

    // Create invite token (7-day expiry)
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store invite (replace with Firestore write)
    pendingInvites[token] = {
      teamId: team_id,
      email,
      expiresAt: expiresAt.toISOString(),
    };

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
}

export async function GET(req: NextRequest) {
  // Return pending invites list (stub)
  return NextResponse.json(Object.entries(pendingInvites).map(([token, data]) => ({
    token,
    ...data,
  })));
}
