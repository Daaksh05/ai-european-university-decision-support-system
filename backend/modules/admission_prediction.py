def predict_admission(profile):
    gpa = profile.gpa or 0
    ielts = profile.ielts or 0
    budget = profile.budget or 0

    # ---------- NORMALIZED SCORES ----------
    gpa_score = min(gpa / 4.0, 1.0)          # out of 4
    ielts_score = min(ielts / 9.0, 1.0)      # out of 9
    budget_score = min(budget / 20000, 1.0)  # 20k reference

    # ---------- FINAL WEIGHTED SCORE ----------
    final_score = (
        gpa_score * 0.45 +
        ielts_score * 0.35 +
        budget_score * 0.20
    )

    probability = round(final_score * 100)

    # ---------- DECISION ----------
    if final_score >= 0.75:
        chance = "HIGH"
        message = "Excellent profile! Strong chances of admission."
    elif final_score >= 0.5:
        chance = "MEDIUM"
        message = "Good profile. You have fair chances of admission."
    else:
        chance = "LOW"
        message = "Profile needs improvement to increase admission chances."

    return {
        "chance": chance,
        "probability": probability,
        "message": message
    }