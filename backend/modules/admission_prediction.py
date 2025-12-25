def predict_admission(profile):
    gpa = profile.gpa or 0
    ielts = profile.ielts or 0
    budget = profile.budget or 0

    # Normalize values
    gpa_score = min(gpa / 4.0, 1)
    ielts_score = min(ielts / 9.0, 1)
    budget_score = min(budget / 20000, 1)  # 20k reference

    # Weighted score
    final_score = (
        gpa_score * 0.4 +
        ielts_score * 0.3 +
        budget_score * 0.3
    )

    final_score = round(final_score * 100, 2)

    # Decision logic
    if final_score >= 75:
        return {
            "level": "HIGH",
            "score": final_score,
            "message": "Excellent profile! You have a strong chance of admission."
        }
    elif final_score >= 50:
        return {
            "level": "MEDIUM",
            "score": final_score,
            "message": "Good profile. You have a reasonable chance of admission."
        }
    else:
        return {
            "level": "LOW",
            "score": final_score,
            "message": "Low admission chance. Improving GPA or IELTS can help."
        }
