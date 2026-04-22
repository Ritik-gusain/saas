import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;



    // Get conversation
    const convRef = db.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();

    if (!convDoc.exists) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Optional: check if user_id == uid or team_id has uid access

    // Get messages
    const messagesSnapshot = await db.collection('messages')
      .where('conversation_id', '==', conversationId)
      .orderBy('created_at', 'asc')
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({
      conversation: { id: convDoc.id, ...convDoc.data() },
      messages,
    });
  } catch (error: any) {
    console.error('Conversation GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const updates = await req.json();

    const convRef = db.collection('conversations').doc(conversationId);
    await convRef.update({
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const updatedDoc = await convRef.get();

    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error: any) {
    console.error('Conversation PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Delete messages first
    const messagesSnapshot = await db.collection('messages')
      .where('conversation_id', '==', conversationId)
      .get();
      
    // Create a batch
    const batch = db.batch();
    messagesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete conversation
    const convRef = db.collection('conversations').doc(conversationId);
    batch.delete(convRef);

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation', details: error.message },
      { status: 500 }
    );
  }
}
