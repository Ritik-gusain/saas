import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const formData = await req.formData();
    const conversationId = formData.get('conversationId') as string;
    const message = formData.get('message') as string;
    // Handle attachments if they exist (skipping for brevity in MVP)

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // 1. Save user message
    const userMsgRef = db.collection('messages').doc();
    const userMsg = {
      id: userMsgRef.id,
      conversation_id: conversationId,
      user_id: uid,
      role: 'user',
      content: message,
      created_at: timestamp,
    };
    await userMsgRef.set(userMsg);

    // 2. Get conversation context to find team
    const convDoc = await db.collection('conversations').doc(conversationId).get();
    let team_id = '';
    let token_count = 0;
    if (convDoc.exists) {
      const convData = convDoc.data();
      team_id = convData?.team_id || '';
      token_count = convData?.token_count || 0;
    }

    let default_model = 'gpt-4';
    let system_prompt = '';
    let api_keys_to_use = {};
    
    // 3. Get team options if it exists
    if (team_id) {
       const teamDoc = await db.collection('teams').doc(team_id).get();
       if (teamDoc.exists) {
          const teamData = teamDoc.data();
          if (teamData?.subscription_status !== 'active') {
             return NextResponse.json({ error: 'Team subscription is not active. Please upgrade or use your personal account with your own API key.' }, { status: 402 });
          }
          default_model = teamData?.default_model || 'gpt-4';
          system_prompt = teamData?.system_prompt || '';
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
      
      api_keys_to_use = api_keys;
      default_model = userPrefs?.default_model || 'gpt-4';
      system_prompt = userPrefs?.personal_system_prompt || '';
    }

    // 4. Retrieve historic messages
    const messagesSnapshot = await db.collection('messages')
      .where('conversation_id', '==', conversationId)
      .orderBy('created_at', 'asc')
      .get();
      
    const messageHistory = messagesSnapshot.docs.map(doc => doc.data());

    // 5. Call Python Backend or Fallback
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    let mockResponse = 'This is a placeholder response from the AI assistant.';
    
    try {
      // In advanced implementation, we would stream this back.
      const aiResponse = await fetch(`${pythonBackendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory,
          systemPrompt: system_prompt,
          model: default_model,
          apiKeys: api_keys_to_use, // Pass BYOK to backend
        }),
      });
      if (aiResponse.ok) {
         // Assuming Python backend returns a JSON or streaming response
         // For now, we stub it as we did before.
      }
    } catch(e) {
      console.warn("Python backend unreachable, using mock.");
    }

    const aiTokenCount = 100; // Placeholder

    // 6. Save AI message
    const aiMsgRef = db.collection('messages').doc();
    const aiMsg = {
      id: aiMsgRef.id,
      conversation_id: conversationId,
      role: 'assistant',
      content: mockResponse,
      token_count: aiTokenCount,
      model: default_model,
      created_at: new Date().toISOString(),
    };
    await aiMsgRef.set(aiMsg);

    // 7. Update conversation token count
    await db.collection('conversations').doc(conversationId).update({
      token_count: token_count + aiTokenCount,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      messageId: aiMsgRef.id,
      userMessage: userMsg,
      aiMessage: aiMsg,
      tokenCount: aiTokenCount,
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}
