from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from config import client
import os
import requests
import traceback
from dotenv import load_dotenv

# Load environment variables from .env file (force override to avoid truncated pre-set vars)
load_dotenv(override=True)

app = FastAPI(title="ServiceGPT API", version="1.0.0")

# --- Model selection for testing -------------------------------------------------
# Set MODEL_SWITCH to 'G' to use Gemini (testing), or 'O' to use the original client
# You can set these via your environment or .env file before starting the server.
MODEL_SWITCH = (os.getenv('MODEL_SWITCH', 'O') or 'O').strip().upper()
# If you plan to test with Gemini, provide GEMINI_API_KEY and GEMINI_ENDPOINT (see below)
GEMINI_API_KEY = (os.getenv('GEMINI_API_KEY', '') or '').strip()
GEMINI_ENDPOINT = (os.getenv('GEMINI_ENDPOINT', '') or '').strip()
# Default gemini model name (e.g. gemini-1.5-flash); override via GEMINI_MODEL env var if needed
GEMINI_MODEL = (os.getenv('GEMINI_MODEL', 'gemini-1.5-flash') or 'gemini-1.5-flash').strip()

# Defensive: if endpoint path model segment mismatches chosen GEMINI_MODEL and user didn't intentionally set,
# build a matching endpoint automatically (only if GEMINI_ENDPOINT contains a different model name pattern).
if GEMINI_ENDPOINT and GEMINI_MODEL not in GEMINI_ENDPOINT:
    # Attempt to normalize to v1beta models URL
    base = 'https://generativelanguage.googleapis.com/v1beta/models'
    # Keep suffix (e.g. :generateContent)
    suffix = ''
    if ':generateContent' in GEMINI_ENDPOINT:
        suffix = ':generateContent'
    GEMINI_ENDPOINT = f"{base}/{GEMINI_MODEL}{suffix}"


# Debug: Print current configuration
print(f"[CONFIG] MODEL_SWITCH: {MODEL_SWITCH}")
print(f"[CONFIG] GEMINI_MODEL: {GEMINI_MODEL}")
print(f"[CONFIG] GEMINI_ENDPOINT: {GEMINI_ENDPOINT}")
print(f"[CONFIG] GEMINI_API_KEY present: {bool(GEMINI_API_KEY)} length={len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
if GEMINI_API_KEY:
    print(f"[CONFIG] GEMINI_API_KEY preview: {GEMINI_API_KEY[:4]}...{GEMINI_API_KEY[-4:]}")
# ---------------------------------------------------------------------------------


def _invoke_model(model_name: str, input_text: str, use_search_tools: bool = False):
    """Invoke the configured model. By default this calls the existing `client.responses.create`.
    If MODEL_SWITCH == 'G' this will attempt to call the Gemini-style HTTP endpoint pointed to by
    GEMINI_ENDPOINT using GEMINI_API_KEY. The returned object will be either the original SDK
    response or a lightweight dict with fields compatible with the rest of this file (output_text, usage, model).
    """
    # Original (default) path: use existing client from config
    if MODEL_SWITCH != 'G':
        return client.responses.create(
            model=model_name,
            input=input_text,
            tools=[{"type": "web_search"}] if use_search_tools else None
        )

    # Gemini testing path: use a simple HTTP POST to GEMINI_ENDPOINT and return a dict-like response
    # NOTE: This is intended as a temporary, test-only shim. If you later remove Gemini support,
    # comment out the block below (everything inside this if MODEL_SWITCH == 'G') and set MODEL_SWITCH back to 'O'.
    if not GEMINI_ENDPOINT:
        raise RuntimeError('GEMINI_ENDPOINT not configured. Set GEMINI_ENDPOINT in .env (e.g. https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent)')
    # Gemini expects X-goog-api-key header and a contents/parts body per docs
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
    }

    print(f"[GEMINI DEBUG] Using API key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
    print(f"[GEMINI DEBUG] Using endpoint: {GEMINI_ENDPOINT}")
    print(f"[GEMINI DEBUG] Using model: {GEMINI_MODEL}")

    # Build the request body per the cURL example (no explicit model field in body)
    gemini_payload = {
        "contents": [ { "parts": [ { "text": input_text } ] } ]
    }

    # Use GEMINI_MODEL via endpoint URL (e.g., /gemini-2.5-pro:generateContent)
    resp = requests.post(GEMINI_ENDPOINT, headers=headers, json=gemini_payload, timeout=60)
    try:
        resp_json = resp.json()
    except Exception:
        # Fallback: return raw text
        print("[GEMINI DEBUG] response.text (non-json):", resp.text[:1000])
        return {
            'output_text': resp.text,
            'usage': {},
            'model': model_name
        }

    # Debug: print full Gemini raw response for diagnosis (temporary)
    try:
        print("[GEMINI DEBUG] raw response:", json.dumps(resp_json, indent=2)[:2000])
    except Exception:
        print("[GEMINI DEBUG] raw response (non-serializable)")

    # Check for Gemini errors and raise exception (no fallback - user controls model choice)
    if isinstance(resp_json, dict) and 'error' in resp_json:
        error_info = resp_json['error']
        if isinstance(error_info, dict):
            code = error_info.get('code')
            message = error_info.get('message', '')
            print(f"[GEMINI ERROR] Code {code}: {message}")
            raise RuntimeError(f"Gemini API error {code}: {message}")

    # Attempt to extract text from common Gemini response shapes
    out_text = None
    try:
        # Some Gemini responses include 'candidates' -> list -> each has 'content' -> list -> each has 'text'
        if isinstance(resp_json, dict):
            candidates = resp_json.get('candidates') or resp_json.get('outputs') or None
            if candidates and isinstance(candidates, list) and len(candidates) > 0:
                first = candidates[0]
                # support different nested keys
                content = first.get('content') or first.get('output') or first.get('message') or None
                # Content may be a dict with 'parts': [{text: ...}], or it may be a list of blocks.
                if isinstance(content, dict):
                    parts = content.get('parts') or content.get('blocks') or None
                    if isinstance(parts, list) and len(parts) > 0 and isinstance(parts[0], dict):
                        out_text = parts[0].get('text') or parts[0].get('content') or None
                    else:
                        # fallback to direct text fields
                        out_text = content.get('text') or content.get('content') or None
                elif isinstance(content, list) and len(content) > 0 and isinstance(content[0], dict):
                    out_text = content[0].get('text') or content[0].get('content') or None
                elif isinstance(first.get('content'), str):
                    out_text = first.get('content')

            # fallback common fields
            if not out_text:
                out_text = resp_json.get('output_text') or resp_json.get('text') or None
    except Exception:
        out_text = None

    # Extract usage information from Gemini response
    usage_info = {}
    if isinstance(resp_json, dict) and 'usageMetadata' in resp_json:
        usage_meta = resp_json['usageMetadata']
        input_tokens = usage_meta.get('promptTokenCount', 0)
        output_tokens = usage_meta.get('candidatesTokenCount', 0)
        total_tokens = usage_meta.get('totalTokenCount', input_tokens + output_tokens)
        usage_info = {
            'input_tokens': input_tokens,
            'output_tokens': output_tokens,
            'total_tokens': total_tokens
        }

    # Return normalized response that matches original client format exactly
    class GeminiResponse:
        def __init__(self, text, usage, model_name):
            self.output_text = text
            self.usage = self._create_usage_obj(usage)
            self.model = model_name

        def _create_usage_obj(self, usage_dict):
            class Usage:
                def __init__(self, usage_dict):
                    self.input_tokens = usage_dict.get('input_tokens', 0)
                    self.output_tokens = usage_dict.get('output_tokens', 0)
                    self.total_tokens = usage_dict.get('total_tokens', 0)
                    # Also support original OpenAI naming
                    self.prompt_tokens = self.input_tokens
                    self.completion_tokens = self.output_tokens
            return Usage(usage_dict)

    # Return normalized response that matches original client format exactly
    # Instantiate with positional args: output_text, usage dict, model name
    normalized_response = GeminiResponse(
        out_text or json.dumps(resp_json),
        usage_info,
        GEMINI_MODEL
    )
    return normalized_response


# Helpers: robustly extract text and usage from varying SDK shapes
def _get_response_text(resp):
    try:
        text = getattr(resp, 'output_text', None)
        if text:
            return text
        out = getattr(resp, 'output', None)
        if isinstance(out, list) and len(out) > 0:
            first = out[0]
            if isinstance(first, dict):
                # try find common nested fields
                content = first.get('content')
                if isinstance(content, list) and len(content) > 0 and isinstance(content[0], dict):
                    return content[0].get('text') or content[0].get('content') or json.dumps(content)
                return first.get('text') or json.dumps(first)
        # fallback to string
        return str(resp)
    except Exception:
        return ''


def _get_usage_info(resp):
    try:
        u = getattr(resp, 'usage', None)
        # try dict-like access
        if u is None and isinstance(resp, dict):
            u = resp.get('usage')
        if not u:
            return {}

        def _g(o, *names):
            for n in names:
                if isinstance(o, dict) and n in o:
                    return o[n]
                if hasattr(o, n):
                    return getattr(o, n)
            return 0

        input_tokens = _g(u, 'input_tokens', 'prompt_tokens') or 0
        output_tokens = _g(u, 'output_tokens', 'completion_tokens') or 0
        total_tokens = (input_tokens or 0) + (output_tokens or 0)
        return {
            'model': getattr(resp, 'model', None) or (resp.get('model') if isinstance(resp, dict) else None),
            'input_tokens': input_tokens,
            'output_tokens': output_tokens,
            'total_tokens': total_tokens
        }
    except Exception:
        return {}


# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    service: str
    location: str
    count: int = 3
    existing: list[str] = []  # optional list of already shown provider names for load-more

class NlpRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    providers: list
    usage_report: dict

class NlpResponse(BaseModel):
    valid: bool
    providers: list = []
    usage_report: dict = {}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
    # Build prompt using the same logic as inference.py
        query = f"""
Find the top {request.count} "{request.service}" specialists in "{request.location}".
If exact matches are not found, expand outward to the nearest areas and add a field "location_note": "NEARBY".
If information is sparse, still include it but mark with "confidence": "LOW".
Return ONLY valid JSON in this format:

[
  {{
    "name": "...",
    "phone": "...",
    "details": "...",
    "address": "...",
    "location_note": "EXACT or NEARBY",
    "confidence": "HIGH or LOW"
  }}
]
No extra commentary, only JSON.
"""

        # Call configured model (original client or Gemini test shim)
        # Use appropriate model based on MODEL_SWITCH
        model_to_use = GEMINI_MODEL if MODEL_SWITCH == 'G' else "gpt-4o"
        try:
            response = _invoke_model(model_to_use, query, use_search_tools=True)
        except Exception as e:
            tb = traceback.format_exc()
            print("LLM request failed:", e)
            print(tb)
            raise HTTPException(status_code=500, detail=f"LLM request failed: {str(e)}")

        # Helpers: robustly extract text and usage from varying SDK shapes
        def _get_response_text(resp):
            try:
                text = getattr(resp, 'output_text', None)
                if text:
                    return text
                out = getattr(resp, 'output', None)
                if isinstance(out, list) and len(out) > 0:
                    first = out[0]
                    if isinstance(first, dict):
                        # try find common nested fields
                        content = first.get('content')
                        if isinstance(content, list) and len(content) > 0 and isinstance(content[0], dict):
                            return content[0].get('text') or content[0].get('content') or json.dumps(content)
                        return first.get('text') or json.dumps(first)
                # fallback to string
                return str(resp)
            except Exception:
                return ''

        def _get_usage_info(resp):
            try:
                u = getattr(resp, 'usage', None)
                # try dict-like access
                if u is None and isinstance(resp, dict):
                    u = resp.get('usage')
                if not u:
                    return {}

                def _g(o, *names):
                    for n in names:
                        if isinstance(o, dict) and n in o:
                            return o[n]
                        if hasattr(o, n):
                            return getattr(o, n)
                    return 0

                input_tokens = _g(u, 'input_tokens', 'prompt_tokens') or 0
                output_tokens = _g(u, 'output_tokens', 'completion_tokens') or 0
                total_tokens = (input_tokens or 0) + (output_tokens or 0)
                return {
                    'model': getattr(resp, 'model', None) or (resp.get('model') if isinstance(resp, dict) else None),
                    'input_tokens': input_tokens,
                    'output_tokens': output_tokens,
                    'total_tokens': total_tokens
                }
            except Exception:
                return {}

        raw_text = _get_response_text(response)
        # Attempt to parse JSON, stripping code fences if necessary
        def _parse_providers(text: str):
            try:
                return json.loads(text)
            except Exception:
                # Strip markdown code fences (```json ... ```)
                import re
                m = re.search(r'```(?:json)?[\r\n]*(.*?)[\r\n]*```', text, flags=re.DOTALL)
                if m:
                    inner = m.group(1)
                    try:
                        return json.loads(inner)
                    except Exception:
                        pass
                return None

        parsed = _parse_providers(raw_text)
        if parsed is None:
            providers = [{
                "name": "Error",
                "phone": "N/A",
                "details": raw_text,
                "address": "N/A",
                "location_note": "ERROR",
                "confidence": "LOW"
            }]
        else:
            providers = parsed if isinstance(parsed, list) else []

        # --- Unified top-up logic (works for both OpenAI & Gemini) -----------------
        # Remove duplicates with existing list provided by client
        existing_client = { (n or '').strip().lower() for n in (request.existing or []) if isinstance(n, str) }
        deduped = []
        seen = set(existing_client)
        for p in providers:
            if isinstance(p, dict):
                nm = (p.get('name') or '').strip().lower()
                if nm and nm not in seen:
                    deduped.append(p)
                    seen.add(nm)
        providers = deduped

        # If we still need more, attempt incremental top-up attempts (max 2 passes)
        attempts = 0
        model_for_top_up = GEMINI_MODEL if MODEL_SWITCH == 'G' else 'gpt-4o'
        while isinstance(providers, list) and len(providers) < request.count and attempts < 2:
            remaining = request.count - len(providers)
            attempts += 1
            existing_names = [p.get('name') for p in providers if isinstance(p, dict) and p.get('name')]
            # Merge with client existing names
            combined_names = list({*(existing_names), *(request.existing or [])})
            top_up_prompt = f"""
You have already listed these service providers for {request.service} in {request.location}:
{json.dumps(combined_names, ensure_ascii=False)}

Please return ONLY {remaining} additional DISTINCT providers not in the list above. If you cannot find real ones, create plausible placeholders marked with \"confidence\": \"LOW\". Output strictly a JSON ARRAY (no backticks, no markdown) of provider objects in this schema:
[
  {{
    "name": "...",
    "phone": "...",
    "details": "...",
    "address": "...",
    "location_note": "EXACT or NEARBY",
    "confidence": "HIGH or LOW"
  }}
]
If none, return []. No commentary.
"""
            try:
                add_resp = _invoke_model(model_for_top_up, top_up_prompt, use_search_tools=True)
                add_text = _get_response_text(add_resp)
                print(f"[TOP-UP] attempt={attempts} remaining={remaining} raw_length={len(add_text)}")
                extra = _parse_providers(add_text)
                if isinstance(extra, list):
                    new_items = []
                    for p in extra:
                        if not isinstance(p, dict):
                            continue
                        nm = (p.get('name') or '').strip().lower()
                        if not nm or nm in seen:
                            continue
                        new_items.append(p)
                        seen.add(nm)
                    if new_items:
                        print(f"[TOP-UP] attempt={attempts} accepted_new={len(new_items)} total_before={len(providers)}")
                        providers.extend(new_items)
                        print(f"[TOP-UP] total_after={len(providers)}")
                else:
                    print('[TOP-UP] parse failed (attempt', attempts, ') raw:', add_text[:200])
            except Exception as tu_err:
                print('[TOP-UP] attempt failed:', tu_err)
                break
        # Trim to requested count
        if isinstance(providers, list) and len(providers) > request.count:
            providers = providers[:request.count]
        # --- end unified top-up ----------------------------------------------------

        # Gather usage info (outside top-up block)
        usage_info = _get_usage_info(response)
        print(f"[CHAT DEBUG] providers_final_count={len(providers) if isinstance(providers, list) else 'N/A'} input_tokens={usage_info.get('input_tokens', 0)} output_tokens={usage_info.get('output_tokens', 0)}")
        input_tokens = usage_info.get('input_tokens', 0) or 0
        output_tokens = usage_info.get('output_tokens', 0) or 0
        total_tokens = usage_info.get('total_tokens', input_tokens + output_tokens)

        # Pricing for gpt-4o
        input_cost_per_1k = 0.005
        output_cost_per_1k = 0.015
        cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)

        usage_report = {
            "model": usage_info.get('model') or getattr(response, 'model', None),
            "input_tokens": int(input_tokens),
            "output_tokens": int(output_tokens),
            "total_tokens": int(total_tokens),
            "estimated_cost_usd": round(cost, 6)
        }

        try:
            return ChatResponse(providers=providers, usage_report=usage_report)
        except Exception as build_err:
            print('[CHAT DEBUG] Failed constructing ChatResponse:', build_err)
            print('[CHAT DEBUG] providers sample:', providers[:2] if isinstance(providers, list) else providers)
            print('[CHAT DEBUG] usage_report:', usage_report)
            raise HTTPException(status_code=500, detail='Result formatting failure')
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nlp", response_model=NlpResponse)
async def nlp_endpoint(request: NlpRequest):
    try:
        # First, validate if the query is service-related
        validation_query = f"""
Analyze this query: "{request.query}"

Is this query asking for local service providers like electricians, plumbers, handymen, cleaners, mechanics, barbers, or similar home/personal services?

Return ONLY "VALID" or "INVALID" - nothing else.

Examples of VALID queries:
- "I need an electrician to fix my wiring"
- "Looking for a plumber in Chicago"
- "Find me a handyman near me"
- "I need a mechanic for car repair"
- "Looking for house cleaning services"
- "Need a barber for haircut"

Examples of INVALID queries:
- "What's the weather like?"
- "How to cook pasta?"
- "Tell me about artificial intelligence"
- "What's 2+2?"
- "Book a flight to New York"
"""

        # Call configured model for validation
        # Use appropriate model based on MODEL_SWITCH
        model_to_use = GEMINI_MODEL if MODEL_SWITCH == 'G' else "gpt-4o"
        try:
            validation_response = _invoke_model(model_to_use, validation_query, use_search_tools=False)
        except Exception as e:
            tb = traceback.format_exc()
            print("NLP validation request failed:", e)
            print(tb)
            raise HTTPException(status_code=500, detail=f"NLP validation failed: {str(e)}")

        # Extract text robustly
        def _get_text(resp):
            try:
                return getattr(resp, 'output_text', '') or ''
            except Exception:
                return ''

        is_valid = "VALID" in (_get_text(validation_response) or '').upper()

        if not is_valid:
            return NlpResponse(valid=False)

        # If valid, extract service info and find providers
        extraction_query = f"""
From this service request: "{request.query}"

Extract the service type, location, and determine a reasonable number of providers (default 3).

Then find providers using web search. Return ONLY valid JSON in this format:

{{
  "service": "extracted service type",
  "location": "extracted location or 'not specified'", 
  "count": 3,
  "providers": [
    {{
      "name": "...",
      "phone": "...",
      "details": "...",
      "address": "...",
      "location_note": "EXACT or NEARBY",
      "confidence": "HIGH or LOW"
    }}
  ]
}}

If location is not specified or unclear, search broadly in major cities worldwide.
When searching for services, prioritize local providers from the specified country/region.
For international locations outside the US, include country-specific service providers and local businesses.
No extra commentary, only JSON.
"""

        # Call configured model for extraction
        # Use appropriate model based on MODEL_SWITCH
        model_to_use = GEMINI_MODEL if MODEL_SWITCH == 'G' else "gpt-4o"
        try:
            response = _invoke_model(model_to_use, extraction_query, use_search_tools=True)
        except Exception as e:
            tb = traceback.format_exc()
            print("NLP extraction request failed:", e)
            print(tb)
            raise HTTPException(status_code=500, detail=f"NLP extraction failed: {str(e)}")

        raw_text = _get_response_text(response)
        try:
            data = json.loads(raw_text)
            providers = data.get("providers", [])
        except Exception:
            providers = []

        usage_info = _get_usage_info(response)
        input_tokens = usage_info.get('input_tokens', 0) or 0
        output_tokens = usage_info.get('output_tokens', 0) or 0
        total_tokens = usage_info.get('total_tokens', input_tokens + output_tokens)

        # Pricing for gpt-4o
        input_cost_per_1k = 0.005
        output_cost_per_1k = 0.015
        cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)

        usage_report = {
            "model": usage_info.get('model') or getattr(response, 'model', None),
            "input_tokens": int(input_tokens),
            "output_tokens": int(output_tokens),
            "total_tokens": int(total_tokens),
            "estimated_cost_usd": round(cost, 6)
        }

        return NlpResponse(valid=True, providers=providers, usage_report=usage_report)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "ServiceGPT API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)