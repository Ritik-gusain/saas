import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { decrypt } from '@/lib/encryption';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const { executionId } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    // Proxy SSE stream from Python backend
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(
      `${pythonBackendUrl}/api/agents/executions/${executionId}/stream`,
      { headers: { Accept: 'text/event-stream' } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to connect to execution stream' }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('Stream proxy error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
