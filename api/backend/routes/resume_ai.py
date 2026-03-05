from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/resume/ai", tags=["Resume AI"])

class SummaryRequest(BaseModel):
    name: str
    headline: Optional[str] = None
    education: List[dict] = []
    experience: List[dict] = []
    skills: List[str] = []

@router.post("/generate-summary")
async def generate_summary(request: SummaryRequest):
    """
    Generates a professional summary based on resume data.
    In a production app, this would call GPT/LLM.
    Here we use a sophisticated template-based logic to simulate AI.
    """
    try:
        if not request.experience and not request.education:
            return {"summary": f"Aspiring professional with a focus on {', '.join(request.skills[:3]) if request.skills else 'career development'}."}

        # Simulate "AI" logic
        sentences = []
        
        # Opening
        if request.headline:
            sentences.append(f"Highly motivated {request.headline} with a strong background in {', '.join(request.skills[:3]) if request.skills else 'professional excellence'}.")
        else:
            sentences.append(f"Experienced professional with a proven track record in {', '.join(request.skills[:2]) if request.skills else 'their field'}.")

        # Experience highlight
        if request.experience:
            top_exp = request.experience[0]
            sentences.append(f"Previously served as {top_exp.get('position')} at {top_exp.get('company')}, where I developed expertise in {', '.join(request.skills[2:4]) if len(request.skills) > 3 else 'project delivery'}.")
        
        # Education highlight
        if request.education:
            top_edu = request.education[0]
            sentences.append(f"Holds a {top_edu.get('degree')} in {top_edu.get('field', 'my field')} from {top_edu.get('institution')}.")

        # Conclusion
        sentences.append("Dedicated to leveraging my analytical skills and international mindset to contribute to innovative European projects.")

        summary = " ".join(sentences)
        
        return {
            "status": "success",
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
