import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { agentType: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    const { projectId, prompt } = await req.json();

    // Call Python agent backend
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(`${pythonBackendUrl}/api/agents/${params.agentType}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, prompt })
    });
    
    if(!response.ok) throw new Error("Agent failed");
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
