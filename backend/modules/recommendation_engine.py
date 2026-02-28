try:
    import pandas as pd
except ImportError:
    pd = None

import os

def recommend_universities(profile):
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    df = pd.read_csv(csv_path)

    filtered = df.copy()
    
    if profile.ielts and profile.ielts > 0:
        filtered = filtered[filtered["ielts_required"] <= profile.ielts]
    
    if profile.budget and profile.budget > 0:
        filtered = filtered[filtered["average_fees_eur"] <= profile.budget]
    
    if profile.country and profile.country.strip():
        filtered = filtered[filtered["country"].str.lower() == profile.country.lower()]
    
    if profile.field and profile.field.strip():
        filtered = filtered[filtered["field"].str.contains(profile.field, case=False, na=False)]

    result = filtered[["university", "country", "city", "field", "ielts_required", "average_fees_eur", "ranking", "course_url"]].head(5).to_dict(orient="records")
    
    return result
