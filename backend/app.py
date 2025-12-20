from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from modules.admission_prediction import predict_admission
from modules.recommendation_engine import recommend_universities
from modules.nlp_query_handler import answer_query
from modules.cost_roi_analysis import analyze_total_cost, find_affordable_universities, match_scholarships

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
        recommendations = recommend_universities(profile)
        return {
            "status": "success",
            "recommendations": recommendations
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
        df = pd.read_csv("backend/data/universities.csv")
        if not os.path.exists("backend/data/universities.csv"):
            df = pd.read_csv("data/universities.csv")
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
        df = pd.read_csv("backend/data/scholarships.csv")
        if not os.path.exists("backend/data/scholarships.csv"):
            df = pd.read_csv("data/scholarships.csv")
        return {
            "status": "success",
            "scholarships": df.to_dict(orient="records"),
            "total": len(df)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
