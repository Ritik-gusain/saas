import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase Admin Error: Missing required environment variables.', {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey
    });
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // Handle newline characters and potential quotes in the private key
          privateKey: privateKey.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error: any) {
      console.error('Firebase Admin Initialization Error:', error.message);
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth;
export const db = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;

