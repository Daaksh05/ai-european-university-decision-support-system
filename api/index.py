"""
Vercel Serverless Function Entry Point
This file wraps the FastAPI backend app so Vercel can serve it as a serverless function.
"""
import sys
import os

# Add the backend directory to the Python path so all relative imports work
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Now import the FastAPI app from backend/app.py
from app import app

# Vercel expects the handler to be named 'app' or 'handler'
# FastAPI is ASGI-compatible, so Vercel auto-detects it
