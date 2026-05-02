import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: string } }
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

    // Verify requester is owner or admin
    // For now checking owner_id on team
    const teamDoc = await db.collection('teams').doc(params.teamId).get();
    if (!teamDoc.exists) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    if (teamDoc.data()?.owner_id !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Create invite
    const inviteId = uuidv4();
    const inviteData = {
      id: inviteId,
      team_id: params.teamId,
      team_name: teamDoc.data()?.name,
      email,
      invited_by: uid,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    await db.collection('invites').doc(inviteId).set(inviteData);

    // In a real app, send email here.
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteId}`;

    return NextResponse.json({ success: true, inviteUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
