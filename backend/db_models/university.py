from typing import Optional
from sqlmodel import Field, SQLModel

class University(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    university: str = Field(index=True)
    country: str = Field(index=True)
    city: str
    field: str
    min_gpa: float
    min_ielts: float
    average_fees_eur: float
    ranking: int
    course_url: Optional[str] = None
