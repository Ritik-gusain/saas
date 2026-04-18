import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, message, attachments } = await req.json();

    // Save user message
    const { data: userMsg, error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          user_id: user.id,
          role: 'user',
          content: message,
          attachments: attachments || [],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 400 });
    }

    // Get conversation context
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    // Get team system prompt
    const { data: team } = await supabase
      .from('teams')
      .select('system_prompt, default_model')
      .eq('id', conversation.team_id)
      .single();

    // Get conversation history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Call FastAPI backend for AI response
    const pythonBackendUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    
    const aiResponse = await fetch(`${pythonBackendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages || [],
        systemPrompt: team?.system_prompt || '',
        model: team?.default_model || 'gpt-4',
      }),
    });

    const mockResponse = 'This is a placeholder response from the AI assistant.';
    const tokenCount = 100; // Placeholder

    // Save AI response
    const { data: aiMsg } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: mockResponse,
          token_count: tokenCount,
          model: team?.default_model || 'gpt-4',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    // Update conversation token count
    await supabase
      .from('conversations')
      .update({
        token_count: (conversation?.token_count || 0) + tokenCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return NextResponse.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      tokenCount: tokenCount,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
