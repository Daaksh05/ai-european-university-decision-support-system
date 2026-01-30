import pandas as pd
import os

def calculate_roi(tuition_fee, expected_salary):
    """Calculate ROI (Return on Investment) for tuition fee vs expected salary"""
    if tuition_fee == 0:
        return 0
    return round(expected_salary / tuition_fee, 2)

def analyze_total_cost(tuition_fee, country, duration_years=2):
    """Calculate total cost including living expenses by country with breakdown"""
    # Breakdown percentages (typical distribution of living costs)
    breakdown_ratios = {
        "accommodation": 0.50,
        "food": 0.25,
        "transport": 0.10,
        "other": 0.15
    }

    living_costs = {
        "France": 900,
        "Germany": 850,
        "Netherlands": 1200,
        "Belgium": 1000,
        "Finland": 1100,
        "Italy": 750,
        "Spain": 800,
        "Austria": 950,
        "Sweden": 1100,
        "UK": 1400,
    }
    
    country_clean = country.title() if country else "Default"
    monthly_cost = living_costs.get(country_clean, 1000)
    
    yearly_living = monthly_cost * 12
    total_living_cost = yearly_living * duration_years
    total_cost = (tuition_fee * duration_years) + total_living_cost
    
    breakdown = {
        category: round(monthly_cost * ratio, 2)
        for category, ratio in breakdown_ratios.items()
    }
    
    return {
        "tuition_fee_annual": tuition_fee,
        "country": country_clean,
        "duration_years": duration_years,
        "monthly_living_cost": monthly_cost,
        "breakdown": breakdown,
        "yearly_living_cost": yearly_living,
        "total_living_cost": total_living_cost,
        "total_tuition": tuition_fee * duration_years,
        "total_combined_cost": round(total_cost, 2)
    }

def find_affordable_universities(profile, max_budget):
    """Find universities within budget"""
    if not max_budget:
        return {"error": "Budget is required"}
    
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    if not os.path.exists(csv_path):
        return {"error": f"Universities data file not found at {csv_path}"}
    
    try:
        df = pd.read_csv(csv_path)
        
        # Validate required columns
        required_cols = ["university", "country", "average_fees_eur"]
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return {"error": f"Missing columns in CSV: {missing_cols}"}
        
        affordable = df[df["average_fees_eur"] <= max_budget]
        
        return {
            "total_universities": len(df),
            "affordable_universities": len(affordable),
            "percentage_affordable": round((len(affordable) / len(df)) * 100, 2) if len(df) > 0 else 0,
            "cheapest_university": affordable.loc[affordable["average_fees_eur"].idxmin()].to_dict() if len(affordable) > 0 else None,
            "average_fee_in_budget": round(affordable["average_fees_eur"].mean(), 2) if len(affordable) > 0 else 0
        }
    except Exception as e:
        return {"error": f"Error reading universities data: {str(e)}"}

def match_scholarships(profile, country):
    """Match scholarships based on student profile and country"""
    csv_path = "backend/data/scholarships.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/scholarships.csv"
    
    if not os.path.exists(csv_path):
        return []
    
    try:
        df = pd.read_csv(csv_path)
        
        # Validate required columns
        required_cols = ["scholarship_name", "country", "coverage", "amount_eur", "eligibility", "website_url"]
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"Missing columns in scholarships.csv: {missing_cols}")
            # Fallback to returning what we have if website_url is missing but we'll try to include it
            if "scholarship_name" not in df.columns: return []
        
        # Filter scholarships by country
        scholarships = df[df["country"] == country]
        
        results = []
        for _, row in scholarships.iterrows():
            results.append({
                "name": row["scholarship_name"],
                "country": row["country"],
                "coverage": row["coverage"],
                "amount_eur": row["amount_eur"],
                "eligibility": row["eligibility"],
                "website_url": row.get("website_url", "#")
            })
        
        return results
    except Exception as e:
        print(f"Error reading scholarships data: {str(e)}")
        return []

