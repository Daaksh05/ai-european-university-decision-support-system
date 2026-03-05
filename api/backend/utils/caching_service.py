"""
Backend Utilities - Caching Module
Provides in-memory and file-based caching for API responses
"""

import json
import hashlib
from typing import Any, Optional, Callable, Dict
from datetime import datetime, timedelta
from pathlib import Path
from functools import wraps
import pickle

CACHE_DIR = Path(__file__).parent.parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

class MemoryCache:
    """Simple in-memory cache with TTL support"""
    
    def __init__(self):
        self._cache: Dict[str, tuple] = {}  # {key: (value, expiry_time)}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key in self._cache:
            value, expiry_time = self._cache[key]
            if datetime.now() < expiry_time:
                return value
            else:
                del self._cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        """Store value in cache with TTL"""
        expiry_time = datetime.now() + timedelta(seconds=ttl_seconds)
        self._cache[key] = (value, expiry_time)
    
    def clear(self):
        """Clear all cache"""
        self._cache.clear()
    
    def delete(self, key: str):
        """Delete specific key from cache"""
        self._cache.pop(key, None)

class FileCache:
    """File-based cache for persistent storage"""
    
    @staticmethod
    def _get_cache_key(key: str) -> str:
        """Generate cache filename from key"""
        return hashlib.md5(key.encode()).hexdigest() + ".cache"
    
    @staticmethod
    def get(key: str, max_age_seconds: int = 3600) -> Optional[Any]:
        """Get value from file cache"""
        cache_file = CACHE_DIR / FileCache._get_cache_key(key)
        
        if cache_file.exists():
            file_age = (datetime.now() - datetime.fromtimestamp(cache_file.stat().st_mtime)).total_seconds()
            if file_age < max_age_seconds:
                try:
                    with open(cache_file, 'rb') as f:
                        return pickle.load(f)
                except Exception:
                    return None
            else:
                cache_file.unlink()
        return None
    
    @staticmethod
    def set(key: str, value: Any):
        """Store value in file cache"""
        cache_file = CACHE_DIR / FileCache._get_cache_key(key)
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(value, f)
        except Exception as e:
            print(f"Error writing to cache: {e}")
    
    @staticmethod
    def clear():
        """Clear all file cache"""
        for cache_file in CACHE_DIR.glob("*.cache"):
            cache_file.unlink()

# Global memory cache instance
memory_cache = MemoryCache()

def cache_response(key: str, ttl_seconds: int = 3600):
    """
    Decorator to cache function responses in memory
    
    Args:
        key: Cache key
        ttl_seconds: Time to live in seconds
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            cached_value = memory_cache.get(key)
            if cached_value is not None:
                return cached_value
            
            result = func(*args, **kwargs)
            memory_cache.set(key, result, ttl_seconds)
            return result
        return wrapper
    return decorator

def cache_result_by_args(ttl_seconds: int = 3600):
    """
    Decorator to cache results based on function arguments
    
    Args:
        ttl_seconds: Time to live in seconds
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}_{json.dumps({
                'args': str(args),
                'kwargs': str(sorted(kwargs.items()))
            }, default=str)}"
            
            cached_value = memory_cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            result = func(*args, **kwargs)
            memory_cache.set(cache_key, result, ttl_seconds)
            return result
        return wrapper
    return decorator
