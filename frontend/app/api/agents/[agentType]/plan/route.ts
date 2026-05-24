import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentType: string }> }
) {
  try {
    const { agentType } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);

    const { goal, projectId, apiKeys, model } = await req.json();

    if (!goal) return NextResponse.json({ error: 'goal is required' }, { status: 400 });

    // Call Python agent backend — backend expects 'goal', not 'prompt'
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(`${pythonBackendUrl}/api/agents/${agentType}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          projectId,
          apiKeys: apiKeys || {},
          model: model || 'openrouter/google/gemini-2.0-flash-001',
        })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Agent plan generation failed');
    }
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
