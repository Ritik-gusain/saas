import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    const uid = decodedToken.uid;

    const { executionId } = params;
    const executionDoc = await db.collection('agent_executions').doc(executionId).get();
    
    if (!executionDoc.exists) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }
    
    const executionData = executionDoc.data();
    const team_id = executionData?.team_id;

    if (team_id) {
       const teamDoc = await db.collection('teams').doc(team_id).get();
       if (teamDoc.exists) {
          const teamData = teamDoc.data();
          if (teamData?.subscription_status !== 'active') {
             return NextResponse.json({ error: 'Team subscription is not active. Please upgrade or use your personal account with your own API key.' }, { status: 402 });
          }
       } else {
         return NextResponse.json({ error: 'Team not found' }, { status: 404 });
       }
    } else {
      // Individual User - BRING YOUR OWN KEY (BYOK)
      const userPrefsRef = db.collection('user_preferences').doc(uid);
      const userPrefsDoc = await userPrefsRef.get();
      if (!userPrefsDoc.exists) {
         return NextResponse.json({ error: 'User preferences not found. Please configure your API keys.' }, { status: 400 });
      }
      const userPrefs = userPrefsDoc.data();
      const api_keys = userPrefs?.api_keys;
      
      if (!api_keys || Object.values(api_keys).every(key => !key)) {
         return NextResponse.json({ error: 'No API keys configured. Please add your own API key in Settings.' }, { status: 402 });
      }
      
      // In a real implementation: you would pass these API keys to the backend processing the stream
      // e.g. pythonBackendUrl/api/agents/stream?api_keys=...
    }

    // This would typically return a stream or polling status from Python backend
    return NextResponse.json({ status: 'running' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to stream' }, { status: 500 });
  }
}
