import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: execution, error } = await supabase
      .from('agent_executions')
      .select('*')
      .eq('id', params.executionId)
      .single();

    if (error || !execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(execution);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Start execution
    const { data: execution, error } = await supabase
      .from('agent_executions')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', params.executionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // TODO: Call Python backend to start execution
    // For now, simulate completion
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data: completed } = await supabase
      .from('agent_executions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result: 'Execution completed successfully',
        token_used: 500,
      })
      .eq('id', params.executionId)
      .select()
      .single();

    return NextResponse.json(completed);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start execution' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase
      .from('agent_executions')
      .delete()
      .eq('id', params.executionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete execution' },
      { status: 500 }
    );
  }
}
