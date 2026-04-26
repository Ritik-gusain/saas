/**
 * lib/models.ts
 * Centralized logic for AI model interaction.
 */

const API_ENDPOINT = '/api/chat';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToModel(
  messages: ChatMessage[], 
  systemPrompt: string = "You are a helpful SaaS AI assistant."
): Promise<string> {
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
