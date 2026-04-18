import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { format } = await req.url.searchParams;

    // Get conversation and messages
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', params.conversationId)
      .single();

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', params.conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Format export based on type
    let content: string;
    const filename = `${conversation.title}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      content = JSON.stringify({ conversation, messages }, null, 2);
    } else if (format === 'md') {
      content = `# ${conversation.title}\n\n`;
      messages?.forEach((msg) => {
        content += `## ${msg.role}\n${msg.content}\n\n`;
      });
    } else {
      // PDF would require additional library
      content = JSON.stringify({ conversation, messages }, null, 2);
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': `text/${format === 'json' ? 'plain' : 'markdown'}`,
        'Content-Disposition': `attachment; filename="${filename}.${format}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export conversation' },
      { status: 500 }
    );
  }
}
