from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.routers.auth import router as auth_router
from app.routers.itinerary import router as itinerary_router
from fastapi.middleware.cors import CORSMiddleware


# =========================
# LIFESPAN (NEW WAY)
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting SafeTrail backend...")

    await connect_to_mongo()

    yield  # app runs here

    print("🛑 Shutting down SafeTrail backend...")
    await close_mongo_connection()


app = FastAPI(lifespan=lifespan)


# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTES
# =========================
@app.get("/")
def root():
    return {"message": "SafeTrail API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(itinerary_router)