"""
Advanced Analytics Service
--------------------------
Optional service for generating analytics summaries.
Does not modify existing functionality - use alongside existing modules.

Features:
- Aggregate statistics
- Performance metrics
- User insights
- Trend analysis

Usage:
from services.analytics_service import AnalyticsService
service = AnalyticsService()
summary = service.get_analytics_summary(universities)
"""

from typing import List, Dict, Any
from datetime import datetime
from collections import Counter
import statistics


class AnalyticsService:
    """Provides analytics and insights without modifying existing logic"""

    def __init__(self):
        self.timestamp = datetime.now()

    def get_analytics_summary(self, universities: List[Dict]) -> Dict[str, Any]:
        """
        Generate comprehensive analytics summary
        
        Args:
            universities: List of university dictionaries
            
        Returns:
            Dictionary containing analytics metrics
        """
        if not universities:
            return self._empty_summary()

        try:
            tuitions = [uni.get('tuition_fee', 0) for uni in universities if uni.get('tuition_fee')]
            rankings = [uni.get('ranking', 0) for uni in universities if uni.get('ranking')]
            
            return {
                "generated_at": self.timestamp.isoformat(),
                "total_universities": len(universities),
                "cost_analysis": self._analyze_costs(tuitions),
                "ranking_analysis": self._analyze_rankings(rankings),
                "scholarship_stats": self._analyze_scholarships(universities),
                "program_stats": self._analyze_programs(universities),
                "country_distribution": self._get_country_distribution(universities),
            }
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": self.timestamp.isoformat()
            }

    def _empty_summary(self) -> Dict[str, Any]:
        return {
            "generated_at": self.timestamp.isoformat(),
            "total_universities": 0,
            "cost_analysis": {},
            "ranking_analysis": {},
            "scholarship_stats": {},
            "program_stats": {},
            "country_distribution": {},
        }

    def _analyze_costs(self, tuitions: List[float]) -> Dict[str, Any]:
        """Analyze tuition cost metrics"""
        if not tuitions:
            return {}
        
        return {
            "average": round(statistics.mean(tuitions), 2),
            "median": round(statistics.median(tuitions), 2),
            "min": min(tuitions),
            "max": max(tuitions),
            "std_dev": round(statistics.stdev(tuitions), 2) if len(tuitions) > 1 else 0,
        }

    def _analyze_rankings(self, rankings: List[int]) -> Dict[str, Any]:
        """Analyze ranking metrics"""
        if not rankings:
            return {}
        
        return {
            "average": round(statistics.mean(rankings), 1),
            "median": round(statistics.median(rankings), 1),
            "best": min(rankings),
            "worst": max(rankings),
        }

    def _analyze_scholarships(self, universities: List[Dict]) -> Dict[str, Any]:
        """Analyze scholarship availability"""
        total = len(universities)
        with_scholarships = sum(1 for uni in universities if uni.get('scholarship_available'))
        
        return {
            "total_universities": total,
            "with_scholarships": with_scholarships,
            "percentage": round((with_scholarships / total * 100), 1) if total > 0 else 0,
        }

    def _analyze_programs(self, universities: List[Dict]) -> Dict[str, Any]:
        """Analyze program distribution"""
        total_programs = sum(uni.get('programs_count', 0) for uni in universities)
        
        return {
            "total_programs": total_programs,
            "average_per_university": round(total_programs / len(universities), 1) if universities else 0,
        }

    def _get_country_distribution(self, universities: List[Dict]) -> Dict[str, int]:
        """Get distribution of universities by country"""
        countries = [uni.get('country', 'Unknown') for uni in universities]
        return dict(Counter(countries))

    def get_recommendation_metrics(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """
        Calculate metrics for recommendation quality
        
        Args:
            recommendations: List of recommendation results
            
        Returns:
            Quality metrics dictionary
        """
        if not recommendations:
            return {}

        match_scores = [rec.get('matchPercentage', 0) for rec in recommendations]
        
        return {
            "total_recommendations": len(recommendations),
            "average_match_score": round(statistics.mean(match_scores), 1),
            "median_match_score": round(statistics.median(match_scores), 1),
            "high_quality_matches": sum(1 for s in match_scores if s >= 75),
            "quality_distribution": {
                "excellent": sum(1 for s in match_scores if s >= 90),
                "very_good": sum(1 for s in match_scores if 80 <= s < 90),
                "good": sum(1 for s in match_scores if 70 <= s < 80),
                "acceptable": sum(1 for s in match_scores if s < 70),
            }
        }


# Export for easy imports
analytics_service = AnalyticsService()
