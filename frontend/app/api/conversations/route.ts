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

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Optional: Verify user has access to teamId
    
    // Query conversations by team ID
    const convSnapshot = await db.collection('conversations')
      .where('team_id', '==', teamId)
      .orderBy('updated_at', 'desc')
      .get();

    const conversations = convSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('Conversations GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations', details: error.message },
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

    const { team_id, title } = await req.json();

    if (!team_id) {
        return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const newConvRef = db.collection('conversations').doc();
    const newConv = {
      id: newConvRef.id,
      team_id,
      user_id: uid,
      title: title || 'New Conversation',
      is_shared: false,
      is_pinned: false,
      is_archived: false,
      token_count: 0,
      model_used: 'gpt-4',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await newConvRef.set(newConv);

    return NextResponse.json(newConv, { status: 201 });
  } catch (error: any) {
    console.error('Conversations POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation', details: error.message },
      { status: 500 }
    );
  }
}
