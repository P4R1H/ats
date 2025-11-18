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
from ml_integration.scoring import check_requirements, calculate_final_score
import json

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
        # Parse JSON fields from job
        try:
            required_skills = json.loads(job.required_skills) if job.required_skills else []
        except:
            required_skills = []

        try:
            preferred_skills = json.loads(job.preferred_skills) if job.preferred_skills else []
        except:
            preferred_skills = []

        try:
            requirements = json.loads(job.requirements) if job.requirements else {}
        except:
            requirements = {}

        # Get job requirements from requirements field
        job_min_education = requirements.get('min_education', 'none')
        job_certs_required = requirements.get('certifications_required', False)
        job_leadership_required = requirements.get('leadership_required', False)

        # Calculate skills match percentage
        candidate_skills_lower = [s.lower() for s in analysis.skills]
        required_skills_lower = [s.lower() for s in required_skills]
        preferred_skills_lower = [s.lower() for s in preferred_skills]

        total_skills = len(required_skills_lower) + len(preferred_skills_lower)
        if total_skills > 0:
            matched_required = len([s for s in required_skills_lower if s in candidate_skills_lower])
            matched_preferred = len([s for s in preferred_skills_lower if s in candidate_skills_lower])
            skills_match_pct = ((matched_required + matched_preferred) / total_skills) * 100
        else:
            skills_match_pct = 0

        # Find missing skills
        missing_required = [s for s in required_skills_lower if s not in candidate_skills_lower]
        missing_preferred = [s for s in preferred_skills_lower if s not in candidate_skills_lower]

        # Check if meets requirements using actual scoring function
        meets_reqs, missing_reqs, rejection_reason = check_requirements(
            candidate_skills=candidate_skills_lower,
            candidate_experience=float(analysis.experience_years),
            candidate_education=analysis.education_level,
            candidate_has_certifications=analysis.has_certifications,
            candidate_has_leadership=analysis.has_leadership,
            job_required_skills=required_skills_lower,
            job_min_experience=job.min_experience or 0,
            job_min_education=job_min_education,
            job_certifications_required=job_certs_required,
            job_leadership_required=job_leadership_required
        )

        # Calculate predicted score using actual scoring function
        score_result = calculate_final_score(
            candidate_skills=candidate_skills_lower,
            candidate_experience=float(analysis.experience_years),
            candidate_education=analysis.education_level,
            candidate_has_certifications=analysis.has_certifications,
            candidate_has_leadership=analysis.has_leadership,
            candidate_skill_diversity=0.5,  # Default diversity score
            job_required_skills=required_skills_lower,
            job_preferred_skills=preferred_skills_lower,
            job_min_experience=job.min_experience or 0,
            job_min_education=job_min_education,
            job_certifications_required=job_certs_required,
            job_leadership_required=job_leadership_required,
        )

        potential_score = score_result['final_score']

        # Predict percentile (simplified - in real system would compare against other applicants)
        # Use score as baseline percentile
        predicted_percentile = min(95, potential_score)

        # Calculate overall match score (weighted combination)
        match_score = (
            (skills_match_pct * 0.4) +
            (potential_score * 0.4) +
            (100 if meets_reqs else 0) * 0.2
        )

        recommendations.append(JobRecommendation(
            job={
                'id': job.id,
                'title': job.title,
                'category': job.category,
                'description': job.description[:200] + '...' if len(job.description) > 200 else job.description,
            },
            match_score=match_score,
            skills_match_percentage=round(skills_match_pct, 1),
            predicted_percentile=round(predicted_percentile, 1),
            missing_required_skills=missing_required,
            missing_preferred_skills=missing_preferred,
            meets_requirements=meets_reqs,
            potential_score=round(potential_score, 1),
        ))

    # Sort by match score (highest first)
    recommendations.sort(key=lambda x: x.match_score, reverse=True)

    # Return top 20 recommendations
    return recommendations[:20]
