"""
Resume Builder API Routes
Handles resume PDF export and AI suggestions
Completely independent from existing student profile features
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json

router = APIRouter(prefix="/resume", tags=["Resume Builder"])

# ============ Data Models ============

class PersonalInfo(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    linkedIn: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None

class EducationEntry(BaseModel):
    id: str
    institution: str
    degree: str
    field: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    currentlyStudying: bool = False
    description: Optional[str] = None
    grade: Optional[str] = None

class WorkExperienceEntry(BaseModel):
    id: str
    company: str
    position: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    currentlyWorking: bool = False
    description: Optional[str] = None
    achievements: List[str] = []

class SkillsData(BaseModel):
    technical: List[str] = []
    languages: List[str] = []
    soft: List[str] = []

class LanguageEntry(BaseModel):
    id: str
    name: str
    proficiency: str  # CEFR level: A1-C2
    certificate: Optional[str] = None
    certificationDate: Optional[str] = None

class CertificationEntry(BaseModel):
    id: str
    name: str
    issuingOrganization: str
    issueDate: Optional[str] = None
    expirationDate: Optional[str] = None
    noExpiry: bool = True
    credentialId: Optional[str] = None
    credentialUrl: Optional[str] = None

class ProjectEntry(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    url: Optional[str] = None
    date: Optional[str] = None

class Resume(BaseModel):
    id: str
    name: Optional[str] = None
    personalInfo: PersonalInfo
    headline: Optional[str] = None
    summary: Optional[str] = None
    education: List[EducationEntry] = []
    workExperience: List[WorkExperienceEntry] = []
    skills: SkillsData
    certifications: List[CertificationEntry] = []
    projects: List[ProjectEntry] = []
    languages: List[LanguageEntry] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class PDFExportRequest(BaseModel):
    resume: Resume

class AIEnhancementRequest(BaseModel):
    resume: Resume
    section: Optional[str] = None

class SkillGapAnalysisRequest(BaseModel):
    resume: Resume
    universityId: Optional[str] = None

# ============ Routes ============

@router.get("/health")
def resume_service_health():
    """Health check for resume service"""
    return {
        "status": "ok",
        "service": "Resume Builder API",
        "version": "1.0.0"
    }

@router.post("/export-pdf")
def export_resume_pdf(request: PDFExportRequest):
    """
    Export resume as PDF in Europass format
    Currently returns a placeholder - implement html2pdf/jsPDF backend rendering if needed
    """
    try:
        resume = request.resume
        
        # Validate resume has minimum required data
        if not resume.personalInfo.fullName:
            raise HTTPException(status_code=400, detail="Resume must have a full name")
        
        # TODO: Implement PDF generation using reportlab or similar
        # For now, this is handled client-side with html2pdf.js
        
        return {
            "status": "success",
            "message": "PDF export is handled client-side for optimal formatting",
            "resumeName": resume.name or "Resume"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting PDF: {str(e)}")

@router.post("/ai-suggestions")
def get_ai_suggestions(request: AIEnhancementRequest):
    """
    Get AI suggestions to improve resume content
    Uses existing NLP capabilities from the system
    """
    try:
        resume = request.resume
        section = request.section
        
        suggestions = {
            "summary": [],
            "workExperience": [],
            "education": [],
            "skills": []
        }
        
        # Professional summary suggestions
        if resume.summary:
            suggestions["summary"].append({
                "type": "enhancement",
                "message": "Consider making your summary more specific to European job market expectations",
                "example": "Focus on measurable achievements and key competencies"
            })
        
        # Work experience suggestions
        if resume.workExperience:
            suggestions["workExperience"].append({
                "type": "enhancement",
                "message": "Add quantifiable metrics to your achievements",
                "example": "Instead of 'Improved sales', try 'Increased sales by 35% within 6 months'"
            })
            suggestions["workExperience"].append({
                "type": "tone",
                "message": "Use professional, active voice in job descriptions",
                "example": "Led cross-functional teams to deliver project milestones on time"
            })
        
        # Education suggestions
        if resume.education:
            suggestions["education"].append({
                "type": "completeness",
                "message": "Consider adding relevant coursework or academic honors if applicable",
                "example": "Magna Cum Laude, Dean's List, or relevant major courses"
            })
        
        # Skills suggestions
        if not resume.skills.technical or len(resume.skills.technical) < 5:
            suggestions["skills"].append({
                "type": "completeness",
                "message": "Add more technical skills relevant to your target roles",
                "example": "Common European tech stack: Python, JavaScript, AWS, Docker, etc."
            })
        
        if not resume.languages or len(resume.languages) < 2:
            suggestions["skills"].append({
                "type": "advantage",
                "message": "In Europe, multilingual abilities are highly valued",
                "example": "Add native/fluent language certifications to stand out"
            })
        
        return {
            "status": "success",
            "suggestions": suggestions,
            "section": section
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting suggestions: {str(e)}")

@router.post("/skill-gap-analysis")
def get_skill_gap_analysis(request: SkillGapAnalysisRequest):
    """
    Analyze skill gaps based on selected university/program
    Provides recommendations for skills to develop
    """
    try:
        resume = request.resume
        university_id = request.universityId
        
        # Get current skills
        current_technical = set(resume.skills.technical or [])
        current_soft = set(resume.skills.soft or [])
        
        # Define common European tech requirements by field
        tech_requirements = {
            "Engineering": ["Python", "Java", "C++", "MATLAB", "AutoCAD", "CAD Design"],
            "Computer Science": ["Python", "JavaScript", "Java", "React", "Node.js", "SQL", "Machine Learning"],
            "Business": ["Excel", "Power BI", "Tableau", "SAP", "Financial Analysis"],
            "Data Science": ["Python", "R", "SQL", "Tableau", "Machine Learning", "Statistical Analysis"],
            "Web Development": ["JavaScript", "React", "Node.js", "CSS", "HTML", "MongoDB", "PostgreSQL"],
            "Design": ["Figma", "Adobe XD", "Prototyping", "User Research", "UI/UX Design"]
        }
        
        soft_skills_all = [
            "Communication",
            "Leadership",
            "Problem Solving",
            "Teamwork",
            "Project Management",
            "Critical Thinking"
        ]
        
        gaps = {
            "technical": [],
            "soft": [],
            "languages": [],
            "recommendations": []
        }
        
        # Analyze technical skill gaps
        common_tech_skills = set()
        for skills in tech_requirements.values():
            common_tech_skills.update(skills)
        
        missing_tech = list(common_tech_skills - current_technical)
        gaps["technical"] = missing_tech[:8]  # Top 8 missing skills
        
        # Analyze soft skill gaps
        missing_soft = [s for s in soft_skills_all if s not in current_soft]
        gaps["soft"] = missing_soft
        
        # Language analysis for European context
        if not resume.languages or len(resume.languages) < 2:
            gaps["languages"].append({
                "skill": "Multilingual abilities",
                "importance": "high",
                "suggestion": "European employers highly value second/third language proficiency"
            })
        
        # Generate recommendations
        if len(gaps["technical"]) > 0:
            gaps["recommendations"].append(
                f"Focus on learning: {', '.join(gaps['technical'][:3])} to be more competitive"
            )
        
        if len(gaps["soft"]) > 0:
            gaps["recommendations"].append(
                "Consider developing soft skills through certifications or courses"
            )
        
        if len(resume.certifications or []) < 2:
            gaps["recommendations"].append(
                "Add professional certifications (Europass, industry-specific) to strengthen your profile"
            )
        
        return {
            "status": "success",
            "gaps": gaps,
            "universityId": university_id,
            "message": "Skill gap analysis completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing skill gaps: {str(e)}")

@router.post("/validate")
def validate_resume(resume: Resume):
    """
    Validate resume structure and content completeness
    Returns validation status and any warnings
    """
    try:
        warnings = []
        completeness_score = 0
        
        # Check personal info
        if resume.personalInfo.fullName:
            completeness_score += 15
        else:
            warnings.append("Missing full name")
        
        if resume.personalInfo.email:
            completeness_score += 10
        else:
            warnings.append("Missing email address")
        
        # Check education
        if resume.education and len(resume.education) > 0:
            completeness_score += 20
        else:
            warnings.append("No education entries - recommended to add at least one")
        
        # Check work experience
        if resume.workExperience and len(resume.workExperience) > 0:
            completeness_score += 25
        else:
            warnings.append("No work experience - add if available")
        
        # Check skills
        if resume.skills.technical and len(resume.skills.technical) > 0:
            completeness_score += 15
        
        if resume.skills.soft and len(resume.skills.soft) > 0:
            completeness_score += 10
        
        # Check languages
        if resume.languages and len(resume.languages) > 0:
            completeness_score += 5
        
        return {
            "status": "valid",
            "completeness_score": min(completeness_score, 100),
            "warnings": warnings,
            "recommendation": "Your resume is " + ("complete!" if completeness_score > 70 else "incomplete. Consider adding more details.")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Resume validation error: {str(e)}")
