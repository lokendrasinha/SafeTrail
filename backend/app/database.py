import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Global variables
client = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["safetrail"]  # Database name
    print("✅ Connected to MongoDB")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ Disconnected from MongoDB")


def get_db():
    return db


async def create_indexes():
    await db["users"].create_index("username", unique=True)
    print("✅ Indexes created")