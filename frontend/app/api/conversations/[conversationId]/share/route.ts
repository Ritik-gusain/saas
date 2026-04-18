import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { projectId } = await req.json();

    // Add conversation to project
    const { error } = await supabase.from('project_items').insert([
      {
        project_id: projectId,
        item_type: 'conversation',
        item_id: params.conversationId,
        pinned_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to share conversation' },
      { status: 500 }
    );
  }
}
