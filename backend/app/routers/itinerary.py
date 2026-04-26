from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

from app.auth import get_current_user
from app.database import get_db
from app.agents.graph import build_graph

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])

graph = build_graph()


# =========================
# REQUEST MODEL
# =========================
class ItineraryRequest(BaseModel):
    destination: str
    days: int
    travel_style: str


# =========================
# GENERATE ITINERARY
# =========================
@router.post("/generate")
async def generate_itinerary(data: ItineraryRequest, user=Depends(get_current_user)):
    db = get_db()

    # 🔒 Validation
    if not data.destination.strip():
        raise HTTPException(status_code=400, detail="Destination cannot be empty")

    if data.days < 1 or data.days > 30:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 30")

    if data.travel_style not in ["budget", "luxury", "adventure", "culture"]:
        raise HTTPException(status_code=400, detail="Invalid travel style")

    # 🧠 Run AI Graph
    state = {
        "destination": data.destination,
        "duration_days": data.days,
        "travel_style": data.travel_style,
        "user_id": str(user["_id"]),

        "raw_research": "",
        "safety_check": "",
        "itinerary_draft": {},
        "evaluation_score": 0,
        "evaluation_feedback": "",
        "final_itinerary": {},
        "error": None,
        "retry_count": 0
    }

    result = graph.invoke(state)

    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    itinerary_data = result["final_itinerary"]

    # 💾 Save to MongoDB
    doc = {
        "user_id": str(user["_id"]),
        "destination": data.destination,
        "days": data.days,
        "data": itinerary_data,
        "created_at": datetime.utcnow(),
        "deleted_at": None
    }

    inserted = await db["itineraries"].insert_one(doc)

    return {
        "itinerary_id": str(inserted.inserted_id),
        "itinerary": itinerary_data
    }


# =========================
# GET HISTORY
# =========================
@router.get("/history")
async def get_history(user=Depends(get_current_user)):
    db = get_db()

    cursor = db["itineraries"].find({
        "user_id": str(user["_id"]),
        "deleted_at": None
    })

    results = []

    async for item in cursor:
        results.append({
            "id": str(item["_id"]),
            "destination": item["destination"],
            "days": item["days"],
            "created_at": item["created_at"]
        })

    return results


# =========================
# GET SINGLE ITINERARY
# =========================
@router.get("/{itinerary_id}")
async def get_itinerary(itinerary_id: str, user=Depends(get_current_user)):
    db = get_db()

    item = await db["itineraries"].find_one({
        "_id": ObjectId(itinerary_id),
        "user_id": str(user["_id"]),
        "deleted_at": None
    })

    if not item:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return {
        "id": str(item["_id"]),
        "data": item["data"]
    }


# =========================
# DELETE (SOFT DELETE)
# =========================
@router.delete("/{itinerary_id}")
async def delete_itinerary(itinerary_id: str, user=Depends(get_current_user)):
    db = get_db()

    result = await db["itineraries"].update_one(
        {
            "_id": ObjectId(itinerary_id),
            "user_id": str(user["_id"])
        },
        {
            "$set": {"deleted_at": datetime.utcnow()}
        }
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Not found or unauthorized")

    return {"message": "Itinerary deleted"}