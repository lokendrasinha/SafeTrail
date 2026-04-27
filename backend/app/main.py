from fastapi import FastAPI
from app.database import connect_to_mongo, close_mongo_connection
from app.routers.auth import router as auth_router
from app.routers.itinerary import router as itinerary_router
from fastapi.middleware.cors import CORSMiddleware





app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SafeTrail API is running 🚀"}


@app.on_event("startup")
async def startup():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()


app.include_router(auth_router)
app.include_router(itinerary_router)

@app.get("/health")
def health():
    return {"status": "ok"}
