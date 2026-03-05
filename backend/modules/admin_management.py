try:
    import pandas as pd
except ImportError:
    pd = None

import os

def add_university(data):
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    df = pd.read_csv(csv_path)
    df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)
    df.to_csv(csv_path, index=False)
    return {"status": "success", "message": "University added successfully"}
