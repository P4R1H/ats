"""
Resume analysis and job recommendations router
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
import PyPDF2
import io
import re

from database import get_db
from auth import get_current_user
from models import User, JobPosting, Application
from scoring import score_candidate, meets_requirements

router = APIRouter()


class ResumeAnalysis(BaseModel):
    skills: List[str]
    experience_years: int
    education_level: str
    has_certifications: bool
    has_leadership: bool


class JobRecommendation(BaseModel):
    job: Dict[str, Any]
    match_score: float
    skills_match_percentage: float
    predicted_percentile: float
    missing_required_skills: List[str]
    missing_preferred_skills: List[str]
    meets_requirements: bool
    potential_score: float


def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")


def analyze_resume_text(text: str) -> ResumeAnalysis:
    """
    Analyze resume text to extract skills, experience, and qualifications
    """
    text_lower = text.lower()

    # Common skill keywords (comprehensive list)
    all_skills = [
        # Programming Languages
        "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go", "rust",
        "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "shell", "bash",

        # Web Technologies
        "react", "angular", "vue", "nextjs", "next.js", "node.js", "nodejs", "express",
        "django", "flask", "fastapi", "spring", "asp.net", "laravel", "rails",
        "html", "css", "sass", "less", "tailwind", "bootstrap", "jquery",

        # Databases
        "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra",
        "oracle", "sql server", "sqlite", "dynamodb", "neo4j", "firebase",

        # Cloud & DevOps
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github actions",
        "terraform", "ansible", "puppet", "chef", "circleci", "travis ci",

        # Data Science & ML
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn",
        "pandas", "numpy", "data analysis", "statistics", "nlp", "computer vision",

        # Mobile
        "ios", "android", "react native", "flutter", "xamarin", "swift", "kotlin",

        # Design
        "ui/ux", "figma", "sketch", "adobe xd", "photoshop", "illustrator",

        # Soft Skills
        "leadership", "management", "communication", "teamwork", "problem solving",
        "agile", "scrum", "project management"
    ]

    detected_skills = []
    for skill in all_skills:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            detected_skills.append(skill.title())

    # Extract experience years
    experience_years = 0
    experience_patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience',
    ]
    for pattern in experience_patterns:
        match = re.search(pattern, text_lower)
        if match:
            experience_years = max(experience_years, int(match.group(1)))

    # Detect education level
    education_level = "High School"
    if re.search(r'\b(phd|ph\.d|doctorate|doctoral)\b', text_lower):
        education_level = "PhD"
    elif re.search(r'\b(master|m\.s\.|m\.a\.|mba|msc)\b', text_lower):
        education_level = "Master's"
    elif re.search(r'\b(bachelor|b\.s\.|b\.a\.|bsc|undergraduate)\b', text_lower):
        education_level = "Bachelor's"
    elif re.search(r'\b(associate|a\.a\.|a\.s\.)\b', text_lower):
        education_level = "Associate"

    # Detect certifications and leadership
    has_certifications = bool(re.search(
        r'\b(certification|certified|certificate|aws certified|azure certified|pmp|cissp)\b',
        text_lower
    ))

    has_leadership = bool(re.search(
        r'\b(lead|led|manager|managed|director|head of|team lead|supervisor|coordinated)\b',
        text_lower
    ))

    return ResumeAnalysis(
        skills=detected_skills,
        experience_years=experience_years,
        education_level=education_level,
        has_certifications=has_certifications,
        has_leadership=has_leadership
    )


@router.post("/analyze-resume", response_model=ResumeAnalysis)
async def analyze_resume(
    resume_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Analyze uploaded resume to extract skills and qualifications
    """
    # Validate file type
    if not resume_file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Read file
    contents = await resume_file.read()

    # Extract text from PDF
    text = extract_text_from_pdf(contents)

    # Analyze text
    analysis = analyze_resume_text(text)

    return analysis


@router.post("/jobs", response_model=List[JobRecommendation])
async def get_job_recommendations(
    analysis: ResumeAnalysis,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get job recommendations based on resume analysis
    """
    # Get all active jobs
    jobs = db.query(JobPosting).filter(JobPosting.status == "active").all()

    if not jobs:
        return []

    recommendations = []

    for job in jobs:
        # Create candidate profile from analysis
        candidate_profile = {
            'skills': [s.lower() for s in analysis.skills],
            'experience_years': analysis.experience_years,
            'education_level': analysis.education_level,
            'has_certifications': analysis.has_certifications,
            'has_leadership': analysis.has_leadership,
        }

        # Check if meets requirements
        req_check = meets_requirements(candidate_profile, job)

        # Calculate skills match percentage
        required_skills = [s.lower() for s in (job.required_skills or [])]
        preferred_skills = [s.lower() for s in (job.preferred_skills or [])]
        candidate_skills_lower = [s.lower() for s in analysis.skills]

        total_skills = len(required_skills) + len(preferred_skills)
        if total_skills > 0:
            matched_required = len([s for s in required_skills if s in candidate_skills_lower])
            matched_preferred = len([s for s in preferred_skills if s in candidate_skills_lower])
            skills_match_pct = ((matched_required + matched_preferred) / total_skills) * 100
        else:
            skills_match_pct = 0

        # Find missing skills
        missing_required = [s for s in required_skills if s.lower() not in candidate_skills_lower]
        missing_preferred = [s for s in preferred_skills if s.lower() not in candidate_skills_lower]

        # Calculate predicted score
        score_result = score_candidate(candidate_profile, job)
        potential_score = score_result['final_score']

        # Predict percentile (simplified - in real system would compare against other applicants)
        # Use score as baseline percentile
        predicted_percentile = min(95, potential_score)

        # Calculate overall match score (weighted combination)
        match_score = (
            (skills_match_pct * 0.4) +
            (potential_score * 0.4) +
            (100 if req_check['meets_all_requirements'] else 0) * 0.2
        )

        recommendations.append(JobRecommendation(
            job={
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'description': job.description[:200] + '...' if len(job.description) > 200 else job.description,
            },
            match_score=match_score,
            skills_match_percentage=round(skills_match_pct, 1),
            predicted_percentile=round(predicted_percentile, 1),
            missing_required_skills=missing_required,
            missing_preferred_skills=missing_preferred,
            meets_requirements=req_check['meets_all_requirements'],
            potential_score=round(potential_score, 1),
        ))

    # Sort by match score (highest first)
    recommendations.sort(key=lambda x: x.match_score, reverse=True)

    # Return top 20 recommendations
    return recommendations[:20]
