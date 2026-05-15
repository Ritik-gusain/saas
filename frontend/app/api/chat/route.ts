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

    const body = await req.json();
    const { conversationId, message, model: customModel, agentId, webSearch } = body;

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }

    // 1. Get conversation context
    const convDoc = await db.collection('conversations').doc(conversationId).get();
    if (!convDoc.exists) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    
    const convData = convDoc.data();
    const team_id = convData?.team_id || '';

    let api_keys_to_use: any = {};
    let default_model = customModel || 'openrouter/google/gemini-2.0-flash-001';
    let system_prompt = 'You are a helpful AI assistant on Luminescent.io.';

    // 2. Fetch keys and settings
    if (team_id) {
      const teamDoc = await db.collection('teams').doc(team_id).get();
      const teamData = teamDoc.data();
      
      const keysDoc = await db.collection('teams').doc(team_id).collection('secrets').doc('api_keys').get();
      if (keysDoc.exists) {
        const encryptedKeys = keysDoc.data() || {};
        for (const [provider, val] of Object.entries(encryptedKeys)) {
          if (typeof val === 'string' && val.includes(':')) {
            api_keys_to_use[provider] = decrypt(val);
          }
        }
      }
      default_model = customModel || teamData?.default_model || default_model;
      system_prompt = teamData?.system_prompt || system_prompt;
    } else {
      const userPrefsDoc = await db.collection('user_preferences').doc(uid).get();
      if (userPrefsDoc.exists) {
        const userPrefs = userPrefsDoc.data();
        api_keys_to_use = userPrefs?.api_keys || {};
        default_model = customModel || userPrefs?.default_model || default_model;
        system_prompt = userPrefs?.personal_system_prompt || system_prompt;
      }
    }

    // 3. Save User Message
    const userMsgRef = db.collection('messages').doc();
    await userMsgRef.set({
      id: userMsgRef.id,
      conversation_id: conversationId,
      user_id: uid,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    });

    // 4. Fetch History
    const historySnapshot = await db.collection('messages')
      .where('conversation_id', '==', conversationId)
      .orderBy('created_at', 'asc')
      .limit(20) // Context limit
      .get();
      
    const messages = historySnapshot.docs.map(doc => ({
      role: doc.data().role,
      content: doc.data().content
    }));

    // 5. Call FastAPI
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(`${pythonBackendUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        systemPrompt: system_prompt,
        model: default_model,
        apiKeys: api_keys_to_use,
        agentId: agentId || 'general',
        webSearch: webSearch || false,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'AI Backend Error' }, { status: response.status });
    }

    // 6. Streaming Setup with Interceptor to save result
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullContent = '';
    const aiMsgId = db.collection('messages').doc().id;

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return controller.close();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.error) {
                    const errMsg = `\n\n**Error:** ${data.error}`;
                    fullContent += errMsg;
                    controller.enqueue(encoder.encode(errMsg));
                  } else if (data.content) {
                    fullContent += data.content;
                    controller.enqueue(encoder.encode(data.content));
                  }
                } catch (e) {}
              }
            }
          }

          // 7. Save AI message to Firestore using the pre-generated ID
          await db.collection('messages').doc(aiMsgId).set({
            id: aiMsgId,
            conversation_id: conversationId,
            role: 'assistant',
            content: fullContent,
            model: default_model,
            created_at: new Date().toISOString(),
          });

          await db.collection('conversations').doc(conversationId).update({
            updated_at: new Date().toISOString(),
          });

        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Message-Id': aiMsgId
      }
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

