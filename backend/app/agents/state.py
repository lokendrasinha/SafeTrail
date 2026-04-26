from typing import TypedDict, Dict, Any, Optional


class TravelState(TypedDict):
    destination: str
    duration_days: int
    travel_style: str
    user_id: str

    raw_research: str
    safety_check: str
    itinerary_draft: Dict[str, Any]

    evaluation_score: float
    evaluation_feedback: str

    final_itinerary: Dict[str, Any]

    error: Optional[str]
    retry_count: int