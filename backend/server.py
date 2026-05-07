import os
import json
import logging
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from litellm import completion

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
    model: Optional[str] = "gpt-4o"
    apiKeys: Dict[str, str] = {}
    stream: bool = True
    temperature: float = 0.7
    max_tokens: int = 4000

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.1.0"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Prepare LiteLLM compatible messages
        litellm_messages = [{"role": "system", "content": request.systemPrompt}]
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
