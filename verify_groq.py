
import os
import asyncio
from groq import Groq
from dotenv import load_dotenv

# Path to the .env file in the backend directory
env_path = os.path.join(os.getcwd(), "backend", ".env")
load_dotenv(env_path)

async def test_groq():
    api_key = os.getenv("GROQ_API_KEY")
    print(f"Using API Key: {api_key[:10]}...")
    
    if not api_key:
        print("❌ Error: GROQ_API_KEY not found in .env")
        return

    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Say hello!",
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        print(f"✅ Success! Groq response: {chat_completion.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Groq API Call Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_groq())
