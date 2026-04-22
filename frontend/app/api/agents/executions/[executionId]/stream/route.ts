import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const { executionId } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    const uid = decodedToken.uid;
    const executionDoc = await db.collection('agent_executions').doc(executionId).get();
    
    if (!executionDoc.exists) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }
    
    const executionData = executionDoc.data();
    const team_id = executionData?.team_id;

    // BYOK check globally since the platform is BYOK
    const userPrefsRef = db.collection('user_preferences').doc(uid);
    const userPrefsDoc = await userPrefsRef.get();
    if (!userPrefsDoc.exists) {
       return NextResponse.json({ error: 'User preferences not found. Please configure your API keys.' }, { status: 400 });
    }
    const userPrefs = userPrefsDoc.data();
    const api_keys = userPrefs?.api_keys;
    
    if (!api_keys || Object.values(api_keys).every(key => !key)) {
       return NextResponse.json({ error: 'No API keys configured! You must bring your own API key to use the platform.' }, { status: 402 });
    }

    if (team_id) {
       const teamDoc = await db.collection('teams').doc(team_id).get();
       if (teamDoc.exists) {
          const teamData = teamDoc.data();
          if (teamData?.subscription_status !== 'active') {
             return NextResponse.json({ error: 'Team subscription is not active. Please upgrade to use team collaboration features.' }, { status: 402 });
          }
       } else {
         return NextResponse.json({ error: 'Team not found' }, { status: 404 });
       }
    }

    // This would typically return a stream or polling status from Python backend
    return NextResponse.json({ status: 'running' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to stream' }, { status: 500 });
  }
}
