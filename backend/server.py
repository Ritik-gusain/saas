import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from bytez import Bytez

# Initialize FastAPI
app = FastAPI(title="Luminescent.io Unified Server")

# Add CORS middleware just in case
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Removed Bytez API key fallback logic since platform is fully BYOK

# Define the /api/chat endpoint
@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        system_prompt = data.get("systemPrompt", "You are a helpful AI assistant.")
        api_keys = data.get("apiKeys", {}) # BYOK API Keys from frontend
        
        # BYOK Strategy check
        has_byok = api_keys and isinstance(api_keys, dict) and any(api_keys.values())
        if not has_byok:
            return JSONResponse(status_code=402, content={"error": "No API keys provided. You must bring your own API key to use the platform."})
            
        # MVP: Acknowledge BYOK usage
        # In a full implementation, we would route to OpenAI/Anthropic/Google using these keys
        provider = "openai" if "openai" in api_keys else "anthropic" if "anthropic" in api_keys else "openrouter"
        print(f"Using BYOK strategy. Provider: {provider}")
        model_to_use = data.get("model", "gpt-4")

        
        api_messages = [{"role": "system", "content": system_prompt}] + messages
        
        # In a real implementation, you would use the SDK of the `provider` here.
        # For MVP showcase, we return a simulated response if BYOK is validated.
        response_text = f"This is a simulated response using your BYOK API Key for model {model_to_use}."
        
        return {"reply": response_text}
        
    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# Serve static files for everything else (putting this AFTER routes is important)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    print("\nStarting Luminescent.io Unified Server...\n")
    print("Serving on http://localhost:8000\n")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
