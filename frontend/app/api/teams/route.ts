import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch teams where this user is the owner (or is in member_ids)
    // Note: In Firestore, you might need a composite index for this or just fetch by owner_id for now.
    const teamsSnapshot = await db.collection('teams')
      .where('owner_id', '==', uid)
      .get();
      
    const teams = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Also fetch teams where user is a member (if using array-contains)
    const memberTeamsSnapshot = await db.collection('teams')
      .where('member_ids', 'array-contains', uid)
      .get();
      
    // Combine and deduplicate
    const allTeamsMap = new Map();
    teams.forEach(team => allTeamsMap.set(team.id, team));
    memberTeamsSnapshot.docs.forEach(doc => {
      allTeamsMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    return NextResponse.json(Array.from(allTeamsMap.values()));
  } catch (error: any) {
    console.error('Teams GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { name, plan_tier } = await req.json();

    const newTeamRef = db.collection('teams').doc();
    const newTeam = {
      id: newTeamRef.id,
      name,
      plan_tier: plan_tier || 1,
      owner_id: uid,
      member_ids: [uid],
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await newTeamRef.set(newTeam);

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error: any) {
    console.error('Teams POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create team', details: error.message },
      { status: 500 }
    );
  }
}
