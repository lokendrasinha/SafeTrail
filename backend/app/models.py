from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId


# Helper for MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


# =========================
# USER MODEL
# =========================
class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# =========================
# ITINERARY MODEL
# =========================
class Itinerary(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: str
    destination: str
    days: int
    data: Dict[str, Any]  # AI generated itinerary
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# =========================
# SESSION MODEL
# =========================
class Session(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: str
    token: str
    expires_at: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}