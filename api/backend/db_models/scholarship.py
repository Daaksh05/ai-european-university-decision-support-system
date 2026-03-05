from typing import Optional
from sqlmodel import Field, SQLModel

class Scholarship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scholarship_name: str = Field(index=True)
    country: str = Field(index=True)
    eligible_universities: str
    coverage: str
    amount_eur: Optional[float] = None
    eligibility: str
    website_url: Optional[str] = None
