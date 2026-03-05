import csv
import os

def analyze_total_cost(tuition_fee, country, duration_years=2):
    """Analyze total cost of education including living expenses"""
    # Average living expenses per year by country
    living_expenses = {
        "Germany": 11000,
        "Netherlands": 12000,
        "France": 11000,
        "Italy": 9000,
        "Spain": 8500,
        "Switzerland": 20000,
        "Sweden": 12000,
        "Belgium": 10000,
        "Default": 10000
    }
    
    annual_living = living_expenses.get(country, living_expenses["Default"])
    monthly_living = annual_living / 12
    
    # Realistic breakdown for frontend
    breakdown = {
        "accommodation": round(monthly_living * 0.45),
        "food & groceries": round(monthly_living * 0.25),
        "transportation": round(monthly_living * 0.10),
        "utilities & internet": round(monthly_living * 0.10),
        "leisure & personal": round(monthly_living * 0.10)
    }

    total_living = annual_living * duration_years
    total_tuition = tuition_fee * duration_years
    total_cost = total_tuition + total_living
    
    return {
        "tuition_per_year": tuition_fee,
        "living_per_year": annual_living,
        "monthly_living_cost": round(monthly_living),
        "breakdown": breakdown,
        "total_tuition": total_tuition,
        "total_living_cost": total_living,
        "total_combined_cost": total_cost,
        "duration_years": duration_years,
        "country": country
    }

def find_affordable_universities(max_budget):
    """Wrapper for check_affordability to match old API"""
    return check_affordability(max_budget)

def check_affordability(max_budget):
    """Check how many universities fit within a budget"""
    csv_path = "backend/data/universities.csv"
    if not os.path.exists(csv_path):
        csv_path = "data/universities.csv"
    
    if not os.path.exists(csv_path):
        return {"error": "Universities data not found"}
    
    try:
        universities = []
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    fee = float(row.get("average_fees_eur", 0))
                    row["average_fees_eur"] = fee
                    universities.append(row)
                except (ValueError, TypeError):
                    continue

        if not universities:
            return {"error": "No valid data found in CSV"}
            
        affordable = [u for u in universities if u["average_fees_eur"] <= max_budget]
        
        total_count = len(universities)
        affordable_count = len(affordable)
        
        cheapest = None
        if affordable:
            cheapest = min(affordable, key=lambda x: x["average_fees_eur"])
            
        avg_fee = sum(u["average_fees_eur"] for u in affordable) / affordable_count if affordable_count > 0 else 0
        
        return {
            "total_universities": total_count,
            "affordable_universities": affordable_count,
            "percentage_affordable": round((affordable_count / total_count) * 100, 2) if total_count > 0 else 0,
            "cheapest_university": cheapest,
            "average_fee_in_budget": round(avg_fee, 2)
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
        results = []
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("country") == country:
                    try:
                        amount = float(row.get("amount_eur", 0))
                    except (ValueError, TypeError):
                        amount = 0
                        
                    results.append({
                        "name": row.get("scholarship_name"),
                        "country": row.get("country"),
                        "coverage": row.get("coverage"),
                        "amount_eur": amount,
                        "eligibility": row.get("eligibility"),
                        "website_url": row.get("website_url", "#")
                    })
        
        return results
    except Exception as e:
        print(f"Error reading scholarships data: {str(e)}")
        return []

def predict_career_roi(field, country, total_investment, expected_salary=None):
    """Predict salary and ROI based on field and country, with optional manual salary override"""
    # Industry average starting salaries (Master's level)
    salary_data = {
        "Engineering": {"Germany": 55000, "Netherlands": 52000, "France": 48000, "Italy": 38000, "Spain": 36000, "Default": 45000},
        "Computer Science / AI": {"Germany": 62000, "Netherlands": 60000, "France": 55000, "Italy": 42000, "Spain": 40000, "Default": 50000},
        "Data Science": {"Germany": 65000, "Netherlands": 62000, "France": 58000, "Italy": 45000, "Spain": 42000, "Default": 55000},
        "Business / MBA": {"Germany": 60000, "Netherlands": 58000, "France": 65000, "Italy": 50000, "Spain": 48000, "Default": 55000},
        "Medicine / Healthcare": {"Germany": 75000, "Netherlands": 70000, "France": 72000, "Italy": 55000, "Spain": 52000, "Default": 60000},
        "Social Sciences": {"Germany": 42000, "Netherlands": 40000, "France": 38000, "Italy": 30000, "Spain": 28000, "Default": 35000},
        "Natural Sciences": {"Germany": 50000, "Netherlands": 48000, "France": 45000, "Italy": 35000, "Spain": 32000, "Default": 42000},
        "Law & Legal Studies": {"Germany": 65000, "Netherlands": 62000, "France": 60000, "Italy": 48000, "Spain": 45000, "Default": 55000},
        "Arts / Humanities": {"Germany": 38000, "Netherlands": 35000, "France": 36000, "Italy": 28000, "Spain": 26000, "Default": 32000},
        "Architecture & Design": {"Germany": 48000, "Netherlands": 46000, "France": 44000, "Italy": 36000, "Spain": 34000, "Default": 40000},
        "Psychology": {"Germany": 45000, "Netherlands": 42000, "France": 40000, "Italy": 32000, "Spain": 30000, "Default": 38000},
        "Education": {"Germany": 48000, "Netherlands": 45000, "France": 42000, "Italy": 34000, "Spain": 32000, "Default": 40000},
        "Hospitality & Tourism": {"Germany": 40000, "Netherlands": 38000, "France": 45000, "Italy": 35000, "Spain": 33000, "Default": 36000}
    }

    # Normalize field input for lookup
    field_key = "Engineering"
    field_lower = field.lower()
    if "data" in field_lower: field_key = "Data Science"
    elif "computer" in field_lower or "ai" in field_lower: field_key = "Computer Science / AI"
    elif "business" in field_lower or "mba" in field_lower: field_key = "Business / MBA"
    elif "medicine" in field_lower or "health" in field_lower: field_key = "Medicine / Healthcare"
    elif "social" in field_lower: field_key = "Social Sciences"
    elif "natural" in field_lower or "science" in field_lower and "computer" not in field_lower and "data" not in field_lower: field_key = "Natural Sciences"
    elif "law" in field_lower or "legal" in field_lower: field_key = "Law & Legal Studies"
    elif "art" in field_lower or "human" in field_lower: field_key = "Arts / Humanities"
    elif "arch" in field_lower or "design" in field_lower: field_key = "Architecture & Design"
    elif "psych" in field_lower: field_key = "Psychology"
    elif "edu" in field_lower: field_key = "Education"
    elif "hosp" in field_lower or "tour" in field_lower: field_key = "Hospitality & Tourism"


    country_clean = country.title() if country else "Default"
    
    # Use manual salary if provided, otherwise fallback to data
    if expected_salary and expected_salary > 0:
        annual_salary = float(expected_salary)
        salary_source = "User Provided"
    else:
        base_salaries = salary_data.get(field_key, salary_data["Engineering"])
        annual_salary = base_salaries.get(country_clean, base_salaries.get("Default", 40000))
        salary_source = "Industry Average"

    # ROI Calculations
    # Assume 30% tax and 12,000 yearly living expenses (surplus calculation)
    net_annual_income = (annual_salary * 0.7) - 12000
    
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
        "salary_source": salary_source,
        "break_even_years": break_even_years,
        "roi_score": roi_score,
        "explanation": f"Based on {field_key} in {country_clean} ({salary_source}), a starting salary of €{annual_salary:,}/year suggests you'll recover your €{total_investment:,} investment in approx {break_even_years} years."
    }
