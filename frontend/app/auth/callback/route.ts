import { NextRequest, NextResponse } from 'next/server';

/**
 * Firebase auth callback stub.
 * Firebase handles OAuth redirects client-side automatically.
 * This route simply redirects to dashboard.
 */
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
