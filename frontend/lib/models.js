/**
 * lib/models.js
 * Centralized logic for Bytez AI model interaction.
 * In a production SaaS, this would securely communicate with our backend API (which in turn calls Bytez securely).
 */

const API_ENDPOINT = '/api/chat'; // Next.js API route proxying to Python backend, or straight to python on :3000

export async function sendMessageToModel(messages, systemPrompt = "You are a helpful SaaS AI assistant.") {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        systemPrompt
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to communicate with AI server');
    }
    
    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("Error in model interaction:", error);
    throw error;
  }
}
