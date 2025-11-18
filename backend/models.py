"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    """User model for both candidates and recruiters."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'candidate' or 'recruiter'
    full_name = Column(String, nullable=False)

    # Recruiter-specific fields
    company_name = Column(String)  # For recruiters
    company_logo = Column(String)  # URL/path to logo for recruiters

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job_postings = relationship("JobPosting", back_populates="recruiter")
    applications = relationship("Application", back_populates="candidate")


class JobPosting(Base):
    """Job posting model created by recruiters."""
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # One of 10 ML categories
    required_skills = Column(Text, nullable=False)  # JSON array
    preferred_skills = Column(Text, nullable=False)  # JSON array
    min_experience = Column(Integer, default=0)
    education_level = Column(String)
    status = Column(String, default="active")  # 'active' or 'closed'

    # Requirements (hard filters) - JSON storing additional requirements
    # Format: { "min_education": "bachelors"|"masters"|"phd"|"none",
    #           "certifications_required": bool, "leadership_required": bool }
    requirements = Column(Text)  # JSON object

    # Recruiter customization (weights for scoring)
    weight_skills = Column(Float, default=0.40)
    weight_experience = Column(Float, default=0.30)
    weight_education = Column(Float, default=0.20)
    weight_certifications = Column(Float, default=0.05)
    weight_leadership = Column(Float, default=0.05)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    recruiter = relationship("User", back_populates="job_postings")
    applications = relationship("Application", back_populates="job")


class Application(Base):
    """Application model linking candidates to jobs."""
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_file_path = Column(String, nullable=False)
    resume_text = Column(Text, nullable=False)

    # ML-Generated Fields
    extracted_skills = Column(Text)  # JSON array
    num_skills = Column(Integer)
    skill_diversity = Column(Float)
    experience_years = Column(Float)
    education_level = Column(String)
    has_certifications = Column(Boolean, default=False)
    has_leadership = Column(Boolean, default=False)

    # NEW: Skills by Category (lost potential #1)
    skills_by_category = Column(Text)  # JSON object: {"programming_languages": 5, "databases": 3, ...}
    technical_skills_count = Column(Integer)  # Count of technical vs soft skills

    # Two-Stage Scoring: Requirements Check (Stage 1)
    meets_requirements = Column(Boolean, default=True)  # Pass/fail requirements check
    missing_requirements = Column(Text)  # JSON array of what requirements are missing
    rejection_reason = Column(Text)  # Human-readable rejection reason

    # Scores (Stage 2 - only for candidates who pass requirements)
    skills_score = Column(Float)
    experience_score = Column(Float)
    education_score = Column(Float)
    bonus_score = Column(Float)
    final_score = Column(Float)

    # Rankings
    overall_percentile = Column(Float)
    category_percentile = Column(Float)

    # NEW: Component-level percentiles (lost potential #2)
    skills_percentile = Column(Float)
    experience_percentile = Column(Float)
    education_percentile = Column(Float)

    # Clustering
    cluster_id = Column(Integer)
    cluster_name = Column(String)
    cluster_description = Column(Text)  # NEW: Cluster description (lost potential #4)

    # Skill Gap Analysis
    matched_skills = Column(Text)  # JSON array
    missing_skills = Column(Text)  # JSON array
    skill_match_percentage = Column(Float)
    recommendations = Column(Text)  # JSON array

    # NEW: Detailed skill gap breakdown (lost potential #5)
    matched_required_skills = Column(Text)  # JSON array
    matched_preferred_skills = Column(Text)  # JSON array
    missing_required_skills = Column(Text)  # JSON array
    missing_preferred_skills = Column(Text)  # JSON array
    required_match_percentage = Column(Float)

    status = Column(String, default="pending")  # 'pending', 'reviewed', 'shortlisted', 'rejected'
    applied_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job = relationship("JobPosting", back_populates="applications")
    candidate = relationship("User", back_populates="applications")
