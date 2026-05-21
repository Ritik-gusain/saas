import os
import json
import uuid
import logging
import asyncio
import re
import httpx
from typing import List, Dict, Optional, Any, AsyncGenerator
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from litellm import completion, acompletion
from dotenv import load_dotenv

# --- Optional web search ---
try:
    from duckduckgo_search import DDGS
    WEB_SEARCH_AVAILABLE = True
except ImportError:
    WEB_SEARCH_AVAILABLE = False

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("luminescent")

# ─── In-memory execution store (replace with Redis/DB in production) ───────────
executions: Dict[str, Dict] = {}

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(title="Luminescent AI Orchestrator", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ───────────────────────────────────────────────────────────────────
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

class ImageGenerateRequest(BaseModel):
    prompt: str
    apiKeys: Dict[str, str] = {}
    model: Optional[str] = "openai/dall-e-3"
    size: Optional[str] = "1024x1024"
    quality: Optional[str] = "standard"

class AgentPlanRequest(BaseModel):
    goal: str
    teamId: Optional[str] = None
    projectId: Optional[str] = None
    apiKeys: Dict[str, str] = {}
    model: Optional[str] = "openrouter/google/gemini-2.0-flash-001"

class AgentExecuteRequest(BaseModel):
    executionId: str
    plan: Dict[str, Any]
    goal: str
    agentType: str
    apiKeys: Dict[str, str] = {}
    model: Optional[str] = "openrouter/google/gemini-2.0-flash-001"

class TitleRequest(BaseModel):
    messages: List[ChatMessage]
    apiKeys: Dict[str, str] = {}
    model: Optional[str] = "openrouter/google/gemini-2.0-flash-001"

# ─── Agent Personas (50 agents) ───────────────────────────────────────────────
AGENT_PERSONAS = {
    "general":      "You are Luminescent AI — a versatile, highly capable generalist assistant. Provide clear, accurate, and thoughtful responses to any query.",
    "researcher":   "You are a Research Agent. Find, verify, and synthesize complex information meticulously. Cite sources and present findings in structured sections.",
    "coder":        "You are an expert Software Engineer. Write clean, efficient, secure, well-documented code. Follow best practices and explain your decisions.",
    "analyst":      "You are a Data Analyst. Break down problems step-by-step, show reasoning clearly, and provide precise data-driven insights.",
    "designer":     "You are a Creative Director and UI/UX expert. Think visually, focus on aesthetics and user experience. Provide inspiring design guidance.",
    "writer":       "You are a professional Writing Expert. Help with drafting, editing, and communication. Maintain a polished, precise, and impactful tone.",
    "strategist":   "You are a Business Strategist. Provide sharp, actionable business advice, competitive analysis, and strategic frameworks.",
    "mathematician":"You are a Mathematics Expert. Solve problems step-by-step with precision. Show all work and verify every answer.",
    "scientist":    "You are a multidisciplinary Scientist. Explain complex scientific concepts clearly and design experiments methodically.",
    "lawyer":       "You are a Legal Research Assistant. Analyze legal questions, summarize laws, and review contracts. Note you are not a licensed attorney.",
    "doctor":       "You are a Medical Information Specialist. Provide accurate health information. Always recommend consulting a licensed physician.",
    "tutor":        "You are a Patient Personal Tutor. Adapt your teaching style. Break complex topics into digestible lessons with examples.",
    "translator":   "You are an expert Linguist. Provide accurate, natural translations preserving tone, context, and cultural nuance across 100+ languages.",
    "poet":         "You are a Poet and Literary Artist. Craft beautiful, evocative poetry in any style — sonnets, haiku, free verse — with emotional depth.",
    "philosopher":  "You are a Philosopher. Engage with ideas rigorously using logic, ethics, metaphysics, and epistemology. Challenge assumptions.",
    "historian":    "You are a Historian. Provide accurate historical context, analysis of events, and engaging narrative about the past.",
    "economist":    "You are an Economist. Analyze economic trends, markets, and policy with data-driven insights and clear reasoning.",
    "marketer":     "You are a Marketing Expert. Create compelling copy, campaign strategies, and brand narratives that convert.",
    "therapist":    "You are a Mindfulness and Wellness Coach. Provide compassionate support, coping strategies, and mindfulness techniques. Not a licensed therapist.",
    "nutritionist": "You are a Nutrition Expert. Provide science-based dietary advice, meal planning, and nutritional analysis.",
    "fitness":      "You are a Fitness Coach. Design personalized workout plans, provide form guidance, and motivate progress.",
    "seo":          "You are an SEO Specialist. Optimize content for search engines, research keywords, and build organic traffic strategies.",
    "socialmedia":  "You are a Social Media Strategist. Create platform-specific viral content, growth strategies, and engagement playbooks.",
    "product":      "You are a Product Manager. Write PRDs, define roadmaps, prioritize backlogs, and align teams around user needs.",
    "devops":       "You are a DevOps Engineer. Design CI/CD pipelines, cloud infrastructure, Docker/K8s configs, and automation scripts.",
    "security":     "You are a Cybersecurity Analyst. Identify vulnerabilities, review code for security flaws, and recommend hardening strategies.",
    "dbadmin":      "You are a Database Architect. Design efficient schemas, optimize queries, and manage data at scale across SQL and NoSQL systems.",
    "mleng":        "You are a Machine Learning Engineer. Build, tune, and deploy ML models. Explain algorithms and training strategies clearly.",
    "prompteng":    "You are a Prompt Engineering expert. Craft, refine, and optimize prompts for maximum AI performance across different models.",
    "gamedev":      "You are a Game Developer. Design game mechanics, write game code, and create engaging player experiences across genres.",
    "screenwriter": "You are a Professional Screenwriter. Write compelling scripts with sharp dialogue, strong character arcs, and cinematic structure.",
    "storyteller":  "You are a Master Storyteller. Craft immersive narratives with vivid worlds, complex characters, and compelling plots.",
    "journalist":   "You are an Investigative Journalist. Write clear, factual, engaging news articles with proper sourcing and journalistic integrity.",
    "teacher":      "You are a Curriculum Designer. Build structured lesson plans, educational frameworks, and assessments for any subject.",
    "debater":      "You are a Debate Coach. Construct rigorous arguments, anticipate counterpoints, and sharpen critical thinking skills.",
    "interviewer":  "You are an Interview Coach. Help candidates prepare answers, practice behavioral questions, and present themselves confidently.",
    "hrexpert":     "You are an HR Specialist. Guide hiring processes, write job descriptions, develop culture strategies, and navigate HR policies.",
    "accountant":   "You are a Financial Analyst. Analyze budgets, investments, and financial statements with precision and actionable recommendations.",
    "travel":       "You are a Travel Expert. Create detailed itineraries, recommend hidden gems, and give practical travel tips for any destination.",
    "chef":         "You are a Personal Chef. Suggest recipes, adapt dishes for dietary needs, and share professional culinary techniques.",
    "interior":     "You are an Interior Designer. Recommend layouts, color schemes, furniture, and decor for beautiful living and working spaces.",
    "investor":     "You are an Investment Advisor. Provide market analysis, portfolio strategies, and risk assessment. Not a licensed financial advisor.",
    "scientist2":   "You are a Quantum Physicist. Explain quantum mechanics, particle physics, and theoretical models with clarity and rigor.",
    "architect":    "You are a Software Architect. Design scalable systems, define APIs, select tech stacks, and create architectural blueprints.",
    "ethicist":     "You are an AI Ethicist. Analyze AI systems for bias, fairness, and societal impact. Propose ethical frameworks for responsible AI.",
    "copywriter":   "You are an Advertising Copywriter. Write punchy, persuasive copy for ads, landing pages, and email campaigns that convert.",
    "diplomat":     "You are a Diplomat and Negotiator. Guide conflict resolution, cross-cultural communication, and negotiation strategies.",
    "comedian":     "You are a Comedian and Satirist. Write sharp, witty, original jokes, sketches, and comedic content for any audience.",
    "astrologer":   "You are an Astrologer. Interpret birth charts, planetary movements, and cosmic patterns to offer thoughtful perspective.",
    "summarizer":   "You are a Summarization Expert. Condense any content into clear, concise, and comprehensive summaries without losing key information.",
    "brainstorm":   "You are a Brainstorming Facilitator. Generate diverse, creative ideas rapidly. Think laterally, challenge conventions, spark innovation.",
    # Aliases for agent plan system
    "workflow":     "You are a Workflow Automation specialist. Help plan, design, and execute multi-step automated processes.",
    "document":     "You are a Document Intelligence agent. Extract, analyze, and summarize information from documents.",
}

# ─── Agent Planning Prompts ───────────────────────────────────────────────────
AGENT_PLAN_PROMPTS = {
    "research": """You are a Research Planning Agent. Given a research goal, create a detailed execution plan.
Return a JSON object with this exact structure:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 4,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "web_search|llm|synthesize"}
  ]
}""",
    "content": """You are a Content Creation Planning Agent. Given a content goal, create a detailed execution plan.
Return a JSON object:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 3,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "outline|draft|refine|format"}
  ]
}""",
    "code": """You are a Code Generation Planning Agent. Given a coding goal, create an execution plan.
Return a JSON object:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 4,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "design|implement|test|document"}
  ]
}""",
    "data": """You are a Data Analysis Planning Agent. Given an analysis goal, create an execution plan.
Return a JSON object:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 3,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "collect|analyze|visualize|report"}
  ]
}""",
    "workflow": """You are a Workflow Design Agent. Given an automation goal, create an execution plan.
Return a JSON object:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 4,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "map|design|connect|test"}
  ]
}""",
    "document": """You are a Document Intelligence Planning Agent. Given a document task, create an execution plan.
Return a JSON object:
{
  "title": "Short plan title",
  "description": "What this plan will accomplish",
  "estimated_steps": 3,
  "steps": [
    {"step": 1, "action": "action_name", "description": "What to do", "tool": "extract|analyze|summarize|structure"}
  ]
}""",
}

# ─── Helpers ──────────────────────────────────────────────────────────────────
IMAGE_TOOL_INSTRUCTION = """

## Image Generation Capability
You have the ability to generate images. When a user asks you to create, draw, generate, visualize, or show an image/picture/illustration/photo of something, you MUST include the following marker in your response (on its own line):

[GENERATE_IMAGE: <detailed image generation prompt here>]

IMPORTANT rules:
- Always write a detailed, vivid image prompt (describe style, lighting, colors, composition)
- The marker must be on its own line
- You may include text before/after the marker to explain your choice
- Only use this when the user explicitly wants a visual image created
- One image per response maximum
"""

def build_litellm_kwargs(api_keys: Dict[str, str], model: str = "") -> Dict[str, str]:
    """Map provider keys to LiteLLM environment variable names."""
    kwargs = {}
    provider = model.split("/")[0].lower() if "/" in model else model.split("-")[0].lower()

    api_key = None
    if api_keys:
        if provider in api_keys and api_keys[provider]:
            api_key = api_keys[provider]
        elif "openrouter" in model.lower() and api_keys.get("openrouter"):
            api_key = api_keys["openrouter"]
        elif "gemini" in model.lower() or "google" in model.lower():
            api_key = api_keys.get("gemini") or api_keys.get("google")
        elif "claude" in model.lower() or "anthropic" in provider:
            api_key = api_keys.get("anthropic")
        elif "gpt" in model.lower() or "openai" in provider:
            api_key = api_keys.get("openai")
            
    # Fallback to env var if no keys provided
    if not api_key and ("openrouter" in model.lower() or provider == "openrouter"):
        api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key and ("gemini" in model.lower() or "google" in model.lower()):
        api_key = os.getenv("GEMINI_API_KEY")
    if not api_key and ("claude" in model.lower() or "anthropic" in provider):
        api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key and ("gpt" in model.lower() or "openai" in provider):
        api_key = os.getenv("OPENAI_API_KEY")

    if api_key:
        kwargs["api_key"] = api_key

    return kwargs


async def generate_image_via_openrouter(prompt: str, api_key: str) -> Optional[str]:
    """Call OpenRouter's image generation API (Flux / DALL-E). Returns image URL or None."""
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://luminescent.io",
            "X-Title": "Luminescent AI",
        }
        payload = {
            "model": "black-forest-labs/flux-schnell",
            "prompt": prompt,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                "https://openrouter.ai/api/v1/images/generations",
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
            # OpenRouter returns { data: [{ url: "..." }] }
            url = data.get("data", [{}])[0].get("url")
            return url
    except Exception as e:
        logger.error(f"Image generation error: {e}")
        return None


def perform_web_search(query: str, max_results: int = 5) -> str:
    """Performs a DuckDuckGo web search and returns formatted results."""
    if not WEB_SEARCH_AVAILABLE:
        return "Web search not available (duckduckgo_search not installed)."
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if not results:
            return "No search results found."
        context = "### WEB SEARCH RESULTS ###\n"
        for i, r in enumerate(results, 1):
            context += f"{i}. **{r['title']}**\n   Source: {r['href']}\n   {r['body']}\n\n"
        return context
    except Exception as e:
        logger.error(f"Web search error: {e}")
        return f"Search error: {str(e)}"


IMAGE_MARKER_PATTERN = re.compile(r'\[GENERATE_IMAGE:\s*(.+?)\]', re.IGNORECASE)


def get_fallback_models(failed_model: str) -> List[str]:
    """Return a list of robust free fallback models to try if the target model fails."""
    candidates = [
        "openrouter/meta-llama/llama-3.3-70b-instruct:free",
        "openrouter/deepseek/deepseek-v4-flash:free",
        "openrouter/nvidia/nemotron-3-super-120b-a12b:free",
        "openrouter/google/gemma-4-31b-it:free",
        "openrouter/google/gemma-4-26b-a4b-it:free",
    ]
    # Filter out the model that just failed
    return [c for c in candidates if c != failed_model]


def completion_with_fallback(model: str, messages: list, api_keys: Dict[str, str] = None, **kwargs) -> Any:
    """Synchronous completion with fallback to robust free models if the target model fails."""
    models_to_try = [model] + get_fallback_models(model)
    
    for attempt_model in models_to_try:
        try:
            logger.info(f"Attempting completion with model: {attempt_model}")
            attempt_kwargs = kwargs.copy()
            if api_keys is not None:
                resolved_keys = build_litellm_kwargs(api_keys, attempt_model)
                attempt_kwargs.update(resolved_keys)
            
            response = completion(
                model=attempt_model,
                messages=messages,
                **attempt_kwargs,
            )
            logger.info(f"Completion succeeded with model: {attempt_model}")
            return response
        except Exception as e:
            logger.warning(f"Failed completion with model {attempt_model}: {e}")
            if attempt_model == models_to_try[-1]:
                raise e


async def acompletion_with_fallback(model: str, messages: list, api_keys: Dict[str, str] = None, **kwargs) -> Any:
    """Asynchronous completion with fallback to robust free models if the target model fails."""
    models_to_try = [model] + get_fallback_models(model)
    
    for attempt_model in models_to_try:
        try:
            logger.info(f"Attempting async completion with model: {attempt_model}")
            attempt_kwargs = kwargs.copy()
            if api_keys is not None:
                resolved_keys = build_litellm_kwargs(api_keys, attempt_model)
                attempt_kwargs.update(resolved_keys)
            
            response = await acompletion(
                model=attempt_model,
                messages=messages,
                **attempt_kwargs,
            )
            logger.info(f"Async completion succeeded with model: {attempt_model}")
            return response
        except Exception as e:
            logger.warning(f"Failed async completion with model {attempt_model}: {e}")
            if attempt_model == models_to_try[-1]:
                raise e


async def stream_llm(
    messages: list,
    model: str,
    temperature: float,
    max_tokens: int,
    llm_kwargs: dict,
    openrouter_key: str = "",
    api_keys: dict = None,
) -> AsyncGenerator[str, None]:
    """Async generator that yields SSE-formatted chunks from LiteLLM.
    Detects [GENERATE_IMAGE: prompt] markers and injects image URLs into the stream.
    Falls back to alternative free models if the selected model is rate-limited or fails."""
    try:
        response = await acompletion_with_fallback(
            model=model,
            messages=messages,
            stream=True,
            temperature=temperature,
            max_tokens=max_tokens,
            api_keys=api_keys,
            **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
        )
        accumulated = ""
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                accumulated += content
                yield f"data: {json.dumps({'content': content})}\n\n"

        # After streaming, check for image generation markers
        matches = IMAGE_MARKER_PATTERN.findall(accumulated)
        for img_prompt in matches:
            img_prompt = img_prompt.strip()
            logger.info(f"Image generation requested: {img_prompt[:80]}")
            key = openrouter_key or os.getenv("OPENROUTER_API_KEY", "")
            if key:
                img_url = await generate_image_via_openrouter(img_prompt, key)
                if img_url:
                    yield f"data: {json.dumps({'image_url': img_url, 'image_prompt': img_prompt})}\n\n"
                    logger.info(f"Image generated: {img_url[:60]}")
                else:
                    yield f"data: {json.dumps({'content': '\n\n*[Image generation failed — check API key or try again.]*'})}\n\n"
            else:
                yield f"data: {json.dumps({'content': '\n\n*[Image generation requires an OpenRouter API key.]*'})}\n\n"

        yield "data: [DONE]\n\n"
    except Exception as e:
        logger.error(f"LLM stream error: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "web_search": WEB_SEARCH_AVAILABLE,
        "agents": list(AGENT_PERSONAS.keys()),
    }


@app.post("/api/image/generate")
async def image_generate_endpoint(req: ImageGenerateRequest):
    """Direct image generation endpoint."""
    try:
        key = req.apiKeys.get("openrouter") or os.getenv("OPENROUTER_API_KEY", "")
        if not key:
            raise HTTPException(status_code=400, detail="OpenRouter API key required for image generation")
        img_url = await generate_image_via_openrouter(req.prompt, key)
        if not img_url:
            raise HTTPException(status_code=500, detail="Image generation failed")
        return {"url": img_url, "prompt": req.prompt}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    """Main streaming chat endpoint with agent personas, optional web search, and image generation."""
    try:
        # 1. Resolve system prompt from agent or override
        base_system = AGENT_PERSONAS.get(req.agentId or "general", req.systemPrompt or "")
        # Always append image generation instructions
        base_system += IMAGE_TOOL_INSTRUCTION

        # 2. Web search augmentation
        if req.webSearch:
            user_msgs = [m for m in req.messages if m.role == "user"]
            query = user_msgs[-1].content if user_msgs else ""
            if query:
                logger.info(f"Web search: {query[:80]}...")
                results = perform_web_search(query)
                base_system += (
                    f"\n\n{results}\n\n"
                    "You have access to the above real-time web search results. "
                    "Use them to ground your answer with current information. "
                    "If results are not relevant, rely on your training knowledge."
                )

        # 3. Build messages list
        litellm_msgs = [{"role": "system", "content": base_system}]
        litellm_msgs += [{"role": m.role, "content": m.content} for m in req.messages]

        # 4. API key resolution
        llm_kwargs = build_litellm_kwargs(req.apiKeys, req.model)
        openrouter_key = req.apiKeys.get("openrouter") or os.getenv("OPENROUTER_API_KEY", "")

        # 5. Stream or single response
        if req.stream:
            return StreamingResponse(
                stream_llm(litellm_msgs, req.model, req.temperature, req.max_tokens, llm_kwargs, openrouter_key, req.apiKeys),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
            )
        else:
            response = completion_with_fallback(
                model=req.model,
                messages=litellm_msgs,
                api_keys=req.apiKeys,
                stream=False,
                temperature=req.temperature,
                max_tokens=req.max_tokens,
                **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
            )
            return {"content": response.choices[0].message.content}

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/{agent_type}/plan")
async def generate_agent_plan(agent_type: str, req: AgentPlanRequest):
    """Generate a structured execution plan for a given agent type and goal."""
    try:
        plan_system = AGENT_PLAN_PROMPTS.get(agent_type, AGENT_PLAN_PROMPTS["research"])
        llm_kwargs = build_litellm_kwargs(req.apiKeys)

        messages = [
            {"role": "system", "content": plan_system},
            {"role": "user", "content": f"Goal: {req.goal}\n\nGenerate a JSON execution plan for this goal. Return only valid JSON, no markdown."},
        ]

        response = completion_with_fallback(
            model=req.model,
            messages=messages,
            api_keys=req.apiKeys,
            stream=False,
            temperature=0.3,
            max_tokens=1500,
            **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
        )

        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("```").strip()

        plan = json.loads(raw)

        # Create execution record
        execution_id = str(uuid.uuid4())
        execution = {
            "id": execution_id,
            "agent_type": agent_type,
            "goal": req.goal,
            "plan": plan,
            "status": "pending",
            "execution_log": [],
            "result": None,
            "token_used": 0,
            "created_at": datetime.utcnow().isoformat(),
            "started_at": None,
            "completed_at": None,
        }
        executions[execution_id] = execution

        return execution

    except json.JSONDecodeError as e:
        logger.error(f"Plan JSON parse error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse plan JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Plan generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/executions/{execution_id}/approve")
async def approve_execution(execution_id: str, background_tasks: BackgroundTasks, req: Request):
    """Approve a pending plan and kick off background execution."""
    body = await req.json()
    api_keys = body.get("apiKeys", {})
    model = body.get("model", "openrouter/google/gemini-2.0-flash-001")

    execution = executions.get(execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    if execution["status"] != "pending":
        raise HTTPException(status_code=400, detail=f"Cannot approve execution in '{execution['status']}' status")

    executions[execution_id]["status"] = "running"
    executions[execution_id]["started_at"] = datetime.utcnow().isoformat()

    background_tasks.add_task(run_agent_execution, execution_id, api_keys, model)

    return executions[execution_id]


@app.get("/api/agents/executions/{execution_id}")
async def get_execution(execution_id: str):
    """Get current state of an execution."""
    execution = executions.get(execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution


@app.delete("/api/agents/executions/{execution_id}")
async def delete_execution(execution_id: str):
    """Delete / reject an execution plan."""
    if execution_id not in executions:
        raise HTTPException(status_code=404, detail="Execution not found")
    executions.pop(execution_id)
    return {"success": True}


@app.post("/api/agents/executions/{execution_id}/cancel")
async def cancel_execution(execution_id: str):
    """Cancel a running execution."""
    execution = executions.get(execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    executions[execution_id]["status"] = "cancelled"
    return executions[execution_id]


@app.get("/api/agents/executions/{execution_id}/stream")
async def stream_execution_logs(execution_id: str):
    """SSE stream of execution logs for a given execution."""
    execution = executions.get(execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    async def log_generator():
        sent = 0
        max_polls = 120  # 2 min timeout
        for _ in range(max_polls):
            ex = executions.get(execution_id, {})
            logs = ex.get("execution_log", [])
            # Send any new logs
            for log in logs[sent:]:
                yield f"data: {json.dumps(log)}\n\n"
                sent = len(logs)
            # Terminal states
            if ex.get("status") in ("completed", "failed", "cancelled"):
                yield f"data: {json.dumps({'type': 'completion', 'status': ex['status'], 'result': ex.get('result')})}\n\n"
                break
            await asyncio.sleep(1)

    return StreamingResponse(log_generator(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/api/title")
async def generate_title(req: TitleRequest):
    """Generate a short conversation title from initial messages."""
    try:
        llm_kwargs = build_litellm_kwargs(req.apiKeys)
        messages = [
            {"role": "system", "content": "Generate a short 4-6 word title for this conversation. Return only the title text, no quotes or punctuation."},
        ] + [{"role": m.role, "content": m.content[:500]} for m in req.messages[:3]]

        response = completion_with_fallback(
            model=req.model,
            messages=messages,
            api_keys=req.apiKeys,
            stream=False,
            temperature=0.5,
            max_tokens=20,
            **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
        )
        title = response.choices[0].message.content.strip()
        return {"title": title}
    except Exception as e:
        logger.error(f"Title generation error: {e}")
        return {"title": "New Conversation"}


# ─── Background Agent Execution ───────────────────────────────────────────────
async def run_agent_execution(execution_id: str, api_keys: Dict[str, str], model: str):
    """Execute agent plan steps in the background, logging progress."""
    execution = executions.get(execution_id)
    if not execution:
        return

    def log(log_type: str, content: str, metadata: dict = None):
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": log_type,
            "content": content,
            "metadata": metadata or {},
        }
        executions[execution_id]["execution_log"].append(entry)
        logger.info(f"[{execution_id[:8]}] [{log_type}] {content[:100]}")

    try:
        plan = execution["plan"]
        goal = execution["goal"]
        agent_type = execution["agent_type"]
        llm_kwargs = build_litellm_kwargs(api_keys)
        persona = AGENT_PERSONAS.get(agent_type, AGENT_PERSONAS["general"])

        log("plan", f"Starting execution: {plan.get('title', goal)}", {"plan": plan})

        steps = plan.get("steps", [])
        step_results = []

        for step in steps:
            step_num = step.get("step", "?")
            action = step.get("action", "process")
            description = step.get("description", "")
            tool = step.get("tool", "llm")

            log("action", f"Step {step_num}: {description}", {"action": action, "tool": tool})

            step_result = ""

            # Web search tool
            if "search" in tool.lower() or "web" in tool.lower():
                search_query = f"{goal} - {description}"
                log("action", f"Searching: {search_query[:80]}")
                search_results = perform_web_search(search_query, max_results=3)
                step_result = search_results
                log("result", f"Search complete: {len(search_results)} chars", {"tool": "web_search"})

            # LLM tool (default)
            else:
                context = "\n\n".join(step_results[-2:]) if step_results else ""
                prompt = f"""You are executing step {step_num} of a {agent_type} task.

Goal: {goal}
Current step: {description}
Action: {action}

Previous context:
{context}

Complete this step thoroughly and professionally."""

                resp = completion_with_fallback(
                    model=model,
                    messages=[
                        {"role": "system", "content": persona},
                        {"role": "user", "content": prompt},
                    ],
                    api_keys=api_keys,
                    stream=False,
                    temperature=0.5,
                    max_tokens=1500,
                    **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
                )
                step_result = resp.choices[0].message.content
                log("result", f"Step {step_num} complete: {step_result[:120]}...")

            step_results.append(f"Step {step_num} ({action}): {step_result}")

        # Final synthesis
        log("action", "Synthesizing final result...")
        synthesis_prompt = f"""You completed all steps for this goal: "{goal}"

Step results:
{chr(10).join(step_results)}

Now provide a comprehensive, well-structured final answer that addresses the original goal."""

        final_resp = completion_with_fallback(
            model=model,
            messages=[
                {"role": "system", "content": persona},
                {"role": "user", "content": synthesis_prompt},
            ],
            api_keys=api_keys,
            stream=False,
            temperature=0.5,
            max_tokens=2000,
            **{k: v for k, v in llm_kwargs.items() if k != "api_key"},
        )
        final_result = final_resp.choices[0].message.content

        executions[execution_id].update({
            "status": "completed",
            "result": final_result,
            "completed_at": datetime.utcnow().isoformat(),
        })
        log("completion", "Execution completed successfully.")

    except Exception as e:
        logger.error(f"Execution error [{execution_id}]: {e}")
        executions[execution_id].update({
            "status": "failed",
            "result": str(e),
            "completed_at": datetime.utcnow().isoformat(),
        })
        executions[execution_id]["execution_log"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "type": "error",
            "content": str(e),
            "metadata": {},
        })


# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port, reload=False)
