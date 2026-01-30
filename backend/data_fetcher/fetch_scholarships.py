"""
Scholarship Data Fetcher Module
Provides utilities to fetch, validate, and manage scholarship data
"""

import pandas as pd
import os
from typing import List, Dict, Optional
from sqlmodel import Session, select, func
from database import engine
from db_models.scholarship import Scholarship

def fetch_scholarships_by_country(country: str, db: Optional[Session] = None) -> List[Dict]:
    """
    Fetch scholarships available in a specific country
    """
    if db is None:
        with Session(engine) as session:
            return _fetch_scholarships_by_country(country, session)
    return _fetch_scholarships_by_country(country, db)

def _fetch_scholarships_by_country(country: str, session: Session) -> List[Dict]:
    try:
        statement = select(Scholarship).where(Scholarship.country == country)
        results = session.exec(statement).all()
        return [s.dict() for s in results]
    except Exception as e:
        print(f"Error fetching scholarships for {country}: {str(e)}")
        return []


def fetch_all_scholarships() -> List[Dict]:
    """
    Fetch all available scholarships
    
    Returns:
        List[Dict]: List of all scholarships
    """
    csv_path = "backend/data/scholarships.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/scholarships.csv"
    
    if not os.path.exists(csv_path):
        return []
    
    try:
        df = pd.read_csv(csv_path)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching all scholarships: {str(e)}")
        return []


def fetch_scholarships_by_coverage(coverage_type: str) -> List[Dict]:
    """
    Fetch scholarships by coverage type (Full, Partial, etc.)
    
    Args:
        coverage_type (str): Type of coverage (e.g., "Full", "Partial")
        
    Returns:
        List[Dict]: List of scholarships matching the coverage type
    """
    csv_path = "backend/data/scholarships.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/scholarships.csv"
    
    if not os.path.exists(csv_path):
        return []
    
    try:
        df = pd.read_csv(csv_path)
        scholarships = df[df["coverage"] == coverage_type]
        return scholarships.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching scholarships with coverage {coverage_type}: {str(e)}")
        return []


def fetch_scholarships_by_eligibility(eligibility: str) -> List[Dict]:
    """
    Fetch scholarships by eligibility criteria
    
    Args:
        eligibility (str): Eligibility criteria (e.g., "Merit-based", "Indian Students")
        
    Returns:
        List[Dict]: List of scholarships matching the eligibility
    """
    csv_path = "backend/data/scholarships.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/scholarships.csv"
    
    if not os.path.exists(csv_path):
        return []
    
    try:
        df = pd.read_csv(csv_path)
        scholarships = df[df["eligibility"].str.contains(eligibility, case=False, na=False)]
        return scholarships.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching scholarships with eligibility {eligibility}: {str(e)}")
        return []


def get_scholarship_statistics(db: Optional[Session] = None) -> Dict:
    """
    Get statistics about available scholarships
    """
    if db is None:
        with Session(engine) as session:
            return _get_scholarship_statistics(session)
    return _get_scholarship_statistics(db)

def _get_scholarship_statistics(session: Session) -> Dict:
    try:
        total = session.exec(select(func.count(Scholarship.id))).one()
        countries = session.exec(select(func.count(func.distinct(Scholarship.country)))).one()
        total_funding = session.exec(select(func.sum(Scholarship.amount_eur))).one() or 0
        avg_funding = session.exec(select(func.avg(Scholarship.amount_eur))).one() or 0
        
        # Group by country
        country_counts_raw = session.exec(select(Scholarship.country, func.count(Scholarship.id)).group_by(Scholarship.country)).all()
        by_country = {c: count for c, count in country_counts_raw}
        
        # Group by coverage
        coverage_counts_raw = session.exec(select(Scholarship.coverage, func.count(Scholarship.id)).group_by(Scholarship.coverage)).all()
        by_coverage = {cov: count for cov, count in coverage_counts_raw}
        
        return {
            "total_scholarships": total,
            "countries": countries,
            "by_country": by_country,
            "by_coverage": by_coverage,
            "total_funding_available": float(total_funding),
            "average_scholarship_amount": round(float(avg_funding), 2)
        }
    except Exception as e:
        print(f"Error generating scholarship statistics: {str(e)}")
        return {"error": str(e)}


def filter_scholarships(country=None, coverage=None, min_amount=None, max_amount=None, db: Optional[Session] = None) -> List[Dict]:
    """
    Advanced filtering for scholarships with multiple criteria
    """
    if db is None:
        with Session(engine) as session:
            return _filter_scholarships(country, coverage, min_amount, max_amount, session)
    return _filter_scholarships(country, coverage, min_amount, max_amount, db)

def _filter_scholarships(country, coverage, min_amount, max_amount, session: Session) -> List[Dict]:
    try:
        statement = select(Scholarship)
        if country:
            statement = statement.where(Scholarship.country == country)
        if coverage:
            statement = statement.where(Scholarship.coverage == coverage)
        if min_amount is not None:
            statement = statement.where(Scholarship.amount_eur >= min_amount)
        if max_amount is not None:
            statement = statement.where(Scholarship.amount_eur <= max_amount)
            
        results = session.exec(statement).all()
        return [s.dict() for s in results]
    except Exception as e:
        print(f"Error filtering scholarships: {str(e)}")
        return []


if __name__ == "__main__":
    # Test the functions
    print("Testing Scholarship Fetcher...")
    print("\nAll scholarships:")
    print(fetch_all_scholarships())
    print("\nFrance scholarships:")
    print(fetch_scholarships_by_country("France"))
    print("\nStatistics:")
    print(get_scholarship_statistics())
