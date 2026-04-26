import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def tavily_search(query: str) -> str:
    try:
        response = tavily.search(query=query, max_results=3)
        results = [r["content"] for r in response["results"]]
        return "\n".join(results)
    except Exception as e:
        return f"Search error: {str(e)}"


def get_weather(city: str) -> str:
    return f"Weather data for {city} (placeholder)"