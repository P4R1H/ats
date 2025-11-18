"""Job postings router for recruiters."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import json

from database import get_db
from models import User, JobPosting, Application
from schemas import (
    JobPostingCreate, JobPostingResponse, JobPostingUpdate
)
from auth import get_current_user, get_current_recruiter

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("", response_model=JobPostingResponse, status_code=status.HTTP_201_CREATED)
def create_job_posting(
    job_data: JobPostingCreate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Create a new job posting (recruiters only)."""
    # Validate weights sum to 1.0
    total_weight = (
        job_data.weight_skills +
        job_data.weight_experience +
        job_data.weight_education +
        job_data.weight_certifications +
        job_data.weight_leadership
    )

    if abs(total_weight - 1.0) > 0.01:  # Allow small floating point errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Weights must sum to 1.0 (currently {total_weight})"
        )

    # Create job posting
    new_job = JobPosting(
        recruiter_id=current_user.id,
        title=job_data.title,
        description=job_data.description,
        category=job_data.category,
        required_skills=json.dumps(job_data.required_skills),
        preferred_skills=json.dumps(job_data.preferred_skills),
        min_experience=job_data.min_experience,
        education_level=job_data.education_level,
        requirements=job_data.requirements,  # Store requirements JSON
        weight_skills=job_data.weight_skills,
        weight_experience=job_data.weight_experience,
        weight_education=job_data.weight_education,
        weight_certifications=job_data.weight_certifications,
        weight_leadership=job_data.weight_leadership
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Convert to response format
    response = JobPostingResponse.model_validate(new_job)
    response.application_count = 0
    return response


@router.get("", response_model=List[JobPostingResponse])
def get_jobs(
    status_filter: str = "active",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get job postings.
    - Recruiters: Get their own job postings
    - Candidates: Get all active job postings
    """
    query = db.query(JobPosting)

    if current_user.role == "recruiter":
        # Recruiters see their own jobs
        query = query.filter(JobPosting.recruiter_id == current_user.id)
        if status_filter:
            query = query.filter(JobPosting.status == status_filter)
    else:
        # Candidates see all active jobs
        query = query.filter(JobPosting.status == "active")

    jobs = query.order_by(JobPosting.created_at.desc()).all()

    # Add application counts and company info
    result = []
    for job in jobs:
        job_response = JobPostingResponse.model_validate(job)
        job_response.application_count = db.query(Application).filter(
            Application.job_id == job.id
        ).count()

        # Add company info from recruiter
        recruiter = db.query(User).filter(User.id == job.recruiter_id).first()
        if recruiter:
            job_response.company_name = recruiter.company_name
            job_response.company_logo = recruiter.company_logo

        result.append(job_response)

    return result


@router.get("/{job_id}", response_model=JobPostingResponse)
def get_job_by_id(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific job posting by ID."""
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Recruiters can only see their own jobs (unless it's active)
    if current_user.role == "recruiter" and job.recruiter_id != current_user.id:
        if job.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view this job"
            )

    job_response = JobPostingResponse.model_validate(job)
    job_response.application_count = db.query(Application).filter(
        Application.job_id == job.id
    ).count()

    return job_response


@router.put("/{job_id}", response_model=JobPostingResponse)
def update_job_posting(
    job_id: int,
    job_update: JobPostingUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update a job posting (recruiters only)."""
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Only the job creator can update it
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job"
        )

    # Update fields
    update_data = job_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field in ['required_skills', 'preferred_skills'] and value is not None:
            setattr(job, field, json.dumps(value))
        else:
            setattr(job, field, value)

    # Validate weights if any were updated
    if any(key.startswith('weight_') for key in update_data.keys()):
        total_weight = (
            job.weight_skills +
            job.weight_experience +
            job.weight_education +
            job.weight_certifications +
            job.weight_leadership
        )
        if abs(total_weight - 1.0) > 0.01:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Weights must sum to 1.0 (currently {total_weight})"
            )

    db.commit()
    db.refresh(job)

    job_response = JobPostingResponse.model_validate(job)
    job_response.application_count = db.query(Application).filter(
        Application.job_id == job.id
    ).count()

    return job_response


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job_posting(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Delete a job posting (recruiters only)."""
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Only the job creator can delete it
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this job"
        )

    db.delete(job)
    db.commit()

    return None
