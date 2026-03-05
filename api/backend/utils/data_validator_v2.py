"""
Advanced Validation Service (v2)
---------------------------------
Optional enhanced validation utilities.
Does not modify existing validation - use in new features.

Features:
- Schema validation
- Type checking
- Input sanitization
- Error messaging
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, validator


class UniversityValidationSchema(BaseModel):
    """Enhanced university validation schema"""
    name: str
    country: str
    city: str
    ranking: Optional[int] = None
    tuition_fee: Optional[float] = None
    acceptance_rate: Optional[float] = None
    programs_count: Optional[int] = None
    scholarship_available: Optional[bool] = False
    top_programs: Optional[List[str]] = []

    @validator('tuition_fee')
    def validate_tuition(cls, v):
        if v is not None and v < 0:
            raise ValueError('Tuition fee cannot be negative')
        return v

    @validator('ranking')
    def validate_ranking(cls, v):
        if v is not None and v < 0:
            raise ValueError('Ranking cannot be negative')
        return v

    @validator('acceptance_rate')
    def validate_acceptance(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Acceptance rate must be between 0 and 100')
        return v


class StudentProfileValidationSchema(BaseModel):
    """Enhanced student profile validation"""
    gpa: float
    ielts: float
    budget: float
    country: Optional[str] = None
    field: Optional[str] = None

    @validator('gpa')
    def validate_gpa(cls, v):
        if v < 0 or v > 4:
            raise ValueError('GPA must be between 0 and 4')
        return v

    @validator('ielts')
    def validate_ielts(cls, v):
        if v < 0 or v > 9:
            raise ValueError('IELTS score must be between 0 and 9')
        return v

    @validator('budget')
    def validate_budget(cls, v):
        if v < 0:
            raise ValueError('Budget cannot be negative')
        return v


def validate_university_data(data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """
    Validate university data
    
    Args:
        data: University dictionary
        
    Returns:
        (is_valid, error_message)
    """
    try:
        UniversityValidationSchema(**data)
        return True, None
    except Exception as e:
        return False, str(e)


def validate_student_profile(data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """
    Validate student profile data
    
    Args:
        data: Student profile dictionary
        
    Returns:
        (is_valid, error_message)
    """
    try:
        StudentProfileValidationSchema(**data)
        return True, None
    except Exception as e:
        return False, str(e)


def sanitize_string(value: str) -> str:
    """Remove potentially harmful characters from string"""
    if not isinstance(value, str):
        return str(value)
    return value.strip().replace('\n', ' ').replace('\r', ' ')


def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize all string inputs in a dictionary"""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_input(value)
        elif isinstance(value, list):
            sanitized[key] = [sanitize_string(item) if isinstance(item, str) else item for item in value]
        else:
            sanitized[key] = value
    return sanitized
