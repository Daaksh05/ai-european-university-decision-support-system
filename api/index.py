"""
Vercel Serverless Function Entry Point
Wraps the FastAPI backend app for Vercel serverless deployment.
"""
import sys
import os

# Add the backend directory to Python path so all relative imports work
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the backend FastAPI app
from app import app as backend_app

# Vercel sends the full request path (e.g., /api/recommend)
# but FastAPI routes are defined without /api prefix (e.g., /recommend)
# This ASGI middleware strips the /api prefix before routing
class StripApiPrefix:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            path = scope.get("path", "")
            if path.startswith("/api"):
                scope = dict(scope)
                scope["path"] = path[4:] or "/"
                # Also update raw_path if present
                raw_path = scope.get("raw_path")
                if raw_path and raw_path.startswith(b"/api"):
                    scope["raw_path"] = raw_path[4:] or b"/"
        await self.app(scope, receive, send)

app = StripApiPrefix(backend_app)
