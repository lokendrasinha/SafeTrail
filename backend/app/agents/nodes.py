import os
from langchain_groq import ChatGroq
import re
from dotenv import load_dotenv
from app.agents.tools import tavily_search

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
    api_key=os.getenv("GROQ_API_KEY")
)


# =========================
# PLANNER
# =========================
def planner_node(state):
    prompt = f"""
You are a travel planner.

Destination: {state['destination']}
Days: {state['duration_days']}
Style: {state['travel_style']}

Create a high-level plan in JSON.
"""

    response = llm.invoke(prompt)

    state["itinerary_draft"] = {"plan": response.content}
    return state


# =========================
# RESEARCH
# =========================
def research_node(state):
    destination = state["destination"]

    queries = [
        f"{destination} travel tips",
        f"{destination} safety for tourists",
        f"{destination} food must try"
    ]

    results = [tavily_search(q) for q in queries]
    state["raw_research"] = "\n".join(results)

    return state


# =========================
# SAFETY
# =========================
def safety_node(state):
    prompt = f"""
Check safety for travel plan:
{state['itinerary_draft']}
Research:
{state['raw_research']}
"""

    response = llm.invoke(prompt)

    state["safety_check"] = response.content

    # simple guardrail
    if "danger" in response.content.lower():
        state["error"] = "Destination may be unsafe"

    return state


# =========================
# EVALUATOR
# =========================
import re

def evaluator_node(state):
    prompt = f"""
Score this itinerary from 1 to 10:
{state['itinerary_draft']}

Return ONLY a number.
"""

    response = llm.invoke(prompt)

    text = response.content

    match = re.search(r"\d+(\.\d+)?", text)
    score = float(match.group()) if match else 7.0

    state["evaluation_score"] = score
    state["evaluation_feedback"] = text

    # ✅ CRITICAL FIX
    state["retry_count"] = state.get("retry_count", 0) + 1

    return state


# =========================
# FORMATTER
# =========================
import json
import re

def formatter_node(state):
    prompt = f"""
You are a strict JSON formatter.

Transform the given itinerary into EXACTLY this structure.

Return ONLY valid JSON. No explanation. No markdown.

Schema:
{{
  "destination": "string",
  "duration": "string",
  "summary": "string",
  "days": [
    {{
      "day": number,
      "theme": "string",
      "morning": {{
        "activity": "string",
        "location": "string",
        "tip": "string",
        "cost_estimate": "string"
      }},
      "afternoon": {{
        "activity": "string",
        "location": "string",
        "tip": "string",
        "cost_estimate": "string"
      }},
      "evening": {{
        "activity": "string",
        "location": "string",
        "tip": "string",
        "cost_estimate": "string"
      }},
      "meals": {{
        "breakfast": "string",
        "lunch": "string",
        "dinner": "string"
      }},
      "transport": "string",
      "accommodation": "string"
    }}
  ],
  "budget_summary": {{
    "daily_avg": "string",
    "total_estimate": "string",
    "currency": "INR"
  }},
  "safety_tips": ["string"],
  "best_time_to_visit": "string"
}}

Input:
{state['itinerary_draft']}
"""

    response = llm.invoke(prompt)

    raw = response.content.strip()
    cleaned = re.sub(r"```json|```", "", raw).strip()

    try:
        parsed = json.loads(cleaned)
        state["final_itinerary"] = parsed
    except Exception as e:
        state["final_itinerary"] = {
            "error": "parse_failed",
            "raw": raw,
            "debug": str(e)
        }

    return state