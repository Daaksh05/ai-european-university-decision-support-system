import pandas as pd
import os

def calculate_roi(tuition_fee, expected_salary):
    """Calculate ROI (Return on Investment) for tuition fee vs expected salary"""
    if tuition_fee == 0:
        return 0
    return round(expected_salary / tuition_fee, 2)

def analyze_total_cost(tuition_fee, country, duration_years=2):
    """Calculate total cost including living expenses by country"""
    living_costs = {
        "France": 900,
        "Germany": 800,
        "Netherlands": 1200,
        "Belgium": 1000,
        "Finland": 1100,
        "Italy": 700,
        "Spain": 800,
        "Austria": 950
    }
    
    monthly_cost = living_costs.get(country, 1000)
    yearly_living = monthly_cost * 12
    total_cost = (tuition_fee + yearly_living) * duration_years
    
    return {
        "tuition_fee": tuition_fee,
        "monthly_living_cost": monthly_cost,
        "yearly_living_cost": yearly_living,
        "total_cost_2_years": total_cost,
        "total_cost_per_month": round(total_cost / (duration_years * 12), 2)
    }

def find_affordable_universities(profile, max_budget):
    """Find universities within budget"""
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    df = pd.read_csv(csv_path)
    affordable = df[df["average_fees_eur"] <= max_budget]
    
    return {
        "total_universities": len(df),
        "affordable_universities": len(affordable),
        "percentage_affordable": round((len(affordable) / len(df)) * 100, 2),
        "cheapest_university": affordable.loc[affordable["average_fees_eur"].idxmin()].to_dict() if len(affordable) > 0 else None,
        "average_fee_in_budget": round(affordable["average_fees_eur"].mean(), 2) if len(affordable) > 0 else 0
    }

def match_scholarships(profile, country):
    """Match scholarships based on student profile and country"""
    csv_path = "backend/data/scholarships.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/scholarships.csv"
    
    df = pd.read_csv(csv_path)
    
    # Filter scholarships by country
    scholarships = df[df["country"] == country]
    
    results = []
    for _, row in scholarships.iterrows():
        results.append({
            "name": row["scholarship_name"],
            "country": row["country"],
            "coverage": row["coverage"],
            "amount_eur": row["amount_eur"],
            "eligibility": row["eligibility"]
        })
    
    return results
