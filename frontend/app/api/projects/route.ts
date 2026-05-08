import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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

    // Verify membership
    const membership = await db.collection('team_members')
      .where('teamId', '==', teamId)
      .where('userId', '==', uid)
      .get();

    if (membership.empty) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const projectsSnapshot = await db.collection('projects')
      .where('teamId', '==', teamId)
      .orderBy('createdAt', 'desc')
      .get();

    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects);
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

    const { teamId, name, description, color } = await req.json();

    // Verify membership
    const membership = await db.collection('team_members')
      .where('teamId', '==', teamId)
      .where('userId', '==', uid)
      .get();

    if (membership.empty) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const projectData = {
      name,
      description,
      teamId,
      color: color || '#00f2ff',
      createdAt: FieldValue.serverTimestamp(),
      conversationCount: 0,
      createdBy: uid,
    };

    const docRef = await db.collection('projects').add(projectData);
    
    return NextResponse.json({ id: docRef.id, ...projectData, createdAt: new Date() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

    // In a real app, verify ownership/permissions here
    await db.collection('projects').doc(projectId).delete();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
