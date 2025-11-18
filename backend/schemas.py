"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
import json


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str
    role: str = Field(..., pattern="^(candidate|recruiter)$")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Job Posting Schemas
class JobPostingBase(BaseModel):
    title: str
    description: str
    category: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience: int = 0
    education_level: Optional[str] = None


class JobPostingCreate(JobPostingBase):
    requirements: Optional[str] = None  # JSON string for additional requirements
    weight_skills: float = 0.40
    weight_experience: float = 0.30
    weight_education: float = 0.20
    weight_certifications: float = 0.05
    weight_leadership: float = 0.05


class JobPostingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    min_experience: Optional[int] = None
    education_level: Optional[str] = None
    requirements: Optional[str] = None
    status: Optional[str] = None
    weight_skills: Optional[float] = None
    weight_experience: Optional[float] = None
    weight_education: Optional[float] = None
    weight_certifications: Optional[float] = None
    weight_leadership: Optional[float] = None


class JobPostingResponse(JobPostingBase):
    id: int
    recruiter_id: int
    status: str
    requirements: Optional[str] = None
    weight_skills: float
    weight_experience: float
    weight_education: float
    weight_certifications: float
    weight_leadership: float
    created_at: datetime
    application_count: int = 0

    @field_validator('required_skills', 'preferred_skills', mode='before')
    @classmethod
    def parse_skills_json(cls, v):
        """Parse JSON string fields to lists."""
        if v is None:
            return []
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

    class Config:
        from_attributes = True


# Application Schemas
class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    resume_file_path: str

    # ML-Generated Fields
    extracted_skills: Optional[List[str]] = None
    num_skills: Optional[int] = None
    skill_diversity: Optional[float] = None
    experience_years: Optional[float] = None
    education_level: Optional[str] = None
    has_certifications: bool = False
    has_leadership: bool = False

    # Skills by Category
    skills_by_category: Optional[dict] = None
    technical_skills_count: Optional[int] = None

    # Two-Stage Scoring: Requirements Check (Stage 1)
    meets_requirements: bool = True
    missing_requirements: Optional[List[str]] = None
    rejection_reason: Optional[str] = None

    # Scores (Stage 2 - only for candidates who pass requirements)
    skills_score: Optional[float] = None
    experience_score: Optional[float] = None
    education_score: Optional[float] = None
    bonus_score: Optional[float] = None
    final_score: Optional[float] = None

    # Rankings
    overall_percentile: Optional[float] = None
    category_percentile: Optional[float] = None

    # Component-level percentiles
    skills_percentile: Optional[float] = None
    experience_percentile: Optional[float] = None
    education_percentile: Optional[float] = None

    # Clustering
    cluster_id: Optional[int] = None
    cluster_name: Optional[str] = None
    cluster_description: Optional[str] = None

    # Skill Gap Analysis
    matched_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    skill_match_percentage: Optional[float] = None
    recommendations: Optional[List[str]] = None

    # Detailed skill gap breakdown
    matched_required_skills: Optional[List[str]] = None
    matched_preferred_skills: Optional[List[str]] = None
    missing_required_skills: Optional[List[str]] = None
    missing_preferred_skills: Optional[List[str]] = None
    required_match_percentage: Optional[float] = None

    status: str
    applied_at: datetime

    @field_validator('extracted_skills', 'matched_skills', 'missing_skills', 'recommendations', 'missing_requirements',
                      'matched_required_skills', 'matched_preferred_skills', 'missing_required_skills', 'missing_preferred_skills', mode='before')
    @classmethod
    def parse_json_field(cls, v):
        """Parse JSON string fields to lists."""
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v

    @field_validator('skills_by_category', mode='before')
    @classmethod
    def parse_skills_by_category(cls, v):
        """Parse skills_by_category JSON field to dict."""
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v

    class Config:
        from_attributes = True


class ApplicationDetailResponse(ApplicationResponse):
    candidate_name: str
    candidate_email: str
    job_title: str
    job_category: str
    resume_text: str


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|reviewed|shortlisted|rejected)$")


# ML Schemas
class SkillExtractionRequest(BaseModel):
    resume_text: str


class SkillExtractionResponse(BaseModel):
    skills: List[str]
    num_skills: int
    skill_diversity: float


class ResumeScoreRequest(BaseModel):
    num_skills: int
    experience_years: float
    education_level: str
    has_certifications: bool
    has_leadership: bool
    weights: dict


class ResumeScoreResponse(BaseModel):
    skills_score: float
    experience_score: float
    education_score: float
    bonus_score: float
    final_score: float


class SkillGapAnalysisRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]
    preferred_skills: List[str]


class SkillGapAnalysisResponse(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    skill_match_percentage: float
    recommendations: List[str]
