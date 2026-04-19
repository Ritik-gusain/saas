import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    // This would typically return a stream or polling status from Python backend
    return NextResponse.json({ status: 'running' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to stream' }, { status: 500 });
  }
}
