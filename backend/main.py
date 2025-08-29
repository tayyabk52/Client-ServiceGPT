from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from config import client

app = FastAPI(title="ServiceGPT API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    service: str
    location: str
    count: int = 3

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

        # Call OpenAI API with web search
        response = client.responses.create(
            model="gpt-4o",
            input=query,
            tools=[{"type": "web_search"}]
        )

        # Parse response
        try:
            providers = json.loads(response.output_text)
        except json.JSONDecodeError:
            # If JSON parsing fails, return raw output wrapped in error format
            providers = [{"name": "Error", "phone": "N/A", "details": response.output_text, "address": "N/A", "location_note": "ERROR", "confidence": "LOW"}]

        # Calculate usage report
        usage = response.usage
        input_tokens = usage.input_tokens
        output_tokens = usage.output_tokens
        total_tokens = input_tokens + output_tokens

        # Pricing for gpt-4o
        input_cost_per_1k = 0.005
        output_cost_per_1k = 0.015
        cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)

        usage_report = {
            "model": response.model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "estimated_cost_usd": round(cost, 6)
        }

        return ChatResponse(providers=providers, usage_report=usage_report)
    
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

        # Call OpenAI to validate the query
        validation_response = client.responses.create(
            model="gpt-4o",
            input=validation_query
        )

        is_valid = "VALID" in validation_response.output_text.upper()

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

If location is not specified or unclear, search broadly in major US cities.
No extra commentary, only JSON.
"""

        # Call OpenAI API with web search
        response = client.responses.create(
            model="gpt-4o",
            input=extraction_query,
            tools=[{"type": "web_search"}]
        )

        # Parse response
        try:
            data = json.loads(response.output_text)
            providers = data.get("providers", [])
        except json.JSONDecodeError:
            providers = []

        # Calculate usage report
        usage = response.usage
        input_tokens = usage.input_tokens
        output_tokens = usage.output_tokens
        total_tokens = input_tokens + output_tokens

        # Pricing for gpt-4o
        input_cost_per_1k = 0.005
        output_cost_per_1k = 0.015
        cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)

        usage_report = {
            "model": response.model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
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