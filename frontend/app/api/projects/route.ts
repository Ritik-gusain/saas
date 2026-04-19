import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with Firestore queries when DB is set up
// import { db } from '@/lib/firebase-admin';

// Temporary in-memory project store
const projectsStore: any[] = [];

export async function GET(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Stub: return in-memory projects (replace with Firestore)
    return NextResponse.json(projectsStore);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify Firebase ID token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { team_id, name, description } = await req.json();

    const newProject = {
      id: crypto.randomUUID(),
      team_id,
      name,
      description,
      created_by: 'firebase-uid-pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    projectsStore.push(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
