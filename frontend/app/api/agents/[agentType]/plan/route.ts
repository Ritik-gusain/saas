import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: { agentType: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, goal } = await req.json();

    // Create execution record with status "pending" for plan approval
    const { data: execution, error } = await supabase
      .from('agent_executions')
      .insert([
        {
          team_id: teamId,
          user_id: user.id,
          agent_type: params.agentType,
          status: 'pending',
          goal,
          plan: {}, // Plan will be generated
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // TODO: Call Python backend to generate execution plan
    const mockPlan = {
      steps: [
        { step: 1, action: 'Search for information', description: 'Query relevant sources' },
        { step: 2, action: 'Analyze data', description: 'Process and synthesize results' },
        { step: 3, action: 'Generate report', description: 'Create formatted output' },
      ],
    };

    // Update with plan
    const { data: updated } = await supabase
      .from('agent_executions')
      .update({ plan: mockPlan })
      .eq('id', execution.id)
      .select()
      .single();

    return NextResponse.json(updated, { status: 201 });
  } catch (error) {
    console.error('Agent plan error:', error);
    return NextResponse.json(
      { error: 'Failed to create execution plan' },
      { status: 500 }
    );
  }
}
