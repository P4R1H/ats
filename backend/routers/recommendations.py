"""
Resume analysis and job recommendations router
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import re
import PyPDF2
import io

from database import get_db
from auth import get_current_user
from models import User, JobPosting, Application
from ml_integration.scoring import check_requirements, calculate_final_score
from ml_integration.extract_skills import process_resume

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

    # Extract text from PDF bytes
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        text = text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    # Use the same process_resume function as the application flow
    processed = process_resume(text)

    # Convert to ResumeAnalysis format
    analysis = ResumeAnalysis(
        skills=processed['extracted_skills'],
        experience_years=int(processed['experience_years']),
        education_level=processed['education_level'],
        has_certifications=processed['has_certifications'],
        has_leadership=processed['has_leadership']
    )

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
        # Parse JSON fields from job - convert Column types to strings
        try:
            required_skills_str: str = str(job.required_skills) if job.required_skills else "[]"
            required_skills = json.loads(required_skills_str)
        except (json.JSONDecodeError, TypeError):
            required_skills = []

        try:
            preferred_skills_str: str = str(job.preferred_skills) if job.preferred_skills else "[]"
            preferred_skills = json.loads(preferred_skills_str)
        except (json.JSONDecodeError, TypeError):
            preferred_skills = []

        try:
            requirements_str: str = str(job.requirements) if job.requirements else "{}"
            requirements = json.loads(requirements_str)
        except (json.JSONDecodeError, TypeError):
            requirements = {}

        # Get job requirements from requirements field
        job_min_education = requirements.get('min_education', 'none')
        job_certs_required = requirements.get('certifications_required', False)
        job_leadership_required = requirements.get('leadership_required', False)

        # Calculate skills match percentage using simple lowercase comparison (same as application flow)
        candidate_skills_lower = [s.lower() for s in analysis.skills]
        required_skills_lower = [s.lower() for s in required_skills]
        preferred_skills_lower = [s.lower() for s in preferred_skills]

        total_skills = len(required_skills) + len(preferred_skills)
        if total_skills > 0:
            matched_required = len([s for s in required_skills_lower if s in candidate_skills_lower])
            matched_preferred = len([s for s in preferred_skills_lower if s in candidate_skills_lower])
            skills_match_pct = ((matched_required + matched_preferred) / total_skills) * 100
        else:
            skills_match_pct = 0

        # Find missing skills (return original casing for display)
        missing_required = [
            required_skills[i] for i, s in enumerate(required_skills_lower)
            if s not in candidate_skills_lower
        ]
        missing_preferred = [
            preferred_skills[i] for i, s in enumerate(preferred_skills_lower)
            if s not in candidate_skills_lower
        ]

        # Check if meets requirements using actual scoring function
        meets_reqs, missing_reqs, rejection_reason = check_requirements(
            candidate_skills=analysis.skills,  # Use original casing
            candidate_experience=float(analysis.experience_years),
            candidate_education=analysis.education_level,
            candidate_has_certifications=analysis.has_certifications,
            candidate_has_leadership=analysis.has_leadership,
            job_required_skills=required_skills,
            job_min_experience=job.min_experience or 0,
            job_min_education=job_min_education,
            job_certifications_required=job_certs_required,
            job_leadership_required=job_leadership_required
        )

        # Calculate predicted score using actual scoring function
        score_result = calculate_final_score(
            candidate_skills=analysis.skills,  # Use original casing
            candidate_experience=float(analysis.experience_years),
            candidate_education=analysis.education_level,
            candidate_has_certifications=analysis.has_certifications,
            candidate_has_leadership=analysis.has_leadership,
            candidate_skill_diversity=0.5,  # Default diversity score
            job_required_skills=required_skills,
            job_preferred_skills=preferred_skills,
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
