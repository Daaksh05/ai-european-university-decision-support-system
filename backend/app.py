from fastapi import FastAPI
from pydantic import BaseModel
from modules.admission_prediction import predict_admission
from modules.recommendation_engine import recommend_universities
from modules.nlp_query_handler import answer_query

app = FastAPI(title="AI University Decision Support System")

# ----------- Data Models -----------

class StudentProfile(BaseModel):
    gpa: float
    ielts: float
    budget: int
    country: str
    field: str

class Query(BaseModel):
    query: str

# ----------- API Endpoints -----------

@app.post("/profile")
def save_profile(profile: StudentProfile):
    return {"message": "Profile received successfully", "profile": profile}

@app.post("/predict")
def admission_prediction(profile: StudentProfile):
    result = predict_admission(profile)
    return {"admission_chance": result}

@app.post("/recommend")
def university_recommendation(profile: StudentProfile):
    universities = recommend_universities(profile)
    return {"recommendations": universities}

@app.post("/query")
def nlp_query(query: Query):
    response = answer_query(query.query)
    return {"answer": response}
