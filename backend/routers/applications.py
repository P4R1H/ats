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
from ml_integration.skills_database import get_all_skills

router = APIRouter(prefix="/api/applications", tags=["Applications"])

# Use absolute path for upload directory
UPLOAD_DIR = Path(__file__).parent.parent / "uploads" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def normalize_skill(skill: str) -> str:
    """Normalize skill for matching (remove dots, spaces, lowercase)"""
    return skill.lower().replace('.', '').replace(' ', '').replace('-', '')


def map_to_skills_database(skills: List[str]) -> List[str]:
    """
    Map job skills to proper SKILLS_DATABASE format for resume generation.

    This ensures that skills written to resume text match the format that
    process_resume expects, enabling proper extraction and matching.

    Example: "python" or "nextjs" -> "Python", "Next.js"
    """
    all_db_skills = get_all_skills()

    # Create normalized -> proper casing mapping
    skill_map = {normalize_skill(s): s for s in all_db_skills}

    mapped_skills = []
    for skill in skills:
        normalized = normalize_skill(skill)
        if normalized in skill_map:
            # Use proper casing from database
            mapped_skills.append(skill_map[normalized])
        else:
            # Keep original if not in database
            mapped_skills.append(skill)

    return mapped_skills


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

    # Map skills to SKILLS_DATABASE format so process_resume can extract them
    required_skills = map_to_skills_database(required_skills)
    preferred_skills = map_to_skills_database(preferred_skills)

    # Parse requirements JSON for hard filters
    requirements_data = {}
    if job.requirements:
        try:
            requirements_data = json.loads(job.requirements)
        except json.JSONDecodeError:
            requirements_data = {}

    job_min_education = requirements_data.get('min_education', 'none')
    job_certifications_required = requirements_data.get('certifications_required', False)
    job_leadership_required = requirements_data.get('leadership_required', False)

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

    education_hierarchy = {
        'none': 0,
        'diploma': 1,
        'bachelors': 2,
        'masters': 3,
        'phd': 4
    }
    education_labels = {
        0: 'Diploma',
        1: 'Diploma',
        2: 'Bachelor\'s',
        3: 'Master\'s',
        4: 'PhD'
    }

    certifications = ['AWS Certified', 'Google Cloud Certified', 'Microsoft Certified',
                      'Kubernetes Certified', 'Scrum Master', 'PMP']

    # Determine quality level with HIGHER chance of meeting requirements
    quality_roll = random.random()
    if quality_roll < 0.50:  # 50% excellent (always meets requirements)
        quality = 'excellent'
        meets_requirements = True
    elif quality_roll < 0.75:  # 25% good (usually meets requirements)
        quality = 'good'
        meets_requirements = random.random() < 0.8  # 80% chance
    elif quality_roll < 0.90:  # 15% mediocre (sometimes meets requirements)
        quality = 'mediocre'
        meets_requirements = random.random() < 0.4  # 40% chance
    else:  # 10% poor (rarely meets requirements)
        quality = 'poor'
        meets_requirements = random.random() < 0.1  # 10% chance

    # Generate experience - ensure meets minimum if meets_requirements
    min_exp = job.min_experience or 0
    if meets_requirements:
        # Must meet minimum experience
        if quality == 'excellent':
            years_exp = min_exp + random.uniform(0, 2.5)  # Perfect fit
        elif quality == 'good':
            years_exp = min_exp + random.uniform(0, 4)  # Good fit
        else:  # mediocre but still meets
            years_exp = min_exp + random.uniform(0, 6)  # Meets but may be overqualified
    else:
        # Doesn't meet requirements - below minimum
        if min_exp > 0:
            years_exp = min_exp * random.uniform(0, 0.9)  # Below minimum
        else:
            years_exp = random.uniform(0, 2)

    years_exp = max(0, round(years_exp, 1))

    # Generate skills - if meets_requirements, include ALL required skills
    candidate_skills = []

    if meets_requirements:
        # MUST have ALL required skills
        candidate_skills.extend(required_skills)

        # Add some preferred skills based on quality
        if quality == 'excellent' and preferred_skills:
            num_preferred = int(len(preferred_skills) * random.uniform(0.6, 1.0))
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        elif quality == 'good' and preferred_skills:
            num_preferred = int(len(preferred_skills) * random.uniform(0.3, 0.6))
            candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))
        elif preferred_skills:
            num_preferred = int(len(preferred_skills) * random.uniform(0, 0.3))
            if num_preferred > 0:
                candidate_skills.extend(random.sample(preferred_skills, min(num_preferred, len(preferred_skills))))

        # Add a few random skills
        extra_pool = [s for s in generic_skills if s not in candidate_skills]
        num_extra = random.randint(1, 4) if quality == 'excellent' else random.randint(2, 6)
        if extra_pool:
            candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))
    else:
        # Doesn't meet requirements - missing some required skills
        if required_skills:
            # Include 0-90% of required skills (deliberately missing some)
            num_required = int(len(required_skills) * random.uniform(0, 0.9))
            if num_required > 0:
                candidate_skills.extend(random.sample(required_skills, num_required))

        # Add random skills
        extra_pool = [s for s in generic_skills if s not in candidate_skills]
        num_extra = random.randint(3, 10)
        if extra_pool:
            candidate_skills.extend(random.sample(extra_pool, min(num_extra, len(extra_pool))))

    # Remove duplicates
    candidate_skills = list(set(candidate_skills))

    # Generate education - ensure meets minimum if meets_requirements
    min_education_level = education_hierarchy.get(job_min_education, 0)
    if meets_requirements:
        # Must meet or exceed minimum education
        available_levels = [lvl for lvl in range(min_education_level, 5)]
        if quality == 'excellent':
            # At minimum or one above
            education_level = random.choice([min_education_level, min(min_education_level + 1, 4)])
        else:
            # Any level at or above minimum
            education_level = random.choice(available_levels) if available_levels else min_education_level
    else:
        # Below minimum education
        if min_education_level > 0:
            available_levels = list(range(0, min_education_level))
            education_level = random.choice(available_levels) if available_levels else 0
        else:
            education_level = random.randint(0, 4)

    education = education_labels[education_level]

    # Generate certifications - ensure meets requirement if needed
    if meets_requirements and job_certifications_required:
        has_cert = True  # Must have if required
    else:
        has_cert = random.choice([True, False]) if quality in ['excellent', 'good'] else False

    # Generate leadership - ensure meets requirement if needed
    if meets_requirements and job_leadership_required:
        has_leadership = True  # Must have if required
    else:
        has_leadership = quality in ['excellent', 'good'] and random.choice([True, False])

    # Other resume attributes
    name = random.choice(names)

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

        # Parse requirements JSON for hard filters
        requirements_data = {}
        if job.requirements:
            try:
                requirements_data = json.loads(job.requirements)
            except json.JSONDecodeError:
                requirements_data = {}

        job_min_education = requirements_data.get('min_education', 'none')
        job_certifications_required = requirements_data.get('certifications_required', False)
        job_leadership_required = requirements_data.get('leadership_required', False)

        # Calculate scores using job-specific requirements
        weights = {
            "skills": job.weight_skills,
            "experience": job.weight_experience,
            "education": job.weight_education,
            "certification": job.weight_certifications,
            "leadership": job.weight_leadership
        }

        # TWO-STAGE SCORING: Requirements check → Ranking
        scores = calculate_final_score(
            # Candidate attributes
            candidate_skills=processed_data['extracted_skills'],
            candidate_experience=processed_data['experience_years'],
            candidate_education=processed_data['education_level'],
            candidate_has_certifications=processed_data['has_certifications'],
            candidate_has_leadership=processed_data['has_leadership'],
            candidate_skill_diversity=processed_data['skill_diversity'],
            # Job requirements (hard filters)
            job_required_skills=required_skills,
            job_preferred_skills=preferred_skills,
            job_min_experience=job.min_experience or 0,
            job_min_education=job_min_education,
            job_certifications_required=job_certifications_required,
            job_leadership_required=job_leadership_required,
            # Weights for ranking
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

        # NEW: Calculate component-level percentiles
        all_apps = db.query(Application).all()
        skills_scores = [app.skills_score for app in all_apps if app.skills_score]
        experience_scores = [app.experience_score for app in all_apps if app.experience_score]
        education_scores = [app.education_score for app in all_apps if app.education_score]

        skills_percentile = calculate_percentile(scores['skills_score'], skills_scores)
        experience_percentile = calculate_percentile(scores['experience_score'], experience_scores)
        education_percentile = calculate_percentile(scores['education_score'], education_scores)

        # Skill gap analysis
        required_skills = json.loads(job.required_skills)
        preferred_skills = json.loads(job.preferred_skills)
        gap_analysis = analyze_skill_gap(
            candidate_skills=processed_data['extracted_skills'],
            required_skills=required_skills,
            preferred_skills=preferred_skills
        )

        # NEW: Prepare skills by category counts
        skills_by_category_counts = {
            category: len(skills_list)
            for category, skills_list in processed_data['skills_by_category'].items()
        }

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
            # NEW: Skills by category
            skills_by_category=json.dumps(skills_by_category_counts),
            technical_skills_count=processed_data['technical_skills_count'],
            # Requirements check (Stage 1)
            meets_requirements=scores['meets_requirements'],
            missing_requirements=json.dumps(scores['missing_requirements']),
            rejection_reason=scores['rejection_reason'],
            # Scores (Stage 2)
            skills_score=scores['skills_score'],
            experience_score=scores['experience_score'],
            education_score=scores['education_score'],
            bonus_score=scores['bonus_score'],
            final_score=scores['final_score'],
            # Rankings
            overall_percentile=overall_percentile,
            category_percentile=category_percentile,
            # NEW: Component percentiles
            skills_percentile=skills_percentile,
            experience_percentile=experience_percentile,
            education_percentile=education_percentile,
            # Clustering
            cluster_id=cluster_info['cluster_id'],
            cluster_name=cluster_info['cluster_name'],
            cluster_description=cluster_info['cluster_description'],
            # Skill gap
            matched_skills=json.dumps(gap_analysis['matched_skills']),
            missing_skills=json.dumps(gap_analysis['missing_skills']),
            skill_match_percentage=gap_analysis['overall_match_percentage'],
            recommendations=json.dumps(gap_analysis['recommendations']),
            # NEW: Detailed skill gap
            matched_required_skills=json.dumps(gap_analysis['matched_required']),
            matched_preferred_skills=json.dumps(gap_analysis['matched_preferred']),
            missing_required_skills=json.dumps(gap_analysis['missing_required']),
            missing_preferred_skills=json.dumps(gap_analysis['missing_preferred']),
            required_match_percentage=gap_analysis['required_match_percentage']
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
        # Get job title for display
        job = db.query(JobPosting).filter(JobPosting.id == app.job_id).first()
        job_title = job.title if job else None

        # Get all applications for the same job to calculate percentile
        all_applications = db.query(Application).filter(
            Application.job_id == app.job_id
        ).all()
        all_scores = [a.final_score for a in all_applications if a.final_score is not None]
        dynamic_percentile = calculate_percentile(app.final_score or 0, all_scores)

        # Create response with dynamic percentile and job title
        app_response = ApplicationResponse.model_validate(app)
        app_data = app_response.model_dump()
        app_data['overall_percentile'] = dynamic_percentile
        app_data['job_title'] = job_title
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
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated job posting not found"
        )

    candidate = db.query(User).filter(User.id == application.candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated candidate not found"
        )

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
        if not candidate:
            # Skip applications with missing candidate data
            continue

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
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated job posting not found"
        )

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

            # Parse requirements JSON for hard filters
            requirements_data = {}
            if job.requirements:
                try:
                    requirements_data = json.loads(job.requirements)
                except json.JSONDecodeError:
                    requirements_data = {}

            job_min_education = requirements_data.get('min_education', 'none')
            job_certifications_required = requirements_data.get('certifications_required', False)
            job_leadership_required = requirements_data.get('leadership_required', False)

            # Calculate scores using job-specific requirements
            weights = {
                'skills': job.weight_skills or 0.4,
                'experience': job.weight_experience or 0.3,
                'education': job.weight_education or 0.2,
                'certification': job.weight_certifications or 0.05,
                'leadership': job.weight_leadership or 0.05
            }

            # Normalize skills for consistent matching (use module-level function)
            candidate_skills_normalized = [normalize_skill(s) for s in processed_data['extracted_skills']]
            required_skills_normalized = [normalize_skill(s) for s in required_skills]
            preferred_skills_normalized = [normalize_skill(s) for s in preferred_skills]

            # TWO-STAGE SCORING: Requirements check → Ranking
            scores = calculate_final_score(
                # Candidate attributes
                candidate_skills=candidate_skills_normalized,
                candidate_experience=processed_data['experience_years'],
                candidate_education=processed_data['education_level'],
                candidate_has_certifications=processed_data['has_certifications'],
                candidate_has_leadership=processed_data['has_leadership'],
                candidate_skill_diversity=processed_data['skill_diversity'],
                # Job requirements (hard filters)
                job_required_skills=required_skills_normalized,
                job_preferred_skills=preferred_skills_normalized,
                job_min_experience=job.min_experience or 0,
                job_min_education=job_min_education,
                job_certifications_required=job_certifications_required,
                job_leadership_required=job_leadership_required,
                # Weights for ranking
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

            # Analyze skill gap (using normalized skills)
            gap_analysis = analyze_skill_gap(
                candidate_skills=candidate_skills_normalized,
                required_skills=required_skills_normalized,
                preferred_skills=preferred_skills_normalized
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
                # Requirements check (Stage 1)
                meets_requirements=scores['meets_requirements'],
                missing_requirements=json.dumps(scores['missing_requirements']),
                rejection_reason=scores['rejection_reason'],
                # Scores (Stage 2)
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
