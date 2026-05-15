import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { decrypt } from '@/lib/encryption';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const { executionId } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const body = await req.json();
    const { model } = body;

    // Fetch user's API keys from Firestore
    let api_keys: Record<string, string> = {};
    const userPrefsDoc = await db.collection('user_preferences').doc(uid).get();
    if (userPrefsDoc.exists) {
      const prefs = userPrefsDoc.data();
      const rawKeys = prefs?.api_keys || {};
      for (const [provider, val] of Object.entries(rawKeys)) {
        if (typeof val === 'string' && val.includes(':')) {
          api_keys[provider] = decrypt(val);
        } else if (typeof val === 'string') {
          api_keys[provider] = val;
        }
      }
    }

    // Forward to Python backend
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(
      `${pythonBackendUrl}/api/agents/executions/${executionId}/approve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKeys: api_keys,
          model: model || 'openrouter/google/gemini-2.0-flash-001',
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Backend error' }));
      return NextResponse.json({ error: err.detail || 'Failed to approve execution' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Approve execution error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
