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

    // Verify user is member of the team
    const teamDoc = await db.collection('teams').doc(params.teamId).get();
    if (!teamDoc.exists) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    
    const teamData = teamDoc.data();
    if (teamData?.owner_id !== uid && !teamData?.member_ids?.includes(uid)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch members
    // Option A: If we use a separate collection
    const membersSnapshot = await db.collection('team_members')
      .where('team_id', '==', params.teamId)
      .get();

    const members = await Promise.all(membersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      // Fetch user profile info (email, name) from adminAuth
      try {
        const user = await adminAuth.getUser(data.user_id);
        return {
          id: doc.id,
          ...data,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      } catch {
        return { id: doc.id, ...data, email: 'Unknown User' };
      }
    }));

    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
