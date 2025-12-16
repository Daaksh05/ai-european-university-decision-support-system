def answer_query(query):
    query = query.lower()

    if "france" in query:
        return "France offers affordable education with strong AI programs."
    elif "ielts" in query:
        return "Most universities require IELTS between 6.0 and 7.5."
    elif "scholarship" in query:
        return "Scholarships are available through Erasmus+ and Campus France."
    else:
        return "Please provide more details about your query."
