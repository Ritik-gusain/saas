import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Handle Stripe Webhooks for billing
  return NextResponse.json({ received: true });
}
