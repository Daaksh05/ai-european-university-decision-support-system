from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/ai/sop", tags=["AI SOP Assistant"])

class SOPRequest(BaseModel):
    universityName: str
    courseName: str
    studentBackground: str
    careerGoals: str
    tone: str = "Professional"  # Professional, Academic, Enthusiastic

@router.post("/generate")
async def generate_sop(request: SOPRequest):
    """
    Generates a tailored Statement of Purpose (SOP) / Motivation Letter.
    Simulates AI-driven generation with template-based logic.
    """
    try:
        # Tone adjustments
        tone_map = {
            "Professional": "structured and result-oriented",
            "Academic": "deeply intellectual and research-focused",
            "Enthusiastic": "passionate and energetic"
        }
        
        style_desc = tone_map.get(request.tone, "balanced")
        
        # Build the SOP paragraphs
        paragraphs = []
        
        # Paragraph 1: Introduction & Motivation
        paragraphs.append(
            f"I am writing to express my strong interest in the {request.courseName} program at {request.universityName}. "
            f"Having followed the academic excellence and innovative research coming out of your institution, "
            f"I am convinced that this program is the ideal next step for my academic and professional journey. "
            f"My decision to apply is driven by a deep-seated interest in {request.courseName} and a desire to contribute "
            f"to the vibrant academic community at {request.universityName}."
        )
        
        # Paragraph 2: Academic & Professional Background
        paragraphs.append(
            f"My background in {request.studentBackground} has provided me with a solid foundation to excel in this field. "
            f"Throughout my previous experiences, I have developed a keen analytical mindset and a technical proficiency "
            f"that aligns perfectly with the rigorous standards of your curriculum. I have always pushed myself to "
            f"understand the underlying principles of {request.courseName}, and my practical work has further "
            f"solidified my resolve to pursue advanced studies."
        )
        
        # Paragraph 3: Why this University / Course
        paragraphs.append(
            f"What particularly draws me to {request.universityName} is its reputation for fostering {style_desc} "
            f"environments. The specific focus of the {request.courseName} program on international collaboration and "
            f"cutting-edge technology matches my own career aspirations. I am eager to learn from the distinguished "
            f"faculty and engage in the collaborative projects that define your institution's approach to education."
        )
        
        # Paragraph 4: Career Goals & Conclusion
        paragraphs.append(
            f"Looking ahead, my career goals involve {request.careerGoals}. I believe that the insights and skills "
            f"I will gain at {request.universityName} will be instrumental in achieving these objectives. "
            f"I am prepared for the challenges of postgraduate study and am excited about the prospect of bringing "
            f"my unique perspective to your program. Thank you for considering my application; I look forward to "
            f"the possibility of joining {request.universityName}."
        )
        
        full_text = "\n\n".join(paragraphs)
        
        return {
            "status": "success",
            "sop_text": full_text,
            "metadata": {
                "university": request.universityName,
                "course": request.courseName,
                "tone": request.tone
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
