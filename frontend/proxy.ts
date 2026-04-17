import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Minimal middleware for edge protection
  // Extend this to verify Supabase auth token
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
