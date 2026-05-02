import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
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

    const teamDoc = await db.collection('teams').doc(params.teamId).get();

    if (!teamDoc.exists) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const teamData = teamDoc.data();

    // Verify user is a member
    if (teamData?.owner_id !== uid && !teamData?.member_ids?.includes(uid)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ id: teamDoc.id, ...teamData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
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

    const body = await req.json();
    const teamRef = db.collection('teams').doc(params.teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const teamData = teamDoc.data();

    // Only owner or admin can update settings
    // For now, let's just check owner_id for simplicity or if they are in a members list with admin role
    // We'll need a separate members collection or subcollection to check roles properly
    if (teamData?.owner_id !== uid) {
      return NextResponse.json({ error: 'Only the owner can update team settings' }, { status: 403 });
    }

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Prevent overwriting sensitive fields if any
    delete updates.id;
    delete updates.owner_id;
    delete updates.created_at;

    await teamRef.update(updates);

    return NextResponse.json({ id: params.teamId, ...teamData, ...updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
