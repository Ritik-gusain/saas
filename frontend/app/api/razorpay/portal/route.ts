import { NextRequest, NextResponse } from 'next/server';

// TODO: Add Firebase Admin SDK for ID token verification
// import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
    }

    // Generate Razorpay customer portal URL
    const portalUrl = `https://customer.razorpay.com/${customerId}`;

    return NextResponse.json({ portalUrl });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portal URL' },
      { status: 500 }
    );
  }
}
