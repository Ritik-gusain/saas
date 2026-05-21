export interface AIModel {
  id: string;           // OpenRouter model ID
  name: string;
  provider: string;
  providerLogo: string; // emoji fallback
  description: string;
  tags: string[];
  free: boolean;
  contextWindow?: string;
}

export const AI_MODELS: AIModel[] = [
  // ── OpenAI ──────────────────────────────────────────────────────────────────
  { id: "openrouter/openai/gpt-4o-2024-11-20", name: "GPT-4o", provider: "OpenAI", providerLogo: "🟢", description: "Most capable GPT-4o, multimodal powerhouse", tags: ["multimodal", "flagship", "reasoning"], free: false, contextWindow: "128K" },
  { id: "openrouter/openai/gpt-4o-search-preview", name: "GPT-4o Search", provider: "OpenAI", providerLogo: "🟢", description: "GPT-4o with real-time web search", tags: ["web", "search", "realtime"], free: false },
  { id: "openrouter/openai/gpt-4o-mini-search-preview", name: "GPT-4o Mini Search", provider: "OpenAI", providerLogo: "🟢", description: "Fast GPT-4o Mini with web search", tags: ["web", "search", "fast"], free: false },
  { id: "openrouter/openai/o3-mini-high", name: "o3 Mini High", provider: "OpenAI", providerLogo: "🟢", description: "Highest reasoning o3 mini variant", tags: ["reasoning", "math", "science"], free: false },
  { id: "openrouter/openai/o3-mini", name: "o3 Mini", provider: "OpenAI", providerLogo: "🟢", description: "Efficient reasoning model", tags: ["reasoning", "math"], free: false },
  { id: "openrouter/openai/o1", name: "o1", provider: "OpenAI", providerLogo: "🟢", description: "Full o1 reasoning model", tags: ["reasoning", "flagship"], free: false },
  { id: "openrouter/openai/gpt-oss-120b:free", name: "GPT OSS 120B (Free)", provider: "OpenAI", providerLogo: "🟢", description: "OpenAI open-source 120B model", tags: ["free", "large"], free: true },
  { id: "openrouter/openai/gpt-oss-20b:free", name: "GPT OSS 20B (Free)", provider: "OpenAI", providerLogo: "🟢", description: "OpenAI open-source 20B model", tags: ["free", "fast"], free: true },

  // ── Anthropic ────────────────────────────────────────────────────────────────
  { id: "openrouter/anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", providerLogo: "🟠", description: "Fast, affordable Claude — ideal for chat", tags: ["fast", "writing", "creative"], free: false, contextWindow: "200K" },

  // ── Google ────────────────────────────────────────────────────────────────────
  { id: "openrouter/google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", provider: "Google", providerLogo: "🔵", description: "Fast, multimodal Gemini 2.0", tags: ["fast", "multimodal", "flagship"], free: false, contextWindow: "1M" },
  { id: "openrouter/google/gemini-2.0-flash-lite-001", name: "Gemini 2.0 Flash Lite", provider: "Google", providerLogo: "🔵", description: "Lightest, fastest Gemini model", tags: ["fast", "cheap"], free: false },
  { id: "openrouter/google/gemma-3-27b-it", name: "Gemma 3 27B", provider: "Google", providerLogo: "🔵", description: "Google open Gemma 3 27B", tags: ["open", "large"], free: false },
  { id: "openrouter/google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B (Free)", provider: "Google", providerLogo: "🔵", description: "Latest Gemma 4 26B, free tier", tags: ["free", "new"], free: true },
  { id: "openrouter/google/gemma-4-31b-it:free", name: "Gemma 4 31B (Free)", provider: "Google", providerLogo: "🔵", description: "Latest Gemma 4 31B, free tier", tags: ["free", "large"], free: true },

  // ── DeepSeek ──────────────────────────────────────────────────────────────────
  { id: "openrouter/deepseek/deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", providerLogo: "🐋", description: "Powerful open reasoning model", tags: ["reasoning", "math", "flagship"], free: false, contextWindow: "128K" },
  { id: "openrouter/deepseek/deepseek-chat", name: "DeepSeek V3", provider: "DeepSeek", providerLogo: "🐋", description: "DeepSeek's flagship chat model", tags: ["chat", "coding", "flagship"], free: false },
  { id: "openrouter/deepseek/deepseek-v4-flash:free", name: "DeepSeek V4 Flash (Free)", provider: "DeepSeek", providerLogo: "🐋", description: "Free fast DeepSeek V4 Flash", tags: ["free", "fast"], free: true },
  { id: "openrouter/deepseek/deepseek-r1-distill-qwen-32b", name: "R1 Distill Qwen 32B", provider: "DeepSeek", providerLogo: "🐋", description: "Distilled reasoning model", tags: ["reasoning", "efficient"], free: false },
  { id: "openrouter/deepseek/deepseek-r1-distill-llama-70b", name: "R1 Distill Llama 70B", provider: "DeepSeek", providerLogo: "🐋", description: "Large distilled reasoning model", tags: ["reasoning", "large"], free: false },

  // ── Meta Llama ────────────────────────────────────────────────────────────────
  { id: "openrouter/meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", provider: "Meta", providerLogo: "🦙", description: "Meta's best open chat model", tags: ["open", "large", "chat"], free: false, contextWindow: "128K" },
  { id: "openrouter/meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", provider: "Meta", providerLogo: "🦙", description: "Llama 3.3 70B free tier", tags: ["free", "open"], free: true },
  { id: "openrouter/meta-llama/llama-3.2-11b-vision-instruct", name: "Llama 3.2 11B Vision", provider: "Meta", providerLogo: "🦙", description: "Multimodal Llama with vision", tags: ["vision", "multimodal"], free: false },
  { id: "openrouter/meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", provider: "Meta", providerLogo: "🦙", description: "Llama 3.1 flagship 70B", tags: ["open", "large"], free: false },
  { id: "openrouter/meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)", provider: "Meta", providerLogo: "🦙", description: "Tiny Llama, very fast", tags: ["free", "fast", "tiny"], free: true },

  // ── Mistral ────────────────────────────────────────────────────────────────────
  { id: "openrouter/mistralai/mistral-large-2411", name: "Mistral Large 2411", provider: "Mistral", providerLogo: "🌀", description: "Mistral's top large model", tags: ["flagship", "multilingual"], free: false },
  { id: "openrouter/mistralai/mistral-small-24b-instruct-2501", name: "Mistral Small 3", provider: "Mistral", providerLogo: "🌀", description: "Efficient Mistral small model", tags: ["fast", "efficient"], free: false },
  { id: "openrouter/mistralai/pixtral-large-2411", name: "Pixtral Large", provider: "Mistral", providerLogo: "🌀", description: "Mistral's multimodal model", tags: ["vision", "multimodal"], free: false },
  { id: "openrouter/mistralai/mistral-saba", name: "Mistral Saba", provider: "Mistral", providerLogo: "🌀", description: "Multilingual focused Mistral", tags: ["multilingual", "arabic"], free: false },

  // ── Perplexity ────────────────────────────────────────────────────────────────
  { id: "openrouter/perplexity/sonar-deep-research", name: "Sonar Deep Research", provider: "Perplexity", providerLogo: "🔍", description: "Deep research with live web access", tags: ["search", "research", "web"], free: false },
  { id: "openrouter/perplexity/sonar-reasoning-pro", name: "Sonar Reasoning Pro", provider: "Perplexity", providerLogo: "🔍", description: "Web-grounded reasoning model", tags: ["reasoning", "search"], free: false },
  { id: "openrouter/perplexity/sonar-pro", name: "Sonar Pro", provider: "Perplexity", providerLogo: "🔍", description: "Powerful Sonar with web access", tags: ["search", "web"], free: false },
  { id: "openrouter/perplexity/sonar", name: "Sonar", provider: "Perplexity", providerLogo: "🔍", description: "Fast Sonar with web access", tags: ["search", "fast"], free: false },

  // ── Qwen ──────────────────────────────────────────────────────────────────────
  { id: "openrouter/qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B", provider: "Qwen", providerLogo: "🐼", description: "Best open coding model", tags: ["code", "flagship", "open"], free: false },
  { id: "openrouter/qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "Qwen", providerLogo: "🐼", description: "Large Qwen 2.5 chat model", tags: ["large", "multilingual"], free: false },
  { id: "openrouter/qwen/qwen-plus", name: "Qwen Plus", provider: "Qwen", providerLogo: "🐼", description: "Qwen Plus API model", tags: ["balanced"], free: false },
  { id: "openrouter/qwen/qwen3-coder:free", name: "Qwen3 Coder 480B (Free)", provider: "Qwen", providerLogo: "🐼", description: "Massive free Qwen3 coding model", tags: ["free", "code", "large"], free: true },
  { id: "openrouter/qwen/qwen-2.5-7b-instruct", name: "Qwen 2.5 7B", provider: "Qwen", providerLogo: "🐼", description: "Small efficient Qwen model", tags: ["fast", "efficient"], free: false },

  // ── NVIDIA ────────────────────────────────────────────────────────────────────
  { id: "openrouter/nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron Super 120B (Free)", provider: "NVIDIA", providerLogo: "🟩", description: "NVIDIA's super 120B model, free", tags: ["free", "large", "reasoning"], free: true },
  { id: "openrouter/nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron Nano 30B (Free)", provider: "NVIDIA", providerLogo: "🟩", description: "NVIDIA compact 30B model, free", tags: ["free", "efficient"], free: true },
  { id: "openrouter/nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano 9B (Free)", provider: "NVIDIA", providerLogo: "🟩", description: "Tiny NVIDIA Nemotron model, free", tags: ["free", "tiny"], free: true },

  // ── MiniMax ────────────────────────────────────────────────────────────────────
  { id: "openrouter/minimax/minimax-m2.5:free", name: "MiniMax M2.5 (Free)", provider: "MiniMax", providerLogo: "🟣", description: "Free MiniMax multimodal model", tags: ["free", "multimodal"], free: true },
  { id: "openrouter/minimax/minimax-01", name: "MiniMax-01", provider: "MiniMax", providerLogo: "🟣", description: "MiniMax flagship model", tags: ["flagship", "long-context"], free: false, contextWindow: "1M" },

  // ── Microsoft ─────────────────────────────────────────────────────────────────
  { id: "openrouter/microsoft/phi-4", name: "Phi-4", provider: "Microsoft", providerLogo: "🪟", description: "Small but mighty Microsoft Phi-4", tags: ["small", "reasoning", "efficient"], free: false },

  // ── Amazon ─────────────────────────────────────────────────────────────────────
  { id: "openrouter/amazon/nova-pro-v1", name: "Nova Pro 1.0", provider: "Amazon", providerLogo: "🟡", description: "Amazon's top Nova model", tags: ["multimodal", "flagship"], free: false },
  { id: "openrouter/amazon/nova-lite-v1", name: "Nova Lite 1.0", provider: "Amazon", providerLogo: "🟡", description: "Fast and affordable Nova", tags: ["fast", "cheap"], free: false },
  { id: "openrouter/amazon/nova-micro-v1", name: "Nova Micro 1.0", provider: "Amazon", providerLogo: "🟡", description: "Smallest, fastest Amazon Nova", tags: ["tiny", "fast"], free: false },

  // ── Cohere ────────────────────────────────────────────────────────────────────
  { id: "openrouter/cohere/command-r-plus-08-2024", name: "Command R+ (Aug 2024)", provider: "Cohere", providerLogo: "🔶", description: "Best Cohere model with RAG", tags: ["rag", "enterprise"], free: false },
  { id: "openrouter/cohere/command-r-08-2024", name: "Command R (Aug 2024)", provider: "Cohere", providerLogo: "🔶", description: "Balanced Cohere model", tags: ["balanced", "rag"], free: false },
  { id: "openrouter/cohere/command-r7b-12-2024", name: "Command R7B", provider: "Cohere", providerLogo: "🔶", description: "Small efficient Cohere model", tags: ["fast", "small"], free: false },

  // ── Nous Research ─────────────────────────────────────────────────────────────
  { id: "openrouter/nousresearch/hermes-3-llama-3.1-70b", name: "Hermes 3 70B", provider: "Nous Research", providerLogo: "🏛️", description: "Advanced instruction-following model", tags: ["instruction", "open"], free: false },
  { id: "openrouter/nousresearch/hermes-3-llama-3.1-405b", name: "Hermes 3 405B", provider: "Nous Research", providerLogo: "🏛️", description: "Largest Hermes model", tags: ["large", "flagship"], free: false },

  // ── Inflection ────────────────────────────────────────────────────────────────
  { id: "openrouter/inflection/inflection-3-pi", name: "Inflection Pi", provider: "Inflection", providerLogo: "♾️", description: "Empathetic conversational AI", tags: ["empathetic", "conversational"], free: false },
  { id: "openrouter/inflection/inflection-3-productivity", name: "Inflection Productivity", provider: "Inflection", providerLogo: "♾️", description: "Task-focused productivity model", tags: ["productivity", "tasks"], free: false },

  // ── Arcee AI ──────────────────────────────────────────────────────────────────
  { id: "openrouter/arcee-ai/trinity-large-thinking:free", name: "Trinity Large Thinking (Free)", provider: "Arcee AI", providerLogo: "🟤", description: "Free large thinking model", tags: ["free", "reasoning"], free: true },
];

export const MODEL_PROVIDERS = Array.from(new Set(AI_MODELS.map(m => m.provider)));

export function getModel(id: string): AIModel {
  return AI_MODELS.find(m => m.id === id) || AI_MODELS[0];
}

export const FREE_MODELS = AI_MODELS.filter(m => m.free);

export async function sendMessageToModel(messages: { role: string; content: string }[]): Promise<string> {
  const systemMessage = messages.find(m => m.role === 'system');
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  
  const response = await fetch('http://127.0.0.1:8000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: userAndAssistantMessages,
      systemPrompt: systemMessage?.content || 'You are a helpful AI assistant.',
      model: 'openrouter/google/gemini-2.0-flash-001',
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to model');
  }

  const data = await response.json();
  return data.content;
}
