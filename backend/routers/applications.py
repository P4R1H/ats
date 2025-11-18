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


def generate_random_resume_text(job: JobPosting) -> str:
    """
    Generate a random but realistic resume text tailored to the job.

    This function creates test resumes with varying quality levels that
    match (or don't match) the job's requirements realistically.

    Args:
        job: JobPosting object with requirements

    Returns:
        Resume text string
    """
    import random

    # Parse job requirements
    required_skills = json.loads(job.required_skills) if job.required_skills else []
    preferred_skills = json.loads(job.preferred_skills) if job.preferred_skills else []

    # Generic skill pool for padding
    generic_skills = [
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

    educations = ['Bachelor\'s', 'Master\'s', 'PhD', 'Diploma']
    certifications = ['AWS Certified', 'Google Cloud Certified', 'Microsoft Certified',
                      'Kubernetes Certified', 'Scrum Master', 'PMP']

    # Determine quality level randomly
    quality_roll = random.random()
    if quality_roll < 0.3:  # 30% excellent
        quality = 'excellent'
    elif quality_roll < 0.6:  # 30% good
        quality = 'good'
    elif quality_roll < 0.85:  # 25% mediocre
        quality = 'mediocre'
    else:  # 15% poor
        quality = 'poor'

    # Generate experience relative to job requirements
    min_exp = job.min_experience or 0
    if quality == 'excellent':
        # Perfect fit: at minimum to +2 years
        years_exp = min_exp + random.uniform(0, 2.5)
    elif quality == 'good':
        # Slightly off: -1 to +4 years
        years_exp = min_exp + random.uniform(-1, 4)
    elif quality == 'mediocre':
        # Below minimum or way overqualified
        if random.choice([True, False]):
            years_exp = min_exp * random.uniform(0.3, 0.8)  # Below min
        else:
            years_exp = min_exp + random.uniform(6, 10)  # Overqualified
    else:  # poor
        # Way below minimum
        years_exp = min_exp * random.uniform(0, 0.5)

    years_exp = max(0, round(years_exp, 1))

    # Generate skills based on quality
    candidate_skills = []

    if quality == 'excellent':
        # 80-100% of required, 60-80% of preferred, few extras
        num_required = int(len(required_skills) * random.uniform(0.8, 1.0))
        num_preferred = int(len(preferred_skills) * random.uniform(0.6, 0.8))
        num_extra = random.randint(1, 3)

        candidate_skills.extend(random.sample(required_skills, min(num_required, len(required_skills))))
        if preferred_skills:
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        extra_pool = [s for s in generic_skills if s not in candidate_skills]
        candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))

    elif quality == 'good':
        # 50-70% of required, 30-50% of preferred, some extras
        num_required = int(len(required_skills) * random.uniform(0.5, 0.7))
        num_preferred = int(len(preferred_skills) * random.uniform(0.3, 0.5))
        num_extra = random.randint(2, 5)

        candidate_skills.extend(random.sample(required_skills, min(num_required, len(required_skills))))
        if preferred_skills:
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        extra_pool = [s for s in generic_skills if s not in candidate_skills]
        candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))

    elif quality == 'mediocre':
        # 20-40% of required, 10-20% of preferred, lots of random
        num_required = int(len(required_skills) * random.uniform(0.2, 0.4))
        num_preferred = int(len(preferred_skills) * random.uniform(0.1, 0.2))
        num_extra = random.randint(5, 10)

        candidate_skills.extend(random.sample(required_skills, min(num_required, len(required_skills))))
        if preferred_skills:
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        extra_pool = [s for s in generic_skills if s not in candidate_skills]
        candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))

    else:  # poor
        # 0-20% of required, 0-10% of preferred, mostly random
        num_required = int(len(required_skills) * random.uniform(0, 0.2))
        num_preferred = int(len(preferred_skills) * random.uniform(0, 0.1))
        num_extra = random.randint(3, 8)

        if num_required > 0:
            candidate_skills.extend(random.sample(required_skills, min(num_required, len(required_skills))))
        if preferred_skills and num_preferred > 0:
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        extra_pool = [s for s in generic_skills if s not in candidate_skills + required_skills + preferred_skills]
        candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))

    # Other resume attributes
    name = random.choice(names)
    education = random.choice(educations)
    has_cert = random.choice([True, False])
    has_leadership = quality in ['excellent', 'good'] and random.choice([True, False])

    # Determine seniority level based on experience
    if years_exp < 2:
        level = 'Junior'
    elif years_exp < 5:
        level = ''
    else:
        level = 'Senior'

    certification_section = ""
    if has_cert:
        certification_section = "CERTIFICATIONS\n" + random.choice(certifications)

    resume_text = f"""
{name}
{level + ' ' if level else ''}{job.title}

PROFESSIONAL SUMMARY
{f"Experienced {job.title} with {years_exp} years of expertise in {job.category}." if years_exp >= 2 else f"{job.title} with {years_exp} year{'s' if years_exp != 1 else ''} of experience in {job.category}."}
{'Proven track record of delivering high-quality solutions and leading successful projects.' if years_exp >= 3 else 'Eager to learn and contribute to impactful projects.'}

SKILLS
{', '.join(candidate_skills)}

EXPERIENCE
{level + ' ' if level and years_exp >= 2 else ''}{job.title} | Tech Company Inc. | {max(1, int(years_exp * 0.6))} year{'s' if int(years_exp * 0.6) != 1 else ''}
- {'Led development of scalable applications' if years_exp >= 5 else 'Developed and maintained production applications'}
- Collaborated with cross-functional teams
- {'Implemented best practices and code reviews' if years_exp >= 3 else 'Participated in code reviews and testing'}
{'- Managed team of 5 developers' if has_leadership else ''}

{f"{job.title} | Previous Company | {max(1, int(years_exp * 0.4))} year{'s' if int(years_exp * 0.4) != 1 else ''}" if years_exp >= 2 else "Intern | Previous Company | 1 year"}
- {'Developed and maintained production systems' if years_exp >= 2 else 'Assisted in development of features'}
- {'Optimized performance and scalability' if years_exp >= 2 else 'Learned development best practices'}
- Participated in agile development process

EDUCATION
{education} in Computer Science | University

{certification_section}
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

        # Parse job requirements
        required_skills = json.loads(job.required_skills) if job.required_skills else []
        preferred_skills = json.loads(job.preferred_skills) if job.preferred_skills else []

        # Calculate scores using job-specific requirements
        weights = {
            "skills": job.weight_skills,
            "experience": job.weight_experience,
            "education": job.weight_education,
            "certification": job.weight_certifications,
            "leadership": job.weight_leadership
        }

        scores = calculate_final_score(
            candidate_skills=processed_data['extracted_skills'],
            required_skills=required_skills,
            preferred_skills=preferred_skills,
            skill_diversity=processed_data['skill_diversity'],
            experience_years=processed_data['experience_years'],
            min_experience=job.min_experience or 0,
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

    # Calculate dynamic percentiles for each application
    results = []
    for app in applications:
        # Get all applications for the same job to calculate percentile
        all_applications = db.query(Application).filter(
            Application.job_id == app.job_id
        ).all()
        all_scores = [a.final_score for a in all_applications if a.final_score is not None]
        dynamic_percentile = calculate_percentile(app.final_score or 0, all_scores)

        # Create response with dynamic percentile
        app_response = ApplicationResponse.model_validate(app)
        app_data = app_response.model_dump()
        app_data['overall_percentile'] = dynamic_percentile
        results.append(ApplicationResponse(**app_data))

    return results


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

    # Calculate dynamic percentile based on all applications for this job
    all_applications = db.query(Application).filter(
        Application.job_id == application.job_id
    ).all()
    all_scores = [app.final_score for app in all_applications if app.final_score is not None]
    dynamic_percentile = calculate_percentile(application.final_score or 0, all_scores)

    # Build detailed response with all fields
    response_data = {
        **ApplicationResponse.model_validate(application).model_dump(),
        "candidate_name": candidate.full_name,
        "candidate_email": candidate.email,
        "job_title": job.title,
        "job_category": job.category,
        "resume_text": application.resume_text,
        "overall_percentile": dynamic_percentile  # Override with dynamic value
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

    # Calculate dynamic percentiles
    all_scores = [app.final_score for app in applications if app.final_score is not None]

    # Build detailed responses
    results = []
    for app in applications:
        candidate = db.query(User).filter(User.id == app.candidate_id).first()

        # Calculate dynamic percentile for this application
        dynamic_percentile = calculate_percentile(app.final_score or 0, all_scores)

        # Build response with all fields properly
        response_data = {
            **ApplicationResponse.model_validate(app).model_dump(),
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "job_title": job.title,
            "job_category": job.category,
            "resume_text": app.resume_text,
            "overall_percentile": dynamic_percentile  # Override with dynamic value
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


@router.post("/job/{job_id}/generate-random", status_code=status.HTTP_201_CREATED)
def generate_random_applications(
    job_id: int,
    count: int = 1,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Generate random test applications for a job (recruiters only)."""
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

    # Validate count
    if count < 1 or count > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Count must be between 1 and 50"
        )

    created_applications = []

    try:
        for i in range(count):
            # Generate random resume text tailored to job
            resume_text = generate_random_resume_text(job)

            # Process resume with ML
            processed_data = process_resume(resume_text)

            # Parse job requirements
            required_skills = json.loads(job.required_skills) if job.required_skills else []
            preferred_skills = json.loads(job.preferred_skills) if job.preferred_skills else []

            # Calculate scores using job-specific requirements
            weights = {
                'skills': job.weight_skills or 0.4,
                'experience': job.weight_experience or 0.3,
                'education': job.weight_education or 0.2,
                'certification': job.weight_certifications or 0.05,
                'leadership': job.weight_leadership or 0.05
            }

            scores = calculate_final_score(
                candidate_skills=processed_data['extracted_skills'],
                required_skills=required_skills,
                preferred_skills=preferred_skills,
                skill_diversity=processed_data['skill_diversity'],
                experience_years=processed_data['experience_years'],
                min_experience=job.min_experience or 0,
                education_level=processed_data['education_level'],
                has_certifications=processed_data['has_certifications'],
                has_leadership=processed_data['has_leadership'],
                weights=weights
            )

            # Get all scores for percentile calculation
            all_scores = [app.final_score for app in db.query(Application.final_score).filter(
                Application.job_id == job_id,
                Application.final_score.isnot(None)
            ).all()]
            all_scores.append(scores['final_score'])

            overall_percentile = calculate_percentile(scores['final_score'], all_scores)

            # Assign cluster
            cluster_info = assign_cluster(
                experience_years=processed_data['experience_years'],
                num_skills=processed_data['num_skills'],
                skill_diversity=processed_data['skill_diversity']
            )

            # Analyze skill gap
            gap_analysis = analyze_skill_gap(
                candidate_skills=processed_data['extracted_skills'],
                required_skills=required_skills,
                preferred_skills=preferred_skills
            )

            # Create application (use recruiter as fake candidate for testing)
            new_application = Application(
                job_id=job_id,
                candidate_id=current_user.id,  # Using recruiter ID for test data
                resume_file_path=f"test_resume_{job_id}_{i+1}.txt",
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
                skills_score=scores['skills_score'],
                experience_score=scores['experience_score'],
                education_score=scores['education_score'],
                bonus_score=scores['bonus_score'],
                final_score=scores['final_score'],
                overall_percentile=overall_percentile,
                category_percentile=overall_percentile,  # Simplified
                # Clustering
                cluster_id=cluster_info['cluster_id'],
                cluster_name=cluster_info['cluster_name'],
                # Skill gap
                matched_skills=json.dumps(gap_analysis['matched_skills']),
                missing_skills=json.dumps(gap_analysis['missing_skills']),
                skill_match_percentage=gap_analysis['overall_match_percentage'],
                recommendations=json.dumps(gap_analysis['recommendations']),
                # Status
                status='pending'
            )

            db.add(new_application)
            created_applications.append(new_application)

        db.commit()

        return {
            "success": True,
            "count": len(created_applications),
            "message": f"Successfully generated {len(created_applications)} test application(s)"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating random application: {str(e)}"
        )
