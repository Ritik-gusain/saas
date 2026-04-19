import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const convDoc = await db.collection('conversations').doc(params.conversationId).get();
    if (!convDoc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const conversation = convDoc.data()!;

    const msgSnap = await db.collection('messages').where('conversation_id', '==', params.conversationId).get();
    const messages = msgSnap.docs.map(d => d.data());

    let content: string;
    const filename = `${conversation.title}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      content = JSON.stringify({ conversation, messages }, null, 2);
    } else {
      content = `# ${conversation.title}\n\n`;
      messages?.forEach((msg: any) => {
        content += `## ${msg.role}\n${msg.content}\n\n`;
      });
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': `text/${format === 'json' ? 'plain' : 'markdown'}`,
        'Content-Disposition': `attachment; filename="${filename}.${format}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
