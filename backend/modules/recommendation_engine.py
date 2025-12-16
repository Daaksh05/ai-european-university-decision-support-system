import pandas as pd

def recommend_universities(profile):
    df = pd.read_csv("backend/data/universities.csv")

    filtered = df[
        (df["ielts_required"] <= profile.ielts) &
        (df["average_fees"] <= profile.budget)
    ]

    return filtered[["university", "country", "average_fees"]].head(5).to_dict(orient="records")
