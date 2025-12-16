def predict_admission(profile):
    score = (profile.gpa * 10) + (profile.ielts * 5)

    if score >= 120:
        return "High"
    elif score >= 90:
        return "Medium"
    else:
        return "Low"
