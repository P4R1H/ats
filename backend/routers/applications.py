"""Applications router for candidates and recruiters."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import json
import os
from pathlib import Path

from database import get_db
from models import User, JobPosting, Application
from schemas import (
    ApplicationResponse, ApplicationDetailResponse, ApplicationStatusUpdate
)
from auth import get_current_user, get_current_candidate, get_current_recruiter

# ML imports
from ml_integration.resume_parser import extract_text_from_file, validate_resume_file
from ml_integration.extract_skills import process_resume
from ml_integration.scoring import calculate_final_score, calculate_percentile
from ml_integration.clustering import assign_cluster
from ml_integration.skill_gap import analyze_skill_gap

router = APIRouter(prefix="/api/applications", tags=["Applications"])

UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def parse_json_field(value):
    """Helper to parse JSON string fields."""
    if value is None:
        return None
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return None
    return value


def generate_random_resume_text(job_title: str, job_category: str) -> str:
    """Generate a random but realistic resume text."""
    import random

    skills_pool = [
        'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'MongoDB',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'Agile',
        'Machine Learning', 'Data Analysis', 'REST APIs', 'Microservices',
        'TensorFlow', 'PyTorch', 'PostgreSQL', 'Redis', 'GraphQL', 'Next.js',
        'Vue.js', 'Angular', 'Express', 'Django', 'Flask', 'FastAPI',
        'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Material-UI', 'Testing',
        'Jest', 'Pytest', 'Selenium', 'Linux', 'Bash', 'DevOps', 'Terraform'
    ]

    names = ['Alex Johnson', 'Maria Garcia', 'James Smith', 'Sarah Williams', 'David Chen',
             'Emma Davis', 'Michael Brown', 'Lisa Anderson', 'Robert Martinez', 'Jennifer Lee']

    educations = ['Bachelor\'s', 'Master\'s', 'PhD']
    certifications = ['AWS Certified', 'Google Cloud Certified', 'Microsoft Certified',
                      'Kubernetes Certified', 'Scrum Master', 'PMP']

    name = random.choice(names)
    education = random.choice(educations)
    years_exp = random.randint(2, 10)
    num_skills = random.randint(5, 15)
    selected_skills = random.sample(skills_pool, num_skills)
    has_cert = random.choice([True, False])
    has_leadership = random.choice([True, False])

    resume_text = f"""
{name}
Senior {job_title}

PROFESSIONAL SUMMARY
Experienced {job_title} with {years_exp} years of expertise in {job_category}.
Proven track record of delivering high-quality solutions and leading successful projects.

SKILLS
{', '.join(selected_skills)}

EXPERIENCE
Senior {job_title} | Tech Company Inc. | {years_exp-2} years
- Led development of scalable applications
- Collaborated with cross-functional teams
- Implemented best practices and code reviews
{'- Managed team of 5 developers' if has_leadership else ''}

{job_title} | Previous Company | 2 years
- Developed and maintained production systems
- Optimized performance and scalability
- Participated in agile development process

EDUCATION
{education} in Computer Science | University

{'CERTIFICATIONS\n' + random.choice(certifications) if has_cert else ''}
"""
    return resume_text.strip()


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def submit_application(
    job_id: int = Form(...),
    resume_file: UploadFile = File(...),
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Submit a job application with resume upload (candidates only)."""
    # Validate job exists and is active
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This job is no longer accepting applications"
        )

    # Check if already applied
    existing_application = db.query(Application).filter(
        Application.job_id == job_id,
        Application.candidate_id == current_user.id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )

    # Validate file
    validation_error = validate_resume_file(resume_file.filename)
    if validation_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation_error
        )

    # Save resume file
    file_extension = os.path.splitext(resume_file.filename)[1]
    file_path = UPLOAD_DIR / f"user_{current_user.id}_job_{job_id}{file_extension}"

    with open(file_path, "wb") as f:
        content = await resume_file.read()
        f.write(content)

    try:
        # Extract text from resume
        resume_text = extract_text_from_file(str(file_path))

        # Process resume with ML
        processed_data = process_resume(resume_text)

        # Calculate scores
        weights = {
            "skills": job.weight_skills,
            "experience": job.weight_experience,
            "education": job.weight_education,
            "certification": job.weight_certifications,
            "leadership": job.weight_leadership
        }

        scores = calculate_final_score(
            num_skills=processed_data['num_skills'],
            skill_diversity=processed_data['skill_diversity'],
            experience_years=processed_data['experience_years'],
            education_level=processed_data['education_level'],
            has_certifications=processed_data['has_certifications'],
            has_leadership=processed_data['has_leadership'],
            weights=weights
        )

        # Assign cluster
        cluster_info = assign_cluster(
            experience_years=processed_data['experience_years'],
            num_skills=processed_data['num_skills'],
            skill_diversity=processed_data['skill_diversity']
        )

        # Calculate percentiles (against all applications)
        all_scores = [app.final_score for app in db.query(Application).all() if app.final_score]
        overall_percentile = calculate_percentile(scores['final_score'], all_scores)

        # Calculate category percentile (against applications in same category)
        category_scores = [
            app.final_score for app in db.query(Application)
            .join(JobPosting)
            .filter(JobPosting.category == job.category, Application.final_score.isnot(None))
            .all()
        ]
        category_percentile = calculate_percentile(scores['final_score'], category_scores)

        # Skill gap analysis
        required_skills = json.loads(job.required_skills)
        preferred_skills = json.loads(job.preferred_skills)
        gap_analysis = analyze_skill_gap(
            candidate_skills=processed_data['extracted_skills'],
            required_skills=required_skills,
            preferred_skills=preferred_skills
        )

        # Create application
        new_application = Application(
            job_id=job_id,
            candidate_id=current_user.id,
            resume_file_path=str(file_path),
            resume_text=resume_text,
            # ML fields
            extracted_skills=json.dumps(processed_data['extracted_skills']),
            num_skills=processed_data['num_skills'],
            skill_diversity=processed_data['skill_diversity'],
            experience_years=processed_data['experience_years'],
            education_level=processed_data['education_level'],
            has_certifications=processed_data['has_certifications'],
            has_leadership=processed_data['has_leadership'],
            # Scores
            skills_score=scores['skills_score'],
            experience_score=scores['experience_score'],
            education_score=scores['education_score'],
            bonus_score=scores['bonus_score'],
            final_score=scores['final_score'],
            # Rankings
            overall_percentile=overall_percentile,
            category_percentile=category_percentile,
            # Clustering
            cluster_id=cluster_info['cluster_id'],
            cluster_name=cluster_info['cluster_name'],
            # Skill gap
            matched_skills=json.dumps(gap_analysis['matched_skills']),
            missing_skills=json.dumps(gap_analysis['missing_skills']),
            skill_match_percentage=gap_analysis['overall_match_percentage'],
            recommendations=json.dumps(gap_analysis['recommendations'])
        )

        db.add(new_application)
        db.commit()
        db.refresh(new_application)

        return ApplicationResponse.model_validate(new_application)

    except Exception as e:
        # Clean up file if processing failed
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing resume: {str(e)}"
        )


@router.get("/my", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all applications for the current candidate."""
    applications = db.query(Application).filter(
        Application.candidate_id == current_user.id
    ).order_by(Application.applied_at.desc()).all()

    return [ApplicationResponse.model_validate(app) for app in applications]


@router.get("/{application_id}", response_model=ApplicationDetailResponse)
def get_application_details(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed application information."""
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Check permissions
    job = db.query(JobPosting).filter(JobPosting.id == application.job_id).first()
    candidate = db.query(User).filter(User.id == application.candidate_id).first()

    if current_user.role == "candidate":
        # Candidates can only see their own applications
        if application.candidate_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view this application"
            )
    elif current_user.role == "recruiter":
        # Recruiters can only see applications for their jobs
        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view this application"
            )

    # Build detailed response with all fields
    response_data = {
        **ApplicationResponse.model_validate(application).model_dump(),
        "candidate_name": candidate.full_name,
        "candidate_email": candidate.email,
        "job_title": job.title,
        "job_category": job.category,
        "resume_text": application.resume_text
    }

    return ApplicationDetailResponse(**response_data)


@router.get("/job/{job_id}", response_model=List[ApplicationDetailResponse])
def get_applications_for_job(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all applications for a specific job (recruiters only)."""
    # Verify job exists and belongs to recruiter
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view applications for this job"
        )

    # Get all applications
    applications = db.query(Application).filter(
        Application.job_id == job_id
    ).order_by(Application.final_score.desc()).all()

    # Build detailed responses
    results = []
    for app in applications:
        candidate = db.query(User).filter(User.id == app.candidate_id).first()

        # Build response with all fields properly
        response_data = {
            **ApplicationResponse.model_validate(app).model_dump(),
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "job_title": job.title,
            "job_category": job.category,
            "resume_text": app.resume_text
        }

        results.append(ApplicationDetailResponse(**response_data))

    return results


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update application status (recruiters only)."""
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify recruiter owns the job
    job = db.query(JobPosting).filter(JobPosting.id == application.job_id).first()
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this application"
        )

    # Update status
    application.status = status_update.status
    db.commit()
    db.refresh(application)

    return ApplicationResponse.model_validate(application)


@router.post("/job/{job_id}/generate-random", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def generate_random_application(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Generate a random test application for a job (recruiters only)."""
    # Verify job exists and belongs to recruiter
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to generate applications for this job"
        )

    # Generate random resume text
    resume_text = generate_random_resume_text(job.title, job.category)

    try:
        # Process resume with ML
        processed_data = process_resume(resume_text)

        # Calculate scores
        weights = {
            'skills': job.weight_skills or 0.4,
            'experience': job.weight_experience or 0.3,
            'education': job.weight_education or 0.2,
            'certifications': job.weight_certifications or 0.05,
            'leadership': job.weight_leadership or 0.05
        }

        final_score = calculate_final_score(processed_data, weights)

        # Get all scores for percentile calculation
        all_scores = [app.final_score for app in db.query(Application.final_score).filter(
            Application.job_id == job_id,
            Application.final_score.isnot(None)
        ).all()]
        all_scores.append(final_score)

        overall_percentile = calculate_percentile(final_score, all_scores)

        # Assign cluster
        cluster_info = assign_cluster(processed_data)

        # Analyze skill gap
        job_skills = job.required_skills if job.required_skills else []
        skill_gap = analyze_skill_gap(processed_data['extracted_skills'], job_skills)

        # Create application (use recruiter as fake candidate for testing)
        new_application = Application(
            job_id=job_id,
            candidate_id=current_user.id,  # Using recruiter ID for test data
            resume_file_path=f"test_resume_{job_id}_{current_user.id}.txt",
            resume_text=resume_text,
            # ML fields
            extracted_skills=json.dumps(processed_data['extracted_skills']),
            num_skills=processed_data['num_skills'],
            skill_diversity=processed_data.get('skill_diversity', 0.0),
            experience_years=processed_data.get('experience_years', 0.0),
            education_level=processed_data.get('education_level'),
            has_certifications=processed_data.get('has_certifications', False),
            has_leadership=processed_data.get('has_leadership', False),
            # Scores
            skills_score=processed_data.get('skills_score', 0.0),
            experience_score=processed_data.get('experience_score', 0.0),
            education_score=processed_data.get('education_score', 0.0),
            bonus_score=processed_data.get('bonus_score', 0.0),
            final_score=final_score,
            overall_percentile=overall_percentile,
            category_percentile=overall_percentile,  # Simplified
            # Clustering
            cluster_id=cluster_info.get('cluster_id'),
            cluster_name=cluster_info.get('cluster_name'),
            # Skill gap
            matched_skills=json.dumps(skill_gap['matched_skills']),
            missing_skills=json.dumps(skill_gap['missing_skills']),
            skill_match_percentage=skill_gap['match_percentage'],
            recommendations=json.dumps(skill_gap['recommendations']),
            # Status
            status='pending'
        )

        db.add(new_application)
        db.commit()
        db.refresh(new_application)

        return ApplicationResponse.model_validate(new_application)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating random application: {str(e)}"
        )
