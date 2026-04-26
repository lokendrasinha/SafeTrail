import asyncio
from app.database import connect_to_mongo, create_indexes

async def test():
    await connect_to_mongo()
    await create_indexes()

asyncio.run(test())