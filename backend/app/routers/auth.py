import re
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from app.database import get_db
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# REQUEST MODELS
# =========================
class SignupRequest(BaseModel):
    username: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# VALIDATION HELPERS
# =========================
def validate_username(username: str):
    if not re.match(r"^[a-zA-Z0-9_]{3,20}$", username):
        raise HTTPException(
            status_code=422,
            detail="Username must be 3-20 characters and alphanumeric/underscore only"
        )


def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        raise HTTPException(status_code=422, detail="Password must contain letters and numbers")


# =========================
# SIGNUP
# =========================
@router.post("/signup", status_code=201)
async def signup(data: SignupRequest):
    db = get_db()

    validate_username(data.username)
    validate_password(data.password)

    if data.password != data.confirm_password:
        raise HTTPException(status_code=422, detail="Passwords do not match")

    existing = await db["users"].find_one({"username": data.username})
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed = hash_password(data.password)

    user = {
        "username": data.username,
        "hashed_password": hashed
    }

    result = await db["users"].insert_one(user)

    token = create_access_token({"user_id": str(result.inserted_id)})

    return {
        "message": "User created successfully",
        "token": token,
        "username": data.username
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
async def login(data: LoginRequest):
    db = get_db()

    user = await db["users"].find_one({"username": data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"user_id": str(user["_id"])})

    return {
        "token": token,
        "username": user["username"]
    }


# =========================
# GET CURRENT USER
# =========================
@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "username": user["username"],
        "user_id": str(user["_id"])
    }