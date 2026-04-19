import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('[Auth Sync] Missing or invalid authorization header');
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    console.log('[Auth Sync] Verifying token...');
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (tokenError: any) {
      console.error('[Auth Sync] Token verification failed:', tokenError.message);
      return NextResponse.json({ error: 'Invalid token', details: tokenError.message }, { status: 401 });
    }
    
    const { uid, email, name, picture } = decodedToken;
    console.log(`[Auth Sync] Token verified for UID: ${uid}, Email: ${email}`);

    // 1. Check if user exists in Firestore
    console.log(`[Auth Sync] Checking if user ${uid} exists in Firestore...`);
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`[Auth Sync] User ${uid} does not exist. Creating user and default team...`);
      // 2. Create User document
      await userRef.set({
        id: uid,
        email: email || '',
        name: name || email?.split('@')[0] || 'User',
        avatar_url: picture || '',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // 3. Create Default Team for the user
      const teamRef = db.collection('teams').doc();
      await teamRef.set({
        id: teamRef.id,
        name: `${name || email?.split('@')[0] || 'My'} Team`,
        owner_id: uid,
        member_ids: [uid],
        plan_tier: 1, // Default free tier
        subscription_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      console.log(`[Firebase Sync] Successfully created user ${uid} and team ${teamRef.id}`);
    } else {
      console.log(`[Firebase Sync] User ${uid} already exists in Firestore.`);
    }

    return NextResponse.json({ success: true, uid });
  } catch (error: any) {
    console.error('[Auth Sync] Fatal error:', error);
    return NextResponse.json({ error: 'Authentication sync failed', details: error.message }, { status: 500 });
  }
}
