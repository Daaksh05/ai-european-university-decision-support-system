"""
Enhanced Recommendation Module - Hybrid Approach
Combines ML predictions with rule-based ranking for better recommendations
"""

from typing import List, Dict, Any, Optional
try:
    import numpy as np
except ImportError:
    np = None

from dataclasses import dataclass

@dataclass
class ScoredUniversity:
    """University with scoring components"""
    university_id: str
    name: str
    ml_score: float
    rule_score: float
    combined_score: float
    acceptance_probability: float
    cost_fit: float

class HybridRecommendationEngine:
    """
    Hybrid recommendation engine combining:
    - ML-based predictions
    - Rule-based scoring
    - Constraint satisfaction
    """
    
    def __init__(self):
        self.ml_weight = 0.6  # Weight for ML predictions
        self.rule_weight = 0.4  # Weight for rule-based scoring
    
    def score_university(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any],
        ml_prediction: float = None
    ) -> ScoredUniversity:
        """
        Score a single university using hybrid approach
        
        Args:
            university: University data
            student_profile: Student profile
            ml_prediction: ML model's prediction score (if available)
        
        Returns:
            Scored university with all components
        """
        # ML Score (from existing model)
        ml_score = ml_prediction if ml_prediction else self._get_ml_score(
            university, student_profile
        )
        
        # Rule-based Score
        rule_score = self._calculate_rule_score(university, student_profile)
        
        # Combined Score
        combined_score = (
            self.ml_weight * ml_score +
            self.rule_weight * rule_score
        )
        
        return ScoredUniversity(
            university_id=university.get('id'),
            name=university.get('name'),
            ml_score=ml_score,
            rule_score=rule_score,
            combined_score=combined_score,
            acceptance_probability=ml_score * 100,  # Convert to percentage
            cost_fit=self._calculate_cost_fit(university, student_profile)
        )
    
    def _get_ml_score(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> float:
        """Get ML model's prediction score"""
        # TODO: Call existing admission_prediction module
        # For now, placeholder using simple heuristics
        
        gpa_fit = min(1.0, (student_profile.get('gpa', 0) / 4.0))
        ielts_fit = min(1.0, (student_profile.get('ielts', 0) / 9.0))
        
        # Average the fits with some weighting
        ml_score = (gpa_fit * 0.6 + ielts_fit * 0.4)
        
        return np.clip(ml_score, 0, 1)
    
    def _calculate_rule_score(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> float:
        """Calculate rule-based score"""
        score = 0.5  # Base score
        
        # Ranking factor (lower ranking = better)
        ranking = university.get('ranking', 500)
        ranking_score = 1.0 - min(1.0, ranking / 500)
        score += ranking_score * 0.2
        
        # Cost factor
        budget = student_profile.get('budget', float('inf'))
        tuition = university.get('tuition_fee', 50000)
        cost_score = 1.0 if tuition <= budget else max(0, 1.0 - (tuition - budget) / budget)
        score += cost_score * 0.2
        
        # Field match (if field information available)
        if 'field' in student_profile and 'programs' in university:
            field_match = self._calculate_field_match(
                student_profile['field'],
                university['programs']
            )
            score += field_match * 0.2
        
        # Country preference
        if student_profile.get('country') == university.get('country'):
            score += 0.1
        
        return np.clip(score, 0, 1)
    
    def _calculate_cost_fit(
        self,
        university: Dict[str, Any],
        student_profile: Dict[str, Any]
    ) -> float:
        """Calculate how well cost fits student budget"""
        budget = student_profile.get('budget', 50000)
        tuition = university.get('tuition_fee', 25000)
        
        if tuition <= budget:
            return min(1.0, (tuition / budget) + 0.5)
        else:
            return max(0, 1.0 - (tuition - budget) / budget)
    
    def _calculate_field_match(
        self,
        student_field: str,
        university_programs: List[str]
    ) -> float:
        """Calculate field match score"""
        if not university_programs:
            return 0.5
        
        # Simple string matching for now
        # TODO: Use more sophisticated NLP-based matching
        student_field_lower = student_field.lower()
        matches = sum(
            1 for program in university_programs
            if student_field_lower in program.lower()
        )
        
        return min(1.0, matches / len(university_programs))
    
    def rank_universities(
        self,
        universities: List[Dict[str, Any]],
        student_profile: Dict[str, Any],
        sort_by: str = "combined_score",
        top_k: Optional[int] = None
    ) -> List[ScoredUniversity]:
        """
        Rank universities using hybrid approach
        
        Args:
            universities: List of universities
            student_profile: Student profile
            sort_by: Sorting criterion (combined_score, acceptance_probability, cost_fit)
            top_k: Return only top k universities
        
        Returns:
            Ranked list of scored universities
        """
        scored = [
            self.score_university(uni, student_profile)
            for uni in universities
        ]
        
        # Sort by specified criterion
        if sort_by == "acceptance_probability":
            scored.sort(key=lambda x: x.acceptance_probability, reverse=True)
        elif sort_by == "cost_fit":
            scored.sort(key=lambda x: x.cost_fit, reverse=True)
        else:  # combined_score (default)
            scored.sort(key=lambda x: x.combined_score, reverse=True)
        
        if top_k:
            scored = scored[:top_k]
        
        return scored
