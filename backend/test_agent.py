from app.agents.graph import build_graph

graph = build_graph()

result = graph.invoke({
    "destination": "Nagpur",
    "duration_days": 3,
    "travel_style": "budget",
    "user_id": "test",
    "raw_research": "",
    "safety_check": "",
    "itinerary_draft": {},
    "evaluation_score": 0,
    "evaluation_feedback": "",
    "final_itinerary": {},
    "error": None,
    "retry_count": 0
})



import json
print(json.dumps(result["final_itinerary"], indent=2))
print("Evaluation Score:", result.get("evaluation_score"))
print("Evaluation Feedback:", result.get("evaluation_feedback"))
print(result.keys())