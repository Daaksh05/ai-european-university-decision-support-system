"""
Evaluation Metrics Module
Provides evaluation metrics for recommendation quality without affecting current outputs
"""

from typing import List, Dict, Tuple, Optional
try:
    import numpy as np
except ImportError:
    np = None

from dataclasses import dataclass

@dataclass
class EvaluationMetrics:
    """Evaluation metrics container"""
    precision_at_k: Dict[int, float]  # P@1, P@5, P@10
    ndcg: float  # Normalized Discounted Cumulative Gain
    mrr: float  # Mean Reciprocal Rank
    map_score: float  # Mean Average Precision
    recall_at_k: Dict[int, float]
    f1_score: float

class RecommendationEvaluator:
    """
    Evaluate recommendation quality and ranking effectiveness
    
    Metrics implemented:
    - Precision@K: What fraction of top K recommendations are relevant
    - NDCG: How well recommendations are ranked
    - MRR: Position of first relevant item
    - MAP: Average precision across multiple queries
    """
    
    @staticmethod
    def precision_at_k(
        recommendations: List[int],
        ground_truth: List[int],
        k: int = 10
    ) -> float:
        """
        Calculate Precision@K
        
        Args:
            recommendations: Ranked list of recommended item IDs
            ground_truth: List of relevant item IDs
            k: Cutoff for evaluation
        
        Returns:
            Precision@K score
        """
        if k == 0:
            return 0.0
        
        top_k = recommendations[:k]
        hits = len(set(top_k) & set(ground_truth))
        
        return hits / k
    
    @staticmethod
    def recall_at_k(
        recommendations: List[int],
        ground_truth: List[int],
        k: int = 10
    ) -> float:
        """
        Calculate Recall@K
        
        Args:
            recommendations: Ranked list of recommended item IDs
            ground_truth: List of relevant item IDs
            k: Cutoff for evaluation
        
        Returns:
            Recall@K score
        """
        if len(ground_truth) == 0:
            return 0.0
        
        top_k = recommendations[:k]
        hits = len(set(top_k) & set(ground_truth))
        
        return hits / len(ground_truth)
    
    @staticmethod
    def ndcg_at_k(
        recommendations: List[Tuple[int, float]],
        ground_truth: List[int],
        k: int = 10
    ) -> float:
        """
        Calculate Normalized Discounted Cumulative Gain (NDCG@K)
        
        Measures ranking quality considering both relevance and position.
        Perfect ranking gets score 1.0
        
        Args:
            recommendations: List of (item_id, score) tuples, ordered by recommendation
            ground_truth: List of relevant item IDs
            k: Cutoff for evaluation
        
        Returns:
            NDCG@K score (0-1)
        """
        # Actual DCG
        dcg = 0.0
        for i, (item_id, score) in enumerate(recommendations[:k]):
            if item_id in ground_truth:
                rel = 1.0
                dcg += rel / np.log2(i + 2)  # log2(i+2) for 1-based indexing
        
        # Ideal DCG (all relevant items at top)
        idcg = 0.0
        for i in range(min(len(ground_truth), k)):
            idcg += 1.0 / np.log2(i + 2)
        
        if idcg == 0:
            return 0.0
        
        return dcg / idcg
    
    @staticmethod
    def mrr(
        recommendations: List[int],
        ground_truth: List[int]
    ) -> float:
        """
        Calculate Mean Reciprocal Rank (MRR)
        
        Position of the first relevant recommendation
        
        Args:
            recommendations: Ranked list of recommended item IDs
            ground_truth: List of relevant item IDs
        
        Returns:
            MRR score (0-1)
        """
        for i, item_id in enumerate(recommendations):
            if item_id in ground_truth:
                return 1.0 / (i + 1)
        
        return 0.0
    
    @staticmethod
    def map_score(
        all_recommendations: List[List[int]],
        all_ground_truths: List[List[int]],
        k: int = 10
    ) -> float:
        """
        Calculate Mean Average Precision (MAP@K)
        
        Average of precision at each relevant position across multiple queries
        
        Args:
            all_recommendations: List of recommendation lists
            all_ground_truths: List of ground truth lists
            k: Cutoff for evaluation
        
        Returns:
            MAP@K score
        """
        average_precisions = []
        
        for recommendations, ground_truth in zip(all_recommendations, all_ground_truths):
            if len(ground_truth) == 0:
                continue
            
            precisions = []
            num_hits = 0
            
            for i, item_id in enumerate(recommendations[:k]):
                if item_id in ground_truth:
                    num_hits += 1
                    precisions.append(num_hits / (i + 1))
            
            if len(precisions) > 0:
                average_precisions.append(sum(precisions) / len(ground_truth))
            else:
                average_precisions.append(0.0)
        
        if len(average_precisions) == 0:
            return 0.0
        
        return np.mean(average_precisions)
    
    @staticmethod
    def f1_score(
        recommendations: List[int],
        ground_truth: List[int],
        k: int = 10
    ) -> float:
        """
        Calculate F1 Score
        
        Harmonic mean of precision and recall
        
        Args:
            recommendations: Ranked list of recommended item IDs
            ground_truth: List of relevant item IDs
            k: Cutoff for evaluation
        
        Returns:
            F1 score (0-1)
        """
        precision = RecommendationEvaluator.precision_at_k(recommendations, ground_truth, k)
        recall = RecommendationEvaluator.recall_at_k(recommendations, ground_truth, k)
        
        if precision + recall == 0:
            return 0.0
        
        return 2 * (precision * recall) / (precision + recall)
    
    @staticmethod
    def evaluate(
        recommendations: List[Tuple[int, float]],
        ground_truth: List[int],
        k_values: List[int] = [1, 5, 10]
    ) -> EvaluationMetrics:
        """
        Comprehensive evaluation of recommendations
        
        Args:
            recommendations: List of (item_id, score) tuples
            ground_truth: List of relevant item IDs
            k_values: List of k values for @K metrics
        
        Returns:
            EvaluationMetrics object with all metrics
        """
        recommendation_ids = [item_id for item_id, _ in recommendations]
        
        precision_scores = {
            k: RecommendationEvaluator.precision_at_k(recommendation_ids, ground_truth, k)
            for k in k_values
        }
        
        recall_scores = {
            k: RecommendationEvaluator.recall_at_k(recommendation_ids, ground_truth, k)
            for k in k_values
        }
        
        ndcg_score = RecommendationEvaluator.ndcg_at_k(recommendations, ground_truth, k_values[-1])
        mrr_score = RecommendationEvaluator.mrr(recommendation_ids, ground_truth)
        map_result = RecommendationEvaluator.map_score(
            [recommendation_ids], [ground_truth], k_values[-1]
        )
        f1 = RecommendationEvaluator.f1_score(
            recommendation_ids, ground_truth, k_values[-1]
        )
        
        return EvaluationMetrics(
            precision_at_k=precision_scores,
            recall_at_k=recall_scores,
            ndcg=ndcg_score,
            mrr=mrr_score,
            map_score=map_result,
            f1_score=f1
        )

class PredictionEvaluator:
    """Evaluate prediction quality"""
    
    @staticmethod
    def confusion_matrix(
        predictions: List[int],
        ground_truth: List[int]
    ) -> Dict[str, int]:
        """Calculate confusion matrix"""
        if len(predictions) != len(ground_truth):
            raise ValueError("Predictions and ground truth must have same length")
        
        tp = sum(1 for p, g in zip(predictions, ground_truth) if p == 1 and g == 1)
        tn = sum(1 for p, g in zip(predictions, ground_truth) if p == 0 and g == 0)
        fp = sum(1 for p, g in zip(predictions, ground_truth) if p == 1 and g == 0)
        fn = sum(1 for p, g in zip(predictions, ground_truth) if p == 0 and g == 1)
        
        return {
            "true_positives": tp,
            "true_negatives": tn,
            "false_positives": fp,
            "false_negatives": fn
        }
    
    @staticmethod
    def accuracy(predictions: List[int], ground_truth: List[int]) -> float:
        """Calculate accuracy"""
        if len(predictions) != len(ground_truth):
            raise ValueError("Predictions and ground truth must have same length")
        
        correct = sum(1 for p, g in zip(predictions, ground_truth) if p == g)
        return correct / len(predictions)
    
    @staticmethod
    def precision(predictions: List[int], ground_truth: List[int]) -> float:
        """Calculate precision"""
        cm = PredictionEvaluator.confusion_matrix(predictions, ground_truth)
        if cm["true_positives"] + cm["false_positives"] == 0:
            return 0.0
        return cm["true_positives"] / (cm["true_positives"] + cm["false_positives"])
    
    @staticmethod
    def recall(predictions: List[int], ground_truth: List[int]) -> float:
        """Calculate recall"""
        cm = PredictionEvaluator.confusion_matrix(predictions, ground_truth)
        if cm["true_positives"] + cm["false_negatives"] == 0:
            return 0.0
        return cm["true_positives"] / (cm["true_positives"] + cm["false_negatives"])
