def analyze_profile(profile):
    return {
        "academic_score": (profile.gpa * 10) + profile.ielts,
        "budget": profile.budget
    }
