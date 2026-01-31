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
        "spain": "Spain provides affordable education (€4,500/year) with strong programs. Barcelona and Madrid universities are well-ranked. IELTS: 6.5. Living cost: €800/month.",
        "belgium": "Belgium offers quality education at moderate costs (€5,000-€8,000/year). KU Leuven and Ghent University are highly ranked. Both French and Dutch-speaking programs available. IELTS: 6.5. Living costs: €900-€1,000/month. Great location in the heart of Europe!",
        "sweden": "Sweden offers high-quality education with tuition fees around €10,000-€15,000/year for non-EU students. Universities like KTH and Lund are world-class. IELTS: 6.5. Living costs: €900-€1,100/month. Many programs taught in English.",
        "austria": "Austria provides affordable education (€1,500-€8,000/year) with excellent technical universities. Vienna University of Technology is renowned. IELTS: 6.0-6.5. Living costs: €900-€1,000/month. Beautiful country with rich culture!",
        "finland": "Finland offers free education for EU students, €8,000-€12,000/year for non-EU. Universities like Aalto and Helsinki are top-ranked. IELTS: 6.5. Living costs: €800-€1,000/month. High quality of life and education.",
        "switzerland": "Switzerland has high tuition fees (€1,000-€3,000/year for public universities) but world-class education. ETH Zurich is globally renowned. IELTS: 7.0. Living costs are high: €1,500-€2,000/month. Excellent for research and innovation."
    }
    
    # Test requirements
    if "ielts" in query_lower or "toefl" in query_lower or "english test" in query_lower:
        if "requirement" in query_lower or "how much" in query_lower or "score" in query_lower:
            return "IELTS requirements vary by university and program: Most require 6.0-7.0. Top universities typically require 6.5-7.5. Some universities accept 5.5 minimum. TOEFL equivalent: 80-100 iBT. Check specific university requirements for accurate information."
        else:
            return "IELTS (International English Language Testing System) is widely accepted for university admissions in Europe. Scores range from 0-9, with 6.0+ typically required for master's programs. TOEFL is also accepted by most universities."
    
    # Scholarship queries
    if "scholarship" in query_lower or "funding" in query_lower or "financial aid" in query_lower:
        return "Popular scholarships include: Erasmus+ (Europe-wide), DAAD (Germany), Eiffel Excellence (France), Orange Tulip (Netherlands), Campus France, Swedish Institute Scholarships, and country-specific schemes. Most require merit-based selection with strong academic records. Apply early (6-12 months before intake)!"
    
    # Cost/Budget queries
    if "cost" in query_lower or "budget" in query_lower or "expensive" in query_lower or "cheap" in query_lower or "afford" in query_lower or "fee" in query_lower or "tuition" in query_lower:
        return "Tuition costs vary significantly: Cheapest: Italy/Spain (€3,000-€4,500/year), Mid-range: France/Germany/Belgium (€5,000-€9,000), Expensive: Netherlands/Sweden (€12,000-€15,000). Living costs: €700-€1,200/month depending on country. Germany has many FREE public universities! Plan total budget accordingly."
    
    # GPA/Academic queries
    if "gpa" in query_lower or "academic" in query_lower or "grades" in query_lower or "cgpa" in query_lower:
        return "Most master's programs require minimum GPA of 3.0+ (on 4.0 scale) or 60%+ (on 100% scale). Top-tier universities prefer 3.5+. Your GPA combined with IELTS and work experience determines admission chances. Strong GPA can help secure scholarships and assistantships."
    
    # Country-specific help (check this BEFORE default to catch country queries)
    for country, info in country_info.items():
        if country in query_lower:
            return info
    
    # Living cost queries
    if "living" in query_lower or "accommodation" in query_lower or "food" in query_lower or "rent" in query_lower:
        return "Average monthly living costs (excluding tuition): France/Germany/Austria: €800-€1,000 | Netherlands/Belgium/Finland: €1,000-€1,200 | Italy/Spain: €700-€800 | Switzerland: €1,500-€2,000. Budget includes rent, food, transport, and entertainment. Student housing is usually cheaper than private apartments."
    
    # Application process
    if "apply" in query_lower or "application" in query_lower or "admission" in query_lower or "document" in query_lower:
        return "Typical application requirements: Bachelor's degree + transcript, IELTS/TOEFL scores, Statement of Purpose (SOP), CV/Resume, 2-3 recommendation letters, entrance exam (if required). Application timeline: 6-12 months before intake. Submit early for better scholarship chances. Most universities have online portals."
    
    # Work after graduation
    if "work" in query_lower or "job" in query_lower or "career" in query_lower or "salary" in query_lower or "employment" in query_lower:
        return "Most European countries allow post-study work visas (1-2 years). Germany and Netherlands offer extended work permits. Average starting salaries for AI/CS graduates: €30,000-€50,000/year depending on country and role. EU degrees are highly valued globally. Job markets are strong in tech hubs."
    
    # Visa queries
    if "visa" in query_lower or "permit" in query_lower or "immigration" in query_lower:
        return "Student visa requirements vary by country but generally include: Admission letter, proof of funds (blocked account for Germany: €11,208/year), health insurance, valid passport, visa application form. Processing time: 4-8 weeks. Apply 3 months before course starts. Some countries require biometrics."
    
    # Default response
    return f"I can help with queries about countries (France, Germany, Netherlands, Italy, Spain, Belgium, Sweden, Austria, Finland, Switzerland), IELTS requirements, scholarships, costs, application process, visas, and career opportunities. Could you rephrase your question?"
