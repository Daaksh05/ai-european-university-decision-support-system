"""
Advanced Analytics Routes (v2)
------------------------------
Optional new endpoints for advanced analytics.
Existing /recommend and /predict endpoints remain unchanged.

Endpoints:
- GET /api/v2/analytics/summary
- POST /api/v2/analytics/recommendations
- GET /api/v2/analytics/performance

Usage in app.py:
from routes.advanced_analytics import router as analytics_router
app.include_router(analytics_router, prefix="/api/v2")
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.analytics_service import analytics_service
try:
    import pandas as pd
except ImportError:
    pd = None

import os

router = APIRouter(tags=["analytics"])


class AnalyticsRequest(BaseModel):
    """Request model for analytics"""
    universities: List[Dict[str, Any]]
    recommendations: Optional[List[Dict[str, Any]]] = None


class AnalyticsSummary(BaseModel):
    """Response model for analytics"""
    status: str
    data: Dict[str, Any]


@router.post("/analytics/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(request: AnalyticsRequest):
    """
    Generate comprehensive analytics for a set of universities
    
    Args:
        request: AnalyticsRequest with universities list
        
    Returns:
        Analytics summary with cost, ranking, and distribution metrics
        
    Example:
        POST /api/v2/analytics/summary
        {
            "universities": [
                {"name": "MIT", "tuition_fee": 50000, "ranking": 1, ...},
                ...
            ]
        }
    """
    try:
        summary = analytics_service.get_analytics_summary(request.universities)
        return AnalyticsSummary(status="success", data=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analytics/recommendations")
async def analyze_recommendations(request: AnalyticsRequest):
    """
    Analyze recommendation quality metrics
    
    Args:
        request: AnalyticsRequest with recommendations list
        
    Returns:
        Recommendation quality metrics
    """
    try:
        metrics = analytics_service.get_recommendation_metrics(request.recommendations or [])
        return {
            "status": "success",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/performance")
async def get_performance_metrics():
    """
    Get system performance metrics
    
    Returns:
        Performance statistics (placeholder for future ML monitoring)
    """
    try:
        return {
            "status": "success",
            "metrics": {
                "api_status": "operational",
                "timestamp": pd.Timestamp.now().isoformat(),
                "models": {
                    "recommendation": {"status": "active"},
                    "prediction": {"status": "active"},
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analytics/compare")
async def compare_universities(universities: List[Dict[str, Any]]):
    """
    Compare multiple universities across metrics
    
    Args:
        universities: List of university objects to compare
        
    Returns:
        Comparison matrix and insights
    """
    try:
        if len(universities) < 2:
            raise ValueError("Need at least 2 universities to compare")

        comparison = {
            "status": "success",
            "universities_compared": len(universities),
            "metrics": {
                "cost_range": {
                    "min": min([u.get('tuition_fee', 0) for u in universities]),
                    "max": max([u.get('tuition_fee', 0) for u in universities]),
                },
                "rankings": sorted([u.get('ranking', 0) for u in universities]),
            }
        }
        return comparison
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
