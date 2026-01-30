import pandas as pd
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_session, engine, create_db_and_tables
from db_models.university import University
from db_models.scholarship import Scholarship
from sqlmodel import select
UNIVERSITIES = [
    # 🇫🇷 FRANCE
    {"university":"Sorbonne University","country":"France","city":"Paris","ranking":60,"min_gpa":3.2,"min_ielts":6.5,"average_fees_eur":8000,"field":"Engineering"},
    {"university":"Université Paris-Saclay","country":"France","city":"Paris","ranking":45,"min_gpa":3.3,"min_ielts":6.5,"average_fees_eur":7000,"field":"Engineering"},
    {"university":"Grenoble INP","country":"France","city":"Grenoble","ranking":90,"min_gpa":3.0,"min_ielts":6.0,"average_fees_eur":6500,"field":"Engineering"},
    {"university":"University of Lille","country":"France","city":"Lille","ranking":120,"min_gpa":2.8,"min_ielts":6.0,"average_fees_eur":6000,"field":"Engineering"},

    # 🇩🇪 GERMANY
    {"university":"TU Munich","country":"Germany","city":"Munich","ranking":25,"min_gpa":3.5,"min_ielts":7.0,"average_fees_eur":9000,"field":"Engineering"},
    {"university":"RWTH Aachen","country":"Germany","city":"Aachen","ranking":50,"min_gpa":3.3,"min_ielts":6.5,"average_fees_eur":8000,"field":"Engineering"},
    {"university":"University of Stuttgart","country":"Germany","city":"Stuttgart","ranking":100,"min_gpa":3.0,"min_ielts":6.0,"average_fees_eur":7000,"field":"Engineering"},

    # 🇮🇹 ITALY
    {"university":"Politecnico di Milano","country":"Italy","city":"Milan","ranking":40,"min_gpa":3.2,"min_ielts":6.5,"average_fees_eur":4000,"field":"Engineering"},
    {"university":"University of Bologna","country":"Italy","city":"Bologna","ranking":90,"min_gpa":2.8,"min_ielts":6.0,"average_fees_eur":3500,"field":"Engineering"},
    {"university":"Sapienza University of Rome","country":"Italy","city":"Rome","ranking":70,"min_gpa":3.0,"min_ielts":6.5,"average_fees_eur":4500,"field":"Engineering"},

    # 🇳🇱 NETHERLANDS
    {"university":"TU Delft","country":"Netherlands","city":"Delft","ranking":20,"min_gpa":3.5,"min_ielts":7.0,"average_fees_eur":14000,"field":"Engineering"},
    {"university":"University of Amsterdam","country":"Netherlands","city":"Amsterdam","ranking":55,"min_gpa":3.2,"min_ielts":6.5,"average_fees_eur":13000,"field":"Engineering"},

    # 🇪🇸 SPAIN
    {"university":"University of Barcelona","country":"Spain","city":"Barcelona","ranking":80,"min_gpa":3.0,"min_ielts":6.5,"average_fees_eur":3000,"field":"Engineering"},
    {"university":"Polytechnic University of Madrid","country":"Spain","city":"Madrid","ranking":95,"min_gpa":3.0,"min_ielts":6.0,"average_fees_eur":2800,"field":"Engineering"},

    # 🇸🇪 SWEDEN
    {"university":"KTH Royal Institute of Technology","country":"Sweden","city":"Stockholm","ranking":35,"min_gpa":3.4,"min_ielts":6.5,"average_fees_eur":15000,"field":"Engineering"},
]

from modules.admission_prediction import predict_admission
from modules.recommendation_engine import recommend_universities
from modules.nlp_query_handler import answer_query
from modules.cost_roi_analysis import analyze_total_cost, find_affordable_universities, match_scholarships
from data_fetcher.fetch_scholarships import (
    fetch_scholarships_by_country,
    filter_scholarships as filter_scholarships_advanced,
    get_scholarship_statistics
)
from routes.resume import router as resume_router
from routes.resume_ai import router as resume_ai_router
from routes.sop_ai import router as sop_ai_router
from routes.visa_data import router as visa_data_router

app = FastAPI()

# ✅ Database Table Creation
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ✅ CORS (THIS IS REQUIRED)
@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Standard CORSMiddleware is better, but the user had specific comments. 
# Re-adding original CORS setup:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Resume Builder Routes (Independent Module)
app.include_router(resume_router)
app.include_router(resume_ai_router)
app.include_router(sop_ai_router)
app.include_router(visa_data_router)

from typing import Optional

# ---------- Data Models ----------
class StudentProfile(BaseModel):
    gpa: Optional[float] = None
    ielts: Optional[float] = None
    budget: Optional[float] = None
    country: Optional[str] = None
    field: Optional[str] = None

class QueryRequest(BaseModel):
    query: str

class CostAnalysisRequest(BaseModel):
    tuition_fee: Optional[float] = None
    country: Optional[str] = None
    duration_years: int = 2

class ScholarshipRequest(BaseModel):
    country: str

# ---------- Routes ----------
@app.get("/")
def root():
    return {"message": "AI University Decision Support System is running"}

@app.post("/predict")
def predict(profile: StudentProfile):
    try:
        gpa = profile.gpa or 0
        ielts = profile.ielts or 0
        budget = profile.budget or 0

        # ---------- Admission Probability Logic ----------
        score = 0

        # GPA contribution (max 40)
        score += min(gpa / 4.0, 1) * 40

        # IELTS contribution (max 30)
        score += min(ielts / 9.0, 1) * 30

        # Budget contribution (max 30)
        if budget >= 20000:
            score += 30
        elif budget >= 12000:
            score += 20
        elif budget >= 8000:
            score += 10

        probability = round(score)

        # ---------- Chance Mapping ----------
        if probability >= 70:
            chance = "HIGH"
            message = "Excellent profile! Strong chance of admission."
        elif probability >= 40:
            chance = "MEDIUM"
            message = "Decent profile. You have a fair chance."
        else:
            chance = "LOW"
            message = "Profile needs improvement to increase chances."

        return {
            "status": "success",
            "chance": chance,
            "probability": probability,
            "message": message
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}



@app.post("/recommend")
def recommend(profile: StudentProfile, db: Session = Depends(get_session)):
    try:
        # Query universities from database
        statement = select(University)
        
        # Build filters based on profile
        if profile.country and profile.country != "all" and profile.country != "all europe":
            statement = statement.where(University.country == profile.country)
        
        # We'll do field and numeric filtering in memory for complex matching logic
        # or we could build more complex SQL queries.
        # For now, let's fetch all (or filtered by country) and process matches.
        
        universities = db.exec(statement).all()
        
        # Normalize inputs
        gpa = profile.gpa or 0
        ielts = profile.ielts or 0
        budget = profile.budget or 10**9
        field = (profile.field or "").lower()

        results = []

        for uni in universities:
            # Eligibility filters
            if gpa < uni.min_gpa:
                continue
            if ielts < uni.min_ielts:
                continue
            if budget < uni.average_fees_eur:
                continue
            
            # Field filter (if specified) - Flexible matching
            uni_field = str(uni.field).lower()
            if field and field not in uni_field:
                field_keywords = field.replace("/", " ").replace(",", " ").split()
                if not any(kw in uni_field for kw in field_keywords):
                    continue

            # Match score calculation
            gpa_score = min(gpa / 4, 1)
            ielts_score = min(ielts / 9, 1)
            cost_score = 1 - (uni.average_fees_eur / budget)

            match_score = round(
                (gpa_score * 0.4) + (ielts_score * 0.3) + (cost_score * 0.3),
                2
            )

            results.append({
                "university": uni.university,
                "country": uni.country,
                "city": uni.city,
                "ranking": uni.ranking,
                "average_fees_eur": uni.average_fees_eur,
                "field": uni.field,
                "match_score": match_score
            })

        # Sort best matches
        results.sort(key=lambda x: x["match_score"], reverse=True)

        return {
            "status": "success",
            "total": len(results),
            "recommendations": results[:10]  # top 10 only
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/query")
def query_handler(request: QueryRequest):
    try:
        answer = answer_query(request.query)
        return {
            "status": "success",
            "answer": answer
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/cost-analysis")
def cost_analysis(request: CostAnalysisRequest):
    try:
        analysis = analyze_total_cost(request.tuition_fee, request.country, request.duration_years)
        return {
            "status": "success",
            "cost_analysis": analysis
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/find-affordable")
def find_affordable(profile: StudentProfile):
    try:
        affordable_unis = find_affordable_universities(profile, profile.budget)
        return {
            "status": "success",
            "affordable_analysis": affordable_unis
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/scholarships")
def get_scholarships(request: ScholarshipRequest):
    try:
        scholarships = match_scholarships(None, request.country)
        return {
            "status": "success",
            "scholarships": scholarships
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/universities")
def get_all_universities(db: Session = Depends(get_session)):
    try:
        universities = db.exec(select(University)).all()
        return {
            "status": "success",
            "universities": [u.dict() for u in universities],
            "total": len(universities)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-list")
def get_all_scholarships(db: Session = Depends(get_session)):
    try:
        scholarships = db.exec(select(Scholarship)).all()
        return {
            "status": "success",
            "scholarships": [s.dict() for s in scholarships],
            "total": len(scholarships)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ========== Advanced Scholarship Endpoints ==========

@app.get("/scholarships-by-country/{country}")
def scholarships_by_country(country: str, db: Session = Depends(get_session)):
    """Get scholarships available in a specific country"""
    try:
        scholarships = fetch_scholarships_by_country(country, db=db)
        return {
            "status": "success",
            "country": country,
            "scholarships": scholarships,
            "total": len(scholarships)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-statistics")
def scholarships_statistics(db: Session = Depends(get_session)):
    """Get statistics about all scholarships"""
    try:
        stats = get_scholarship_statistics(db=db)
        return {
            "status": "success",
            "statistics": stats
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-filter")
def filter_scholarships(country: str = None, coverage: str = None, min_amount: float = None, max_amount: float = None, db: Session = Depends(get_session)):
    """Advanced scholarship filtering with multiple criteria"""
    try:
        scholarships = filter_scholarships_advanced(
            country=country,
            coverage=coverage,
            min_amount=min_amount,
            max_amount=max_amount,
            db=db
        )
        return {
            "status": "success",
            "scholarships": scholarships,
            "total": len(scholarships),
            "filters": {
                "country": country,
                "coverage": coverage,
                "min_amount": min_amount,
                "max_amount": max_amount
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

