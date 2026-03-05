"""
Backend Utilities - Logging Module
Provides centralized logging for the FastAPI application
"""

import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Any, Dict

# Create logs directory if it doesn't exist
LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# Configure logging
def setup_logger(name: str = "ai-university-system", level=logging.INFO):
    """
    Setup centralized logger for the application
    
    Args:
        name: Logger name
        level: Logging level (default: INFO)
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # File handler
    file_handler = logging.FileHandler(
        LOG_DIR / f"{datetime.now().strftime('%Y-%m-%d')}.log"
    )
    file_handler.setLevel(level)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Initialize default logger
logger = setup_logger()

class RequestLogger:
    """Log API requests and responses"""
    
    @staticmethod
    def log_request(endpoint: str, method: str, data: Optional[Dict] = None):
        """Log incoming request"""
        logger.info(f"[{method}] {endpoint} - Request received")
        if data:
            logger.debug(f"Request data: {json.dumps(data, default=str)}")
    
    @staticmethod
    def log_response(endpoint: str, status_code: int, duration: float):
        """Log outgoing response"""
        logger.info(f"[{status_code}] {endpoint} - Response sent ({duration:.3f}s)")
    
    @staticmethod
    def log_error(endpoint: str, error: Exception, status_code: int = 500):
        """Log error"""
        logger.error(f"[{status_code}] {endpoint} - Error: {str(error)}")
        logger.debug(f"Stack trace:", exc_info=True)

class AnalyticsLogger:
    """Log analytics events for monitoring"""
    
    @staticmethod
    def log_prediction(student_id: str, prediction: Dict[str, Any]):
        """Log admission prediction"""
        logger.info(f"Prediction generated for student: {student_id}")
        logger.debug(f"Prediction result: {json.dumps(prediction, default=str)}")
    
    @staticmethod
    def log_recommendation(student_id: str, recommendations: list, count: int):
        """Log university recommendations"""
        logger.info(f"Recommended {count} universities for student: {student_id}")
        logger.debug(f"Recommendations: {json.dumps(recommendations, default=str)}")
    
    @staticmethod
    def log_analysis(analysis_type: str, data: Dict[str, Any]):
        """Log analysis operation"""
        logger.info(f"Analysis completed: {analysis_type}")
        logger.debug(f"Analysis data: {json.dumps(data, default=str)}")

# Convenience functions
def log_info(message: str):
    """Log info level message"""
    logger.info(message)

def log_warning(message: str):
    """Log warning level message"""
    logger.warning(message)

def log_error(message: str, exception: Optional[Exception] = None):
    """Log error level message"""
    if exception:
        logger.error(f"{message}: {str(exception)}", exc_info=True)
    else:
        logger.error(message)

def log_debug(message: str):
    """Log debug level message"""
    logger.debug(message)
