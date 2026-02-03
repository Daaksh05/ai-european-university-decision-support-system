import pandas as pd
import os

def answer_query(query):
    """Intelligent NLP-based query answering system with context prioritization"""
    query_lower = query.lower()
    
    # Comprehensive knowledge base
    country_data = {
        "france": {
            "general": "France offers affordable education (€6,000-€8,000/year) with strong AI and Computer Science programs.",
            "universities": "Top universities include Sorbonne, Paris-Saclay, and Grenoble.",
            "ielts": "IELTS requirement: 6.0-6.5.",
            "scholarships": "Major scholarships: Eiffel Excellence, Charpak, and Erasmus+.",
            "living": "Living costs in France: €800-€1,000/month (Paris is higher).",
            "visa": "VLS-TS student visa required. Needs Campus France procedure for many countries."
        },
        "germany": {
            "general": "Germany offers low-cost education with excellent STEM programs. Many public universities have no tuition fees.",
            "universities": "Top choices: TU Munich, RWTH Aachen, and TU Berlin.",
            "ielts": "IELTS requirement: 6.5 minimum for most English programs.",
            "scholarships": "DAAD is the primary scholarship provider for international students.",
            "living": "Living costs: €850-€1,000/month. Blocked account (Sperrkonto) required: ~€11,208/year.",
            "visa": "National Visa (Type D) required. Proof of financial means is critical."
        },
        "netherlands": {
            "general": "Netherlands has high tuition fees (€12,000-€15,000/year) but world-class education quality.",
            "universities": "Top-ranked: University of Amsterdam and TU Delft.",
            "ielts": "IELTS requirement: 7.0 is standard for top programs.",
            "scholarships": "Orange Tulip Scholarship (OTS) and Holland Scholarship are popular.",
            "living": "Living costs: €1,000-€1,200/month. Housing is competitive.",
            "visa": "MVV (Entry Visa) and VVR (Residence Permit) handled via the university."
        },
        "italy": {
            "general": "Italy offers very affordable education (€1,000-€4,000/year) based on family income (ISEE).",
            "universities": "Top ranked: Politecnico di Milano and University of Bologna.",
            "ielts": "IELTS requirement: 6.0-6.5.",
            "scholarships": "Regional DSU scholarships cover tuition and provide stipends.",
            "living": "Living costs: €700-€900/month. Northern cities are more expensive.",
            "visa": "Type D National Visa. Requires pre-enrollment on Universitaly portal."
        },
        "spain": {
            "general": "Spain is known for its world-class business schools and strong architecture programs with relatively low tuition fees.",
            "universities": "Top choices: University of Barcelona, Autonomous University of Madrid, and UPF.",
            "ielts": "IELTS requirement: 6.0-6.5 standard for most programs.",
            "scholarships": "MAEC-AECID and Fulbright Spain are notable scholarship programs.",
            "living": "Living costs: €800-€1,100/month depending on the city (Madrid and Barcelona are pricier).",
            "visa": "Student Visa (Type D) required for stays longer than 90 days."
        },
        "sweden": {
            "general": "Sweden offers high-quality education with a focus on sustainability, innovation, and equality. Tuition is free for EU students, but others pay fees.",
            "universities": "Top-ranked: KTH Royal Institute of Technology, Lund University, and Uppsala University.",
            "ielts": "IELTS requirement: 6.5 minimum is typical.",
            "scholarships": "Swedish Institute (SI) Scholarships for Global Professionals is a major grant.",
            "living": "Living costs: €900-€1,200/month. High standard of living.",
            "visa": "Residence permit for studies is required for non-EU students."
        },
        "belgium": {
            "general": "Belgium offers a multi-cultural environment with high-quality education, particularly in political science and international relations.",
            "universities": "Top choices: KU Leuven, Ghent University, and Université Catholique de Louvain.",
            "ielts": "IELTS requirement: 6.5 standard.",
            "scholarships": "Master Mind Scholarships (Flanders) and ARES grants (Wallonia-Brussels) are popular.",
            "living": "Living costs: €850-€1,100/month.",
            "visa": "Type D student visa. Requires proof of sufficient financial means."
        },
        "switzerland": {
            "general": "Switzerland is home to world-leading research universities and prestigious hospitality schools, though living costs are among the highest in Europe.",
            "universities": "Top tier: ETH Zurich, EPFL, and University of Zurich.",
            "ielts": "IELTS requirement: 7.0 for top programs.",
            "scholarships": "Swiss Government Excellence Scholarships are highly competitive.",
            "living": "Living costs: €1,500-€2,200/month. Health insurance is mandatory and costly.",
            "visa": "Study permit required. Process varies by canton."
        }

    }
    
    # 1. Detect Country First
    target_country = None
    for country in country_data:
        if country in query_lower:
            target_country = country
            break
            
    # 2. Topic Detection & Response Generation
    if target_country:
        data = country_data[target_country]
        if "scholarship" in query_lower or "funding" in query_lower:
            return f"Regarding scholarships in {target_country.capitalize()}: {data['scholarships']} {data['general']}"
        if "ielts" in query_lower or "score" in query_lower or "english" in query_lower:
            return f"The {data['ielts']} is typical for {target_country.capitalize()}. {data['universities']}"
        if "cost" in query_lower or "budget" in query_lower or "fee" in query_lower or "tuition" in query_lower:
            return f"{data['general']} {data['living']}"
        if "living" in query_lower or "rent" in query_lower or "accommodation" in query_lower:
            return f"{data['living']} Most students budget around that range excluding tuition."
        if "visa" in query_lower or "permit" in query_lower:
            return f"For {target_country.capitalize()} visa: {data['visa']}"
        
        # Default for country but no specific topic
        return f"{target_country.capitalize()} info: {data['general']} {data['universities']} {data['scholarships']}"

    # 3. Global Topic Detection (No country specified)
    if "scholarship" in query_lower or "funding" in query_lower:
        return "Popular scholarships include: Erasmus+ (Global), DAAD (Germany), Eiffel (France), and Holland Scholarship (Netherlands). Most require merit-based selection. Apply 6-12 months early!"
    
    if "ielts" in query_lower or "english" in query_lower:
        return "Most European universities require IELTS 6.0-7.0. Germany/France typically 6.5, Netherlands 7.0, and Italy 6.0. Always check the specific program's requirement."

    if "cost" in query_lower or "fee" in query_lower or "budget" in query_lower:
        return "Tuition varies: Germany/Italy are cheapest (€0-€4,000), France/Belgium mid-range (€5k-€9k), Netherlands/Sweden higher (€12k-€15k). Living costs average €800-€1,200/month."

    if "work" in query_lower or "job" in query_lower:
        return "Most countries offer 1-year post-study work visas. Tech hubs like Berlin, Amsterdam, and Paris have strong job markets for AI and CS graduates. Salaries range €35k-€55k."

    # Final Fallback
    return "I can provide specific details about France, Germany, Netherlands, Italy, Spain, Sweden, Belgium, and Switzerland regarding scholarships, IELTS, costs, and visas. Try asking 'Scholarships in Spain' or 'Tuition fees in Switzerland'."
