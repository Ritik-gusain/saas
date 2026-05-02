import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { encrypt, maskKey } from '@/lib/encryption';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userPrefsDoc = await db.collection('user_preferences').doc(uid).get();
    
    if (!userPrefsDoc.exists) {
      return NextResponse.json({ 
        api_keys: { openai: '', anthropic: '', google: '', openrouter: '' },
        default_model: 'gpt-4o'
      });
    }

    const data = userPrefsDoc.data();
    const keys = data?.api_keys || {};
    
    // Mask keys
    const maskedKeys = Object.entries(keys).reduce((acc: any, [provider, value]: [string, any]) => {
      acc[provider] = value ? maskKey(value) : '';
      return acc;
    }, {});

    return NextResponse.json({ 
      api_keys: maskedKeys,
      default_model: data?.default_model || 'gpt-4o',
      personal_system_prompt: data?.personal_system_prompt || ''
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { api_keys, default_model, personal_system_prompt } = await req.json();

    const updateData: any = {};
    if (default_model) updateData.default_model = default_model;
    if (personal_system_prompt !== undefined) updateData.personal_system_prompt = personal_system_prompt;

    if (api_keys) {
      const encryptedKeys: any = {};
      for (const [provider, key] of Object.entries(api_keys)) {
        if (key && typeof key === 'string' && !key.includes('...')) {
          encryptedKeys[provider] = encrypt(key as string);
        }
      }
      if (Object.keys(encryptedKeys).length > 0) {
        updateData.api_keys = encryptedKeys;
      }
    }

    await db.collection('user_preferences').doc(uid).set(updateData, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
