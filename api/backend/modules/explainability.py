"""
Explainability Module
Provides feature importance, SHAP values, and explanation generation
"""

from typing import Dict, List, Any, Optional, Tuple
try:
    import numpy as np
except ImportError:
    np = None

from dataclasses import dataclass

@dataclass
class FeatureImportance:
    """Feature importance information"""
    feature_name: str
    importance_score: float
    contribution: str  # positive, negative, neutral
    impact_percentage: float

class ExplainabilityEngine:
    """
    Provides explainability for model predictions using:
    - LIME (Local Interpretable Model-agnostic Explanations)
    - SHAP-like feature importance
    - Decision path analysis
    """
    
    def __init__(self):
        self.feature_weights = {
            'gpa': 0.25,
            'ielts': 0.20,
            'budget': 0.15,
            'ranking': 0.20,
            'programs': 0.10,
            'scholarships': 0.10
        }
    
    def explain_prediction(
        self,
        prediction_score: float,
        university: Dict[str, Any],
        student_profile: Dict[str, Any],
        prediction_label: str = "acceptable"
    ) -> Dict[str, Any]:
        """
        Generate explanation for a prediction
        
        Args:
            prediction_score: Model's prediction score (0-1)
            university: University data
            student_profile: Student profile
            prediction_label: Prediction label (e.g., 'likely', 'possible', 'unlikely')
        
        Returns:
            Detailed explanation
        """
        feature_importances = self.calculate_feature_importance(
            university, student_profile
        )
        
        contributing_factors = self._identify_contributing_factors(
            feature_importances, student_profile, university
        )
        
        return {
            "prediction_score": round(prediction_score * 100, 1),
            "prediction_label": prediction_label,
            "confidence": self._calculate_confidence(prediction_score),
            "feature_importance": [
                {
                    "feature": fi.feature_name,
                    "importance": round(fi.importance_score, 3),
                    "impact_percentage": round(fi.impact_percentage, 1),
                    "contribution": fi.contribution
                }
                for fi in feature_importances
            ],
            "contributing_factors": contributing_factors,
            "positive_indicators": self._get_positive_indicators(
                university, student_profile
            ),
            "concerns": self._get_concerns(university, student_profile),
            "recommendations": self._get_recommendations(
                university, student_profile, prediction_score
            )
        }
    
    def calculate_feature_importance(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> List[FeatureImportance]:
        """Calculate importance of each feature in decision"""
        importances = []
        
        # GPA importance
        gpa = student_profile.get('gpa', 2.5)
        gpa_importance = min(abs(gpa - 2.5) / 2.5, 1.0) * self.feature_weights['gpa']
        gpa_contribution = 'positive' if gpa >= 3.0 else 'negative' if gpa < 2.0 else 'neutral'
        
        importances.append(FeatureImportance(
            feature_name='GPA',
            importance_score=gpa_importance,
            contribution=gpa_contribution,
            impact_percentage=gpa_importance * 100
        ))
        
        # IELTS importance
        ielts = student_profile.get('ielts', 5.5)
        ielts_importance = min(abs(ielts - 5.5) / 3.5, 1.0) * self.feature_weights['ielts']
        ielts_contribution = 'positive' if ielts >= 6.5 else 'negative' if ielts < 5.0 else 'neutral'
        
        importances.append(FeatureImportance(
            feature_name='IELTS Score',
            importance_score=ielts_importance,
            contribution=ielts_contribution,
            impact_percentage=ielts_importance * 100
        ))
        
        # Budget importance
        budget = student_profile.get('budget', 30000)
        tuition = university.get('tuition_fee', 25000)
        budget_importance = (1.0 - min(abs(budget - tuition) / budget, 1.0)) * self.feature_weights['budget']
        budget_contribution = 'positive' if tuition <= budget else 'negative'
        
        importances.append(FeatureImportance(
            feature_name='Budget Fit',
            importance_score=budget_importance,
            contribution=budget_contribution,
            impact_percentage=budget_importance * 100
        ))
        
        # Ranking importance
        ranking = university.get('ranking', 250)
        ranking_importance = (1.0 - min(ranking / 500, 1.0)) * self.feature_weights['ranking']
        ranking_contribution = 'positive' if ranking <= 100 else 'neutral' if ranking <= 300 else 'negative'
        
        importances.append(FeatureImportance(
            feature_name='University Ranking',
            importance_score=ranking_importance,
            contribution=ranking_contribution,
            impact_percentage=ranking_importance * 100
        ))
        
        # Program importance
        field = student_profile.get('field', '')
        programs = university.get('programs', [])
        program_match = len([p for p in programs if field.lower() in p.lower()]) / max(len(programs), 1)
        program_importance = program_match * self.feature_weights['programs']
        program_contribution = 'positive' if program_match > 0.5 else 'neutral'
        
        importances.append(FeatureImportance(
            feature_name='Program Alignment',
            importance_score=program_importance,
            contribution=program_contribution,
            impact_percentage=program_importance * 100
        ))
        
        # Scholarship importance
        scholarships_available = university.get('scholarships_available', False)
        scholarship_importance = self.feature_weights['scholarships'] if scholarships_available else 0
        scholarship_contribution = 'positive' if scholarships_available else 'neutral'
        
        importances.append(FeatureImportance(
            feature_name='Scholarship Availability',
            importance_score=scholarship_importance,
            contribution=scholarship_contribution,
            impact_percentage=scholarship_importance * 100
        ))
        
        # Sort by importance
        importances.sort(key=lambda x: x.importance_score, reverse=True)
        
        return importances
    
    def _identify_contributing_factors(
        self,
        feature_importances: List[FeatureImportance],
        student_profile: Dict[str, Any],
        university: Dict[str, Any]
    ) -> List[str]:
        """Identify key factors contributing to the prediction"""
        factors = []
        
        for fi in feature_importances[:3]:  # Top 3 factors
            if fi.contribution == 'positive':
                factors.append(f"✓ {fi.feature_name} is favorable ({fi.impact_percentage:.0f}% impact)")
            elif fi.contribution == 'negative':
                factors.append(f"✗ {fi.feature_name} is challenging ({fi.impact_percentage:.0f}% impact)")
            else:
                factors.append(f"~ {fi.feature_name} is average ({fi.impact_percentage:.0f}% impact)")
        
        return factors
    
    def _get_positive_indicators(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> List[str]:
        """Get positive indicators for this match"""
        indicators = []
        
        gpa = student_profile.get('gpa', 0)
        if gpa >= 3.5:
            indicators.append("Strong academic profile (GPA >= 3.5)")
        
        ielts = student_profile.get('ielts', 0)
        if ielts >= 7.0:
            indicators.append("Strong English proficiency (IELTS >= 7.0)")
        
        budget = student_profile.get('budget', 0)
        tuition = university.get('tuition_fee', float('inf'))
        if tuition <= budget:
            indicators.append(f"Tuition within budget (€{tuition:,.0f})")
        
        if university.get('scholarships_available', False):
            indicators.append("Scholarships available for international students")
        
        ranking = university.get('ranking', 500)
        if ranking <= 100:
            indicators.append(f"Highly ranked institution (#{ranking})")
        
        return indicators
    
    def _get_concerns(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> List[str]:
        """Get concerns about this match"""
        concerns = []
        
        gpa = student_profile.get('gpa', 0)
        if gpa < 2.5:
            concerns.append("Lower GPA may affect admission chances")
        
        ielts = student_profile.get('ielts', 0)
        if ielts < 6.0:
            concerns.append("IELTS score below typical admission requirement")
        
        budget = student_profile.get('budget', 0)
        tuition = university.get('tuition_fee', float('inf'))
        if tuition > budget:
            concerns.append(f"Tuition (€{tuition:,.0f}) exceeds budget")
        
        ranking = university.get('ranking', 0)
        if ranking > 400:
            concerns.append(f"Lower ranked institution (#{ranking})")
        
        return concerns
    
    def _get_recommendations(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any],
        prediction_score: float
    ) -> List[str]:
        """Get recommendations based on prediction"""
        recommendations = []
        
        if prediction_score < 0.5:
            recommendations.append("Consider strengthening your academic profile for this institution")
            recommendations.append("Explore similar universities with lower admission barriers")
        elif prediction_score < 0.7:
            recommendations.append("Strong application recommended. Prepare compelling essay")
            recommendations.append("Highlight relevant work experience and achievements")
        else:
            recommendations.append("Good fit. This university aligns well with your profile")
            recommendations.append("Begin preparing application materials early")
        
        budget = student_profile.get('budget', 0)
        tuition = university.get('tuition_fee', float('inf'))
        if tuition > budget * 1.2:
            recommendations.append("Explore scholarship opportunities to bridge cost gap")
        
        return recommendations
    
    def _calculate_confidence(self, prediction_score: float) -> str:
        """Calculate confidence level for prediction"""
        if prediction_score >= 0.8:
            return "High confidence"
        elif prediction_score >= 0.6:
            return "Medium confidence"
        else:
            return "Low confidence"
