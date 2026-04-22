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

# Load Bytez API key
KEY_FILE = os.path.join("keys", "bytez_api_key.txt")
bytez_api_key = ""
if os.path.exists(KEY_FILE):
    with open(KEY_FILE, "r") as f:
        file_key = f.read().strip()
        if file_key and not file_key.startswith("#"):
            bytez_api_key = file_key

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
        
        if has_byok:
            # MVP: Acknowledge BYOK usage
            # In a full implementation, we would route to OpenAI/Anthropic/Google using these keys
            provider = "openai" if "openai" in api_keys else "anthropic" if "anthropic" in api_keys else "openrouter"
            print(f"Using BYOK strategy. Provider: {provider}")
            model_to_use = data.get("model", "gpt-4")
        else:
            # Fallback/Team Strategy: SaaS Balance using Bytez
            print("Using SaaS Platform Balance (Bytez).")
            if not bytez_api_key:
                return JSONResponse(status_code=500, content={"error": "Bytez API key is missing. Please add it to keys/bytez_api_key.txt"})
                
            sdk = Bytez(bytez_api_key)
            model_to_use = sdk.model("google/gemma-4-26B-A4B-it")
        
        api_messages = [{"role": "system", "content": system_prompt}] + messages
        
        if has_byok:
            response_text = f"This is a simulated response using your BYOK API Key for model {model_to_use}."
            return {"reply": response_text}
            
        results = model_to_use.run(api_messages)
        

        
        if hasattr(results, 'error') and results.error:
            return JSONResponse(status_code=500, content={"error": results.error})
            
        # Parse the output correctly
        response_data = results.output if hasattr(results, 'output') else results
        response_text = ""
        
        if isinstance(response_data, dict) and "content" in response_data:
            response_text = response_data["content"]
        elif isinstance(response_data, str):
            response_text = response_data
        elif hasattr(results, 'text'):
            response_text = results.text
        else:
            response_text = str(response_data)
            
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
