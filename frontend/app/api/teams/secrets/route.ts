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

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });

    // Verify user is team owner or admin (only owners/admins should see/edit secrets)
    const membership = await db.collection('team_members')
      .where('teamId', '==', teamId)
      .where('userId', '==', uid)
      .get();

    if (membership.empty) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
    const memberData = membership.docs[0].data();
    if (memberData.role !== 'owner' && memberData.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const secretsDoc = await db.collection('teams').doc(teamId).collection('config').doc('secrets').get();
    
    if (!secretsDoc.exists) {
      return NextResponse.json({});
    }

    // Return masked keys for safety
    const data = secretsDoc.data() || {};
    const maskedData: any = {};
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (typeof val === 'string' && val.length > 8) {
        maskedData[key] = val.substring(0, 4) + '...' + val.substring(val.length - 4);
      } else {
        maskedData[key] = '********';
      }
    });

    return NextResponse.json(maskedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const { teamId, keys } = await req.json();

    if (!teamId || !keys) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Verify ownership
    const membership = await db.collection('team_members')
      .where('teamId', '==', teamId)
      .where('userId', '==', uid)
      .where('role', '==', 'owner')
      .get();

    if (membership.empty) return NextResponse.json({ error: 'Only team owners can update secrets' }, { status: 403 });

    // Save secrets (filtering out masked values that weren't changed)
    const existingSecretsDoc = await db.collection('teams').doc(teamId).collection('config').doc('secrets').get();
    const existingData = existingSecretsDoc.data() || {};
    
    const dataToSave = { ...existingData };
    Object.keys(keys).forEach(key => {
      const val = keys[key];
      // Only update if it's not a masked string or empty
      if (val && !val.includes('...')) {
        dataToSave[key] = val;
      }
    });

    await db.collection('teams').doc(teamId).collection('config').doc('secrets').set(dataToSave, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
