import pandas as pd
import os

def answer_query(query):
    """Intelligent NLP-based query answering system"""
    query_lower = query.lower()
    
    # Country-specific queries
    country_info = {
        "france": "France offers affordable education (€6,000-€8,000/year) with strong AI and Computer Science programs. Universities like Sorbonne, Paris-Saclay, and Grenoble are top-ranked. IELTS requirement: 6.0-6.5. Scholarships: Eiffel, Charpak, Erasmus+.",
        "germany": "Germany offers low-cost education with excellent STEM programs. Many public universities are FREE or very affordable (€8,000-€9,000/year). Top universities: TU Munich, RWTH Aachen. IELTS: 6.5. Scholarships: DAAD.",
        "netherlands": "Netherlands has high tuition fees (€12,000-€13,000/year) but excellent education quality. Amsterdam and Delft are world-renowned. IELTS: 7.0. Living costs: €1,200/month.",
        "italy": "Italy offers very affordable education (€3,000-€4,000/year) with rich academic history. Milan (Politecnico) and Bologna are top choices. IELTS: 6.0.",
        "spain": "Spain provides affordable education (€4,500/year) with strong programs. Barcelona and Madrid universities are well-ranked. IELTS: 6.5. Living cost: €800/month."
    }
    
    # Test requirements
    if "ielts" in query_lower:
        if "requirement" in query_lower or "how much" in query_lower:
            return "IELTS requirements vary by university and program: Most require 6.0-7.0. Top universities typically require 6.5-7.5. Some universities accept 5.5 minimum. Check specific university requirements for accurate information."
        else:
            return "IELTS (International English Language Testing System) is widely accepted for university admissions in Europe. Scores range from 0-9, with 6.0+ typically required for master's programs."
    
    # Scholarship queries
    if "scholarship" in query_lower:
        return "Popular scholarships include: Erasmus+ (Europe-wide), DAAD (Germany), Eiffel Excellence (France), Orange Tulip (Netherlands), Campus France, and country-specific schemes. Most require merit-based selection. Apply early!"
    
    # Cost/Budget queries
    if "cost" in query_lower or "budget" in query_lower or "expensive" in query_lower or "cheap" in query_lower or "afford" in query_lower:
        return "Tuition costs vary significantly: Cheapest: Italy/Spain (€3,000-€4,500/year), Mid-range: France/Germany (€6,000-€9,000), Expensive: Netherlands (€12,000-€13,000). Living costs: €700-€1,200/month depending on country. Plan total budget accordingly."
    
    # GPA/Academic queries
    if "gpa" in query_lower or "academic" in query_lower or "grades" in query_lower:
        return "Most master's programs require minimum GPA of 3.0+ (on 4.0 scale). Top-tier universities prefer 3.5+. Your GPA combined with IELTS and work experience determines admission chances. Strong GPA can help secure scholarships."
    
    # Country-specific help
    for country, info in country_info.items():
        if country in query_lower:
            return info
    
    # Living cost queries
    if "living" in query_lower or "accommodation" in query_lower or "food" in query_lower:
        return "Average monthly living costs (excluding tuition): France/Germany/Austria: €800-€1,000 | Netherlands/Belgium/Finland: €1,100-€1,200 | Italy/Spain: €700-€800. Budget includes rent, food, transport, and entertainment."
    
    # Application process
    if "apply" in query_lower or "application" in query_lower or "admission" in query_lower:
        return "Typical application requirements: Bachelor's degree + transcript, IELTS/TOEFL scores, Statement of Purpose (SOP), CV, recommendation letters, entrance exam (if required). Application timeline: 6-12 months before intake. Submit early for better scholarship chances."
    
    # Work after graduation
    if "work" in query_lower or "job" in query_lower or "career" in query_lower or "salary" in query_lower:
        return "Most European countries allow post-study work visas (1-2 years). Germany and Netherlands offer extended work permits. Average starting salaries for AI/CS graduates: €30,000-€50,000/year depending on country and role. EU degrees are highly valued globally."
    
    # Default response
    return f"I can help with queries about countries (France, Germany, Netherlands, Italy, Spain), IELTS requirements, scholarships, costs, application process, and career opportunities. Could you rephrase your question?"
