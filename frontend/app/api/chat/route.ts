import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    // Call the Python FastAPI Backend which uses Bytez SDK
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000/api/chat';
    
    const response = await fetch(pythonBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, systemPrompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Error from Python AI Backend' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.reply });

  } catch (error: any) {
    console.error("JS Backend Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
