import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    const { projectId } = await req.json();

    await db.collection('project_items').doc().set({
      project_id: projectId,
      item_type: 'conversation',
      item_id: params.conversationId,
      pinned_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to share' }, { status: 500 });
  }
}
