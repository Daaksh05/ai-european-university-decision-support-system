from fastapi import APIRouter, HTTPException
from typing import List, Dict

router = APIRouter(prefix="/api/visa", tags=["Visa & Document Tracker"])

# Country-specific visa requirements data
VISA_REQUIREMENTS = {
    "GERMANY": {
        "country_name": "Germany",
        "visa_type": "National Visa (D-Type) for Study",
        "categories": [
            {
                "title": "Mandatory Documents",
                "items": [
                    {"id": "passport", "label": "Valid Passport", "description": "Must be valid for at least 3-6 months beyond stay."},
                    {"id": "visa_app", "label": "Visa Application Form", "description": "Duly filled and signed National Visa application forms."},
                    {"id": "photos", "label": "Biometric Photos", "description": "Two recent passport-sized photos (35mm x 45mm)."},
                    {"id": "admit_letter", "label": "Admission Letter", "description": "Unconditional or conditional letter from a German university."},
                ]
            },
            {
                "title": "Financial Proof",
                "items": [
                    {"id": "blocked_account", "label": "Blocked Account (Sperrkonto)", "description": "Proof of €11,208 for one year (2024/25 rate)."},
                    {"id": "scholarship", "label": "Scholarship Proof", "description": "If applicable, official scholarship award letter."},
                ]
            },
            {
                "title": "Health & Academic",
                "items": [
                    {"id": "health_ins", "label": "Health Insurance", "description": "Travel health insurance followed by statutory/private German insurance."},
                    {"id": "academic_trans", "label": "Academic Transcripts", "description": "Original certificates and transcripts of previous education."},
                    {"id": "aps", "label": "APS Certificate", "description": "Mandatory for students from India, China, and Vietnam."},
                ]
            }
        ]
    },
    "FRANCE": {
        "country_name": "France",
        "visa_type": "VLS-TS (Long-stay visa)",
        "categories": [
            {
                "title": "Basic Documents",
                "items": [
                    {"id": "france_visas", "label": "France-Visas Form", "description": "Registration receipt from France-Visas portal."},
                    {"id": "ee_france", "label": "Etudes en France Attestation", "description": "Confirmation of completion of Campus France process."},
                    {"id": "photos", "label": "Passport Photos", "description": "Recent photos complying with ISO standards."},
                ]
            },
            {
                "title": "Proof of Accommodation",
                "items": [
                    {"id": "housing", "label": "Housing Proof", "description": "Lease, CROUS letter, or 'attestation d'hébergement' for the first 3 months."},
                ]
            },
            {
                "title": "Financial Resources",
                "items": [
                    {"id": "funds", "label": "Proof of Funds", "description": "Bank statements showing at least €615 per month for one academic year."},
                ]
            }
        ]
    },
    "ITALY": {
        "country_name": "Italy",
        "visa_type": "National Visa (Type D) - Study",
        "categories": [
            {
                "title": "Pre-Enrolment",
                "items": [
                    {"id": "universitaly", "label": "Universitaly Summary", "description": "Summary of your pre-enrolment on the Universitaly portal."},
                    {"id": "dov", "label": "DOV / CIMEA", "description": "Declaration of Value or CIMEA Statement of Comparability."},
                ]
            },
            {
                "title": "Financial & Medical",
                "items": [
                    {"id": "funds", "label": "Financial Means", "description": "Minimum of €6,000 per year proof of sustenance."},
                    {"id": "medical", "label": "Health Insurance", "description": "Policy valid for Italy for the duration of stay."},
                ]
            }
        ]
    }
}

@router.get("/requirements/{country_code}")
async def get_visa_requirements(country_code: str):
    code = country_code.upper()
    if code not in VISA_REQUIREMENTS:
        raise HTTPException(status_code=404, detail="Country requirements not found")
    return VISA_REQUIREMENTS[code]

@router.get("/countries")
async def get_supported_countries():
    return [
        {"code": k, "name": v["country_name"]} 
        for k, v in VISA_REQUIREMENTS.items()
    ]
