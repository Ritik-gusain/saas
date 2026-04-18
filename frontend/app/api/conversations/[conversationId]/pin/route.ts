import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Pin conversation
    const { error } = await supabase
      .from('conversations')
      .update({ is_pinned: true, updated_at: new Date().toISOString() })
      .eq('id', params.conversationId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to pin conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Unpin conversation
    const { error } = await supabase
      .from('conversations')
      .update({ is_pinned: false, updated_at: new Date().toISOString() })
      .eq('id', params.conversationId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unpin conversation' },
      { status: 500 }
    );
  }
}
