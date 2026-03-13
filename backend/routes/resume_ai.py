from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.groq_service import groq_service

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
    Generates a professional summary based on resume data using Groq LLM.
    Falls back to template-based logic if Groq is not configured.
    """
    try:
        # Attempt to use Groq for high-quality generation
        if groq_service.client:
            prompt = (
                f"Generate a professional, compelling resume summary for {request.name}. "
                f"Headline: {request.headline or 'Professional'}. "
                f"Education: {str(request.education)}. "
                f"Experience: {str(request.experience)}. "
                f"Skills: {', '.join(request.skills)}. "
                f"The summary should be 3-4 sentences long, highlighting achievements and fit for European roles."
            )
            
            system_prompt = (
                "You are an expert career coach specializing in European jobs and admissions. "
                "Write clear, impactful, and professional resume summaries."
            )
            
            ai_summary = await groq_service.generate_response(prompt, system_prompt)
            if ai_summary:
                return {
                    "status": "success",
                    "summary": ai_summary,
                    "engine": "Groq LLM (Llama 3)"
                }

        # Fallback to sophisticated template-based logic
        if not request.experience and not request.education:
            return {"summary": f"Aspiring professional with a focus on {', '.join(request.skills[:3]) if request.skills else 'career development'}."}

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
            "summary": summary,
            "engine": "Template Engine (Fallback)"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
