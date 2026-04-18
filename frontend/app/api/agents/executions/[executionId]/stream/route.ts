import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Return execution logs as a stream of events
    const response = new ReadableStream({
      async start(controller) {
        const { data: execution } = await supabase
          .from('agent_executions')
          .select('*')
          .eq('id', params.executionId)
          .single();

        if (!execution) {
          controller.close();
          return;
        }

        // Stream execution log entries
        execution.execution_log?.forEach((log: any) => {
          controller.enqueue(JSON.stringify(log) + '\n');
        });

        controller.close();
      },
    });

    return new NextResponse(response, {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stream execution' },
      { status: 500 }
    );
  }
}
