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

def predict_career_roi(field, country, total_investment):
    """Predict salary and ROI based on field and country"""
    # Industry average starting salaries (Master's level)
    # Bases: Germany/Netherlands as high, Italy/Spain as mid, etc.
    salary_data = {
        "Engineering": {"Germany": 55000, "Netherlands": 52000, "France": 48000, "Italy": 38000, "Spain": 36000, "Default": 45000},
        "Computer Science / AI": {"Germany": 62000, "Netherlands": 60000, "France": 55000, "Italy": 42000, "Spain": 40000, "Default": 50000},
        "Data Science": {"Germany": 65000, "Netherlands": 62000, "France": 58000, "Italy": 45000, "Spain": 42000, "Default": 55000},
        "Business / MBA": {"Germany": 60000, "Netherlands": 58000, "France": 65000, "Italy": 50000, "Spain": 48000, "Default": 55000},
        "Arts / Humanities": {"Germany": 38000, "Netherlands": 35000, "France": 36000, "Italy": 28000, "Spain": 26000, "Default": 32000}
    }

    # Normalize field input for lookup
    field_key = "Engineering"
    field_lower = field.lower()
    if "data" in field_lower: field_key = "Data Science"
    elif "computer" in field_lower or "ai" in field_lower: field_key = "Computer Science / AI"
    elif "business" in field_lower or "mba" in field_lower: field_key = "Business / MBA"
    elif "art" in field_lower or "human" in field_lower: field_key = "Arts / Humanities"

    country_clean = country.title() if country else "Default"
    base_salaries = salary_data.get(field_key, salary_data["Engineering"])
    annual_salary = base_salaries.get(country_clean, base_salaries.get("Default", 40000))

    # ROI Calculations
    # Assume 30% tax and 15,000 yearly living expenses after graduation
    net_annual_income = (annual_salary * 0.7) - 15000
    
    if net_annual_income <= 0:
        break_even_years = 99  # Effectively infinite
    else:
        break_even_years = round(total_investment / net_annual_income, 1)

    roi_score = 0
    if break_even_years <= 2.0: roi_score = 95
    elif break_even_years <= 3.5: roi_score = 80
    elif break_even_years <= 5.0: roi_score = 60
    else: roi_score = 40

    return {
        "field": field_key,
        "country": country_clean,
        "estimated_starting_salary": annual_salary,
        "break_even_years": break_even_years,
        "roi_score": roi_score,
        "explanation": f"Based on {field_key} graduates in {country_clean}, you can expect a starting salary of €{annual_salary:,}/year. With your investment, it will take approx {break_even_years} years to recover costs."
    }

