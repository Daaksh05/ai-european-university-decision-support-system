from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
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

app = FastAPI()

# ✅ CORS (THIS IS REQUIRED)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Data Models ----------
class StudentProfile(BaseModel):
    gpa: float = None
    ielts: float = None
    budget: float = None
    country: str = None
    field: str = None

class QueryRequest(BaseModel):
    query: str

class CostAnalysisRequest(BaseModel):
    tuition_fee: float
    country: str
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
        admission_chance = predict_admission(profile)
        return {
            "status": "success",
            "admission_chance": admission_chance
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/recommend")
def recommend(profile: StudentProfile):
    try:
        # Load university dataset
        csv_path = "backend/data/universities.csv"
        if not os.path.exists(csv_path):
            csv_path = "data/universities.csv"

        df = pd.read_csv(csv_path)

        # Normalize inputs
        gpa = profile.gpa or 0
        ielts = profile.ielts or 0
        budget = profile.budget or 10**9
        country = (profile.country or "").lower()
        field = (profile.field or "").lower()

        results = []

        for _, uni in df.iterrows():
            # Eligibility filters
            if gpa < uni.get("min_gpa", 0):
                continue
            if ielts < uni.get("min_ielts", 0):
                continue
            if budget < uni.get("average_fees_eur", 0):
                continue
            if country and country != str(uni.get("country", "")).lower():
                continue
            if field and field not in str(uni.get("field", "")).lower():
                continue

            # Match score calculation
            gpa_score = min(gpa / 4, 1)
            ielts_score = min(ielts / 9, 1)
            cost_score = 1 - (uni["average_fees_eur"] / budget)

            match_score = round(
                (gpa_score * 0.4) + (ielts_score * 0.3) + (cost_score * 0.3),
                2
            )

            results.append({
                "university": uni["university"],
                "country": uni["country"],
                "city": uni.get("city", ""),
                "ranking": uni.get("ranking", 500),
                "average_fees_eur": uni["average_fees_eur"],
                "field": uni.get("field", ""),
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
def get_all_universities():
    try:
        csv_path = "backend/data/universities.csv"
        if not os.path.exists(csv_path):
            csv_path = "data/universities.csv"
        df = pd.read_csv(csv_path)
        return {
            "status": "success",
            "universities": df.to_dict(orient="records"),
            "total": len(df)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-list")
def get_all_scholarships():
    try:
        csv_path = "backend/data/scholarships.csv"
        if not os.path.exists(csv_path):
            csv_path = "data/scholarships.csv"
        df = pd.read_csv(csv_path)
        return {
            "status": "success",
            "scholarships": df.to_dict(orient="records"),
            "total": len(df)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ========== Advanced Scholarship Endpoints ==========

@app.get("/scholarships-by-country/{country}")
def scholarships_by_country(country: str):
    """Get scholarships available in a specific country"""
    try:
        scholarships = fetch_scholarships_by_country(country)
        return {
            "status": "success",
            "country": country,
            "scholarships": scholarships,
            "total": len(scholarships)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-statistics")
def scholarships_statistics():
    """Get statistics about all scholarships"""
    try:
        stats = get_scholarship_statistics()
        return {
            "status": "success",
            "statistics": stats
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scholarships-filter")
def filter_scholarships(country: str = None, coverage: str = None, min_amount: float = None, max_amount: float = None):
    """Advanced scholarship filtering with multiple criteria"""
    try:
        scholarships = filter_scholarships_advanced(
            country=country,
            coverage=coverage,
            min_amount=min_amount,
            max_amount=max_amount
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

