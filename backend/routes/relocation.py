from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/api/relocation", tags=["EuroPath AI: Relocation Guide"])

class RelocationStep(BaseModel):
    id: str
    title: str
    description: str
    links: List[Dict[str, str]]

class RelocationData(BaseModel):
    country_name: str
    steps: List[RelocationStep]

RELOCATION_GUIDES = {
    "GERMANY": {
        "country_name": "Germany",
        "steps": [
            {
                "id": "housing",
                "title": "Find Housing",
                "description": "Start looking for accommodation early. Most students look for a 'WG' (shared flat).",
                "links": [
                    {"name": "WG-Gesucht", "url": "https://www.wg-gesucht.de/"},
                    {"name": "ImmobilienScout24", "url": "https://www.immobilienscout24.de/"}
                ]
            },
            {
                "id": "registration",
                "title": "City Registration (Anmeldung)",
                "description": "Within 2 weeks of moving, you must register your address at the local Bürgeramt.",
                "links": [
                    {"name": "Bürgeramt Info", "url": "https://service.berlin.de/dienstleistung/120686/"}
                ]
            },
            {
                "id": "bank_account",
                "title": "Open a Bank Account",
                "description": "You'll need a German bank account for rent and insurance payments.",
                "links": [
                    {"name": "N26 (Digital)", "url": "https://n26.com/"},
                    {"name": "Deutsche Bank", "url": "https://www.deutsche-bank.de/"}
                ]
            }
        ]
    },
    "FRANCE": {
        "country_name": "France",
        "steps": [
            {
                "id": "housing",
                "title": "Secure Housing",
                "description": "Check CROUS for student housing or search on private portals.",
                "links": [
                    {"name": "Leboncoin", "url": "https://www.leboncoin.fr/"},
                    {"name": "SeLoger", "url": "https://www.seloger.com/"}
                ]
            },
            {
                "id": "caf",
                "title": "Apply for CAF (Housing Subsidy)",
                "description": "Students in France can often get a portion of their rent back from the government.",
                "links": [
                    {"name": "CAF Portal", "url": "https://www.caf.fr/"}
                ]
            },
            {
                "id": "bank",
                "title": "French Bank Account",
                "description": "Necessary for your CAF payments and phone contracts.",
                "links": [
                    {"name": "BNP Paribas", "url": "https://mabanque.bnpparibas/"}
                ]
            }
        ]
    }
}

@router.get("/supported-countries", response_model=List[Dict[str, str]])
async def get_supported_countries():
    return [
        {"code": k, "name": v["country_name"]} 
        for k, v in RELOCATION_GUIDES.items()
    ]

@router.get("/{country_code}", response_model=RelocationData)
async def get_relocation_guide(country_code: str):
    code = country_code.upper()
    if code not in RELOCATION_GUIDES:
        raise HTTPException(status_code=404, detail="Relocation guide for this country not found")
    return RELOCATION_GUIDES[code]
