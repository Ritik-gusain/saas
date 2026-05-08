import os
import json
import logging
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from litellm import completion

from dotenv import load_dotenv

from duckduckgo_search import DDGS

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Luminescent AI Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    systemPrompt: Optional[str] = "You are a helpful AI assistant."
    model: Optional[str] = "openrouter/google/gemini-2.0-flash-001"
    agentId: Optional[str] = "general"
    webSearch: bool = False
    apiKeys: Dict[str, str] = {}
    stream: bool = True
    temperature: float = 0.7
    max_tokens: int = 4000

# Agent Persona Mapping
AGENT_PERSONAS = {
    "general": "You are Luminescent AI, a highly capable and versatile generalist assistant. Provide clear, accurate, and helpful responses to any query.",
    "researcher": "You are a specialized Research Agent. Your goal is to provide deep insights, verify facts, and synthesize complex information from across the web. Be meticulous and cite sources where possible.",
    "coder": "You are an expert Software Engineer and Coding Assistant. Write clean, efficient, and well-documented code. Focus on best practices, performance, and security.",
    "analyst": "You are a Data Analyst and Logical Reasoning expert. Approach problems step-by-step, explain your reasoning, and focus on mathematical accuracy and data-driven insights.",
    "designer": "You are a Creative Director and UI/UX expert. Focus on aesthetics, user experience, and creative writing. Be inspiring and pay attention to design details.",
    "writer": "You are a professional Assistant and Writing Expert. Help with drafting, editing, and executive support. Maintain a professional, polished, and concise tone."
}

def perform_web_search(query: str) -> str:
    """Performs a web search using DuckDuckGo and returns formatted results."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
            if not results:
                return "No search results found."
            
            context = "### WEB SEARCH RESULTS ###\n"
            for i, r in enumerate(results, 1):
                context += f"{i}. {r['title']}\n   Source: {r['href']}\n   Snippet: {r['body']}\n\n"
            return context
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return f"Error performing search: {str(e)}"

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.2.0"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Determine base system prompt from agent or request
        base_system_prompt = AGENT_PERSONAS.get(request.agentId, request.systemPrompt)
        
        # If web search is enabled, perform search and augment prompt
        if request.webSearch:
            # Use the last user message as the search query
            user_messages = [m for m in request.messages if m.role == 'user']
            search_query = user_messages[-1].content if user_messages else ""
            
            if search_query:
                logger.info(f"Performing web search for: {search_query}")
                search_results = perform_web_search(search_query)
                base_system_prompt += f"\n\n{search_results}\n\nYou are currently using WEB SEARCH. Use the information above to provide a grounded, up-to-date answer. If the search results are irrelevant, rely on your internal knowledge but mention the search results didn't help."
            else:
                base_system_prompt += "\n\nWEB SEARCH ENABLED: No specific query provided for search."
        
        # Prepare LiteLLM compatible messages
        litellm_messages = [{"role": "system", "content": base_system_prompt}]
        for msg in request.messages:
            litellm_messages.append({"role": msg.role, "content": msg.content})

        # Configure provider specific environment variables for this request
        custom_env = {}
        for provider, key in request.apiKeys.items():
            if not key: continue
            if provider.lower() == 'openai':
                custom_env['openai_api_key'] = key
            elif provider.lower() == 'anthropic':
                custom_env['anthropic_api_key'] = key
            elif provider.lower() == 'google':
                custom_env['gemini_api_key'] = key
            elif provider.lower() == 'openrouter':
                custom_env['openrouter_api_key'] = key

        # Execute LiteLLM completion
        if request.stream:
            def event_generator():
                try:
                    response = completion(
                        model=request.model,
                        messages=litellm_messages,
                        stream=True,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                        **custom_env
                    )
                    for chunk in response:
                        if chunk.choices and len(chunk.choices) > 0:
                            content = chunk.choices[0].delta.content
                            if content:
                                yield f"data: {json.dumps({'content': content})}\n\n"
                    yield "data: [DONE]\n\n"
                except Exception as e:
                    logger.error(f"Streaming error: {str(e)}")
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"

            return StreamingResponse(event_generator(), media_type="text/event-stream")
        else:
            response = completion(
                model=request.model,
                messages=litellm_messages,
                stream=False,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                **custom_env
            )
            return {"content": response.choices[0].message.content}

    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
