"""
Backend Utilities - Validation Module
Provides data validation helpers for API requests
"""

from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field, validator
import re

class ValidationResult:
    """Result of validation operation"""
    
    def __init__(self, is_valid: bool, errors: List[str] = None):
        self.is_valid = is_valid
        self.errors = errors or []
    
    def __bool__(self):
        return self.is_valid

class StudentProfileValidator:
    """Validate student profile data"""
    
    MIN_GPA = 0.0
    MAX_GPA = 4.0
    MIN_IELTS = 0.0
    MAX_IELTS = 9.0
    MIN_BUDGET = 0
    MAX_BUDGET = 500000  # €500,000
    
    @classmethod
    def validate(cls, profile: Dict[str, Any]) -> ValidationResult:
        """
        Validate student profile
        
        Args:
            profile: Student profile dictionary
        
        Returns:
            ValidationResult object
        """
        errors = []
        
        # GPA validation
        if 'gpa' in profile:
            gpa = profile['gpa']
            if not isinstance(gpa, (int, float)):
                errors.append("GPA must be a number")
            elif not (cls.MIN_GPA <= gpa <= cls.MAX_GPA):
                errors.append(f"GPA must be between {cls.MIN_GPA} and {cls.MAX_GPA}")
        
        # IELTS validation
        if 'ielts' in profile:
            ielts = profile['ielts']
            if not isinstance(ielts, (int, float)):
                errors.append("IELTS score must be a number")
            elif not (cls.MIN_IELTS <= ielts <= cls.MAX_IELTS):
                errors.append(f"IELTS score must be between {cls.MIN_IELTS} and {cls.MAX_IELTS}")
        
        # Budget validation
        if 'budget' in profile:
            budget = profile['budget']
            if not isinstance(budget, (int, float)):
                errors.append("Budget must be a number")
            elif budget < cls.MIN_BUDGET or budget > cls.MAX_BUDGET:
                errors.append(f"Budget must be between €{cls.MIN_BUDGET} and €{cls.MAX_BUDGET}")
        
        # Country validation
        if 'country' in profile:
            if not isinstance(profile['country'], str):
                errors.append("Country must be a string")
            elif len(profile['country'].strip()) == 0:
                errors.append("Country cannot be empty")
        
        # Field validation
        if 'field' in profile:
            if not isinstance(profile['field'], str):
                errors.append("Field must be a string")
            elif len(profile['field'].strip()) == 0:
                errors.append("Field cannot be empty")
        
        return ValidationResult(len(errors) == 0, errors)

class UniversityFilterValidator:
    """Validate university filter parameters"""
    
    @classmethod
    def validate(cls, filters: Dict[str, Any]) -> ValidationResult:
        """
        Validate university filters
        
        Args:
            filters: Filter dictionary
        
        Returns:
            ValidationResult object
        """
        errors = []
        
        # Ranking range validation
        if 'minRanking' in filters and 'maxRanking' in filters:
            min_rank = filters['minRanking']
            max_rank = filters['maxRanking']
            if min_rank > max_rank:
                errors.append("Minimum ranking cannot be greater than maximum ranking")
        
        # Tuition range validation
        if 'minTuition' in filters and 'maxTuition' in filters:
            min_tuition = filters['minTuition']
            max_tuition = filters['maxTuition']
            if min_tuition > max_tuition:
                errors.append("Minimum tuition cannot be greater than maximum tuition")
            if min_tuition < 0 or max_tuition < 0:
                errors.append("Tuition values cannot be negative")
        
        # Admission chance validation
        if 'admissionChance' in filters:
            chance = filters['admissionChance']
            if not (0 <= chance <= 100):
                errors.append("Admission chance must be between 0 and 100")
        
        return ValidationResult(len(errors) == 0, errors)

class EmailValidator:
    """Validate email addresses"""
    
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    
    @classmethod
    def is_valid(cls, email: str) -> bool:
        """
        Validate email address
        
        Args:
            email: Email string
        
        Returns:
            True if valid, False otherwise
        """
        if not isinstance(email, str):
            return False
        return bool(cls.EMAIL_PATTERN.match(email))

class URLValidator:
    """Validate URLs"""
    
    URL_PATTERN = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP address
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    @classmethod
    def is_valid(cls, url: str) -> bool:
        """
        Validate URL
        
        Args:
            url: URL string
        
        Returns:
            True if valid, False otherwise
        """
        if not isinstance(url, str):
            return False
        return bool(cls.URL_PATTERN.match(url))

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> ValidationResult:
    """
    Validate that all required fields are present
    
    Args:
        data: Data dictionary
        required_fields: List of required field names
    
    Returns:
        ValidationResult object
    """
    errors = []
    for field in required_fields:
        if field not in data or data[field] is None:
            errors.append(f"'{field}' is required")
    
    return ValidationResult(len(errors) == 0, errors)

def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize string input
    
    Args:
        value: String to sanitize
        max_length: Maximum allowed length
    
    Returns:
        Sanitized string
    """
    # Strip whitespace
    value = value.strip()
    
    # Limit length
    if len(value) > max_length:
        value = value[:max_length]
    
    # Remove potentially harmful characters
    value = value.replace('<', '').replace('>', '').replace('&', '')
    
    return value
