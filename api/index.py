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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the backend FastAPI app
from app import app as backend_app

# Create a wrapper app that mounts the backend under /api
# This is needed because Vercel forwards the full path (e.g., /api/recommend)
# but the backend routes are defined without the /api prefix (e.g., /recommend)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the backend app so /api/recommend -> /recommend in backend_app
app.mount("/api", backend_app)
