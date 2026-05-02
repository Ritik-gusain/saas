import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { decrypt } from '@/lib/encryption';

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
    const customModel = formData.get('model') as string;

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }

    // 1. Get conversation context to find team
    const convDoc = await db.collection('conversations').doc(conversationId).get();
    if (!convDoc.exists) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    
    const convData = convDoc.data();
    const team_id = convData?.team_id || '';
    const token_count = convData?.token_count || 0;

    let api_keys_to_use: any = {};
    let default_model = customModel || 'gpt-4';
    let system_prompt = '';

    // 2. Fetch keys based on context (Team vs Individual)
    if (team_id) {
      // Check team membership
      const teamDoc = await db.collection('teams').doc(team_id).get();
      if (!teamDoc.exists) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      
      const teamData = teamDoc.data();
      if (!teamData?.member_ids?.includes(uid)) {
        return NextResponse.json({ error: 'You are not a member of this team' }, { status: 403 });
      }

      // Fetch team keys
      const keysDoc = await db.collection('teams').doc(team_id).collection('secrets').doc('api_keys').get();
      if (keysDoc.exists) {
        const encryptedKeys = keysDoc.data() || {};
        // Decrypt keys
        for (const [provider, encryptedValue] of Object.entries(encryptedKeys)) {
          if (typeof encryptedValue === 'string' && encryptedValue.includes(':')) {
            try {
              api_keys_to_use[provider] = decrypt(encryptedValue);
            } catch (e) {
              console.error(`Failed to decrypt ${provider} key for team ${team_id}`);
            }
          }
        }
      }
      
      default_model = customModel || teamData?.default_model || default_model;
      system_prompt = teamData?.system_prompt || '';
    } else {
      // Individual context
      const userPrefsRef = db.collection('user_preferences').doc(uid);
      const userPrefsDoc = await userPrefsRef.get();
      if (userPrefsDoc.exists) {
        const userPrefs = userPrefsDoc.data();
        api_keys_to_use = userPrefs?.api_keys || {};
        default_model = customModel || userPrefs?.default_model || default_model;
        system_prompt = userPrefs?.personal_system_prompt || '';
      }
    }
    
    if (Object.values(api_keys_to_use).every(key => !key)) {
       return NextResponse.json({ error: 'No API keys configured! This is a BYOK platform. Please add your keys in settings.' }, { status: 402 });
    }

    const timestamp = new Date().toISOString();
    // 3. Save user message
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
