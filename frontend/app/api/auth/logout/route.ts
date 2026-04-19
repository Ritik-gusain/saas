import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth is handled client-side via Firebase SDK.
 * This route is kept as a stub for compatibility.
 * Firebase sign-out happens in: components/layout/ or dashboard via auth.signOut()
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Auth sign-out is handled client-side via Firebase.' },
    { status: 200 }
  );
}
