import os
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from litellm import completion
import litellm

# Initialize FastAPI
app = FastAPI(title="Luminescent.io Unified Server")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: Disable litellm logging to console for production
litellm.set_verbose = False

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        system_prompt = data.get("systemPrompt", "You are a helpful AI assistant.")
        api_keys = data.get("apiKeys", {}) # BYOK API Keys from frontend
        model = data.get("model", "gpt-4o")
        stream = data.get("stream", False)
        
        # Validate BYOK availability
        if not api_keys or not isinstance(api_keys, dict):
            return JSONResponse(status_code=402, content={"error": "Missing API keys configuration."})

        # Determine provider and key
        provider_key = None
        target_model = model

        # Logic to map model to provider/key
        if model.startswith("gpt-"):
            provider_key = api_keys.get("openai")
            target_model = f"openai/{model}"
        elif model.startswith("claude-"):
            provider_key = api_keys.get("anthropic")
            target_model = f"anthropic/{model}"
        elif model.startswith("gemini-"):
            provider_key = api_keys.get("google")
            target_model = f"gemini/{model}"
        else:
            # Default to OpenRouter or try to infer
            provider_key = api_keys.get("openrouter") or api_keys.get("openai")
            if api_keys.get("openrouter"):
                target_model = f"openrouter/{model}"

        if not provider_key:
            return JSONResponse(status_code=402, content={
                "error": f"No API key found for model {model}. Please add your key in Settings."
            })

        # Prepare messages
        formatted_messages = [{"role": "system", "content": system_prompt}] + messages

        # Call LiteLLM
        if stream:
            response = completion(
                model=target_model,
                messages=formatted_messages,
                api_key=provider_key,
                stream=True
            )
            
            async def event_generator():
                for part in response:
                    content = part.choices[0].delta.content or ""
                    if content:
                        yield f"data: {json.dumps({'content': content})}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(event_generator(), media_type="text/event-stream")
        else:
            response = completion(
                model=target_model,
                messages=formatted_messages,
                api_key=provider_key
            )
            
            reply = response.choices[0].message.content
            return {
                "reply": reply,
                "usage": response.get("usage", {}),
                "model": target_model
            }
            
    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    print("\nStarting Luminescent.io Unified Server...\n")
    print("Serving on http://localhost:8000\n")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

