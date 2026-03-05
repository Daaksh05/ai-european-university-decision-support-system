import csv
import os

def recommend_universities(profile):
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    if not os.path.exists(csv_path):
        return []

    results = []
    try:
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert types for comparison
                try:
                    ielts_req = float(row.get("ielts_required", 0))
                except (ValueError, TypeError):
                    ielts_req = 0
                
                try:
                    fees = float(row.get("average_fees_eur", 0))
                except (ValueError, TypeError):
                    fees = 0

                # Apply filters
                if profile.ielts and profile.ielts > 0:
                    if ielts_req > profile.ielts:
                        continue
                
                if profile.budget and profile.budget > 0:
                    if fees > profile.budget:
                        continue
                
                if profile.country and profile.country.strip():
                    if row.get("country", "").lower() != profile.country.lower():
                        continue
                
                if profile.field and profile.field.strip():
                    if profile.field.lower() not in row.get("field", "").lower():
                        continue
                
                results.append({
                    "university": row.get("university"),
                    "country": row.get("country"),
                    "city": row.get("city"),
                    "field": row.get("field"),
                    "ielts_required": ielts_req,
                    "average_fees_eur": fees,
                    "ranking": row.get("ranking"),
                    "course_url": row.get("course_url")
                })
                
                if len(results) >= 5:
                    break
    except Exception as e:
        print(f"Error reading universities CSV: {e}")
        return []

    return results
