import asyncio
import os
import sys

# Add backend to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.groq_service import groq_service

async def test_groq():
    print("Testing Groq Integration...")
    if not groq_service.client:
        print("❌ Error: Groq client not initialized. Check your .env file and GROQ_API_KEY.")
        return

    prompt = "Tell me one high-ranking university in Germany for AI research."
    print(f"Prompt: {prompt}")
    
    response = await groq_service.generate_response(prompt)
    
    if response:
        print("\n✅ Groq Response received:")
        print("-" * 30)
        print(response)
        print("-" * 30)
    else:
        print("❌ Failed to get a response from Groq.")

if __name__ == "__main__":
    asyncio.run(test_groq())
