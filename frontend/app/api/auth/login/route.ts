import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth is handled client-side via Firebase SDK.
 * This route is kept as a stub for compatibility.
 * Firebase sign-in happens in: app/(auth)/login/page.tsx
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Auth is handled client-side via Firebase.' },
    { status: 200 }
  );
}
