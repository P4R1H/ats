"""Skill extraction from resume text using NLP."""
import re
from typing import List, Tuple
from .skills_database import SKILLS_DATABASE, get_all_skills, categorize_skill


def extract_skills_from_text(resume_text: str) -> Tuple[List[str], dict]:
    """
    Extract skills from resume text using keyword matching.

    Args:
        resume_text: The resume text to analyze

    Returns:
        Tuple of (skills_list, skills_by_category_dict)
    """
    resume_text_lower = resume_text.lower()
    extracted_skills = []
    skills_by_category = {category: [] for category in SKILLS_DATABASE.keys()}

    # Get all possible skills
    all_skills = get_all_skills()

    # Special patterns for skills with special characters
    # Word boundaries \b don't work with special chars like + and #
    special_patterns = {
        'c++': r'\bc\+\+(?!\w)',
        'c#': r'\bc#(?!\w)',
        'asp.net': r'\basp\.net\b',
        '.net': r'\.net\b',
    }

    # Extract skills using case-insensitive matching
    for skill in all_skills:
        skill_lower = skill.lower()

        # Use special pattern if available, otherwise use standard word boundary
        if skill_lower in special_patterns:
            pattern = special_patterns[skill_lower]
        else:
            # Create a pattern that matches the skill as a whole word
            pattern = r'\b' + re.escape(skill_lower) + r'\b'

        if re.search(pattern, resume_text_lower):
            extracted_skills.append(skill)
            category = categorize_skill(skill)
            skills_by_category[category].append(skill)

    # Remove duplicates while preserving order
    extracted_skills = list(dict.fromkeys(extracted_skills))

    return extracted_skills, skills_by_category


def calculate_skill_diversity(skills_by_category: dict) -> float:
    """
    Calculate skill diversity score (0-1).
    Higher score means skills span more categories.
    """
    total_categories = len(SKILLS_DATABASE)
    categories_with_skills = sum(1 for skills in skills_by_category.values() if skills)

    if total_categories == 0:
        return 0.0

    return categories_with_skills / total_categories


def extract_experience_years(resume_text: str) -> float:
    """
    Extract years of experience from resume text.
    Uses heuristics to find experience mentions.
    """
    # Pattern 1: "X years of experience"
    pattern1 = r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience'
    matches1 = re.findall(pattern1, resume_text.lower())

    # Pattern 2: "X years" in work experience section
    pattern2 = r'(\d+)\s*(?:years?|yrs?)'
    matches2 = re.findall(pattern2, resume_text.lower())

    # Take the maximum value found
    all_matches = matches1 + matches2
    if all_matches:
        years = max(int(match) for match in all_matches)
        return min(years, 20)  # Cap at 20 years

    # Default: estimate from resume length (very rough heuristic)
    word_count = len(resume_text.split())
    if word_count > 500:
        return 3.0
    elif word_count > 300:
        return 2.0
    else:
        return 1.0


def extract_education_level(resume_text: str) -> str:
    """
    Extract education level from resume text.
    Returns: PhD, Master's, Bachelor's, Diploma, or Not Specified
    """
    resume_lower = resume_text.lower()

    # Check for different education levels
    if 'phd' in resume_lower or 'ph.d' in resume_lower or 'doctorate' in resume_lower:
        return "PhD"
    elif "master's" in resume_lower or 'masters' in resume_lower or 'm.s.' in resume_lower or 'msc' in resume_lower:
        return "Master's"
    elif "bachelor's" in resume_lower or 'bachelors' in resume_lower or 'b.s.' in resume_lower or 'bsc' in resume_lower or 'b.tech' in resume_lower:
        return "Bachelor's"
    elif 'diploma' in resume_lower:
        return "Diploma"
    else:
        return "Not Specified"


def has_certifications(resume_text: str) -> bool:
    """Check if resume mentions certifications."""
    resume_lower = resume_text.lower()
    cert_keywords = ['certification', 'certified', 'certificate', 'aws certified', 'google certified']

    return any(keyword in resume_lower for keyword in cert_keywords)


def has_leadership_experience(resume_text: str) -> bool:
    """Check if resume mentions leadership experience."""
    resume_lower = resume_text.lower()
    leadership_keywords = [
        'lead', 'led', 'leadership', 'manager', 'managed', 'team lead',
        'senior', 'principal', 'architect', 'mentor', 'mentored', 'coach'
    ]

    return any(keyword in resume_lower for keyword in leadership_keywords)


def process_resume(resume_text: str) -> dict:
    """
    Process a resume and extract all relevant information.

    Returns:
        Dictionary with extracted information
    """
    # Extract skills
    skills, skills_by_category = extract_skills_from_text(resume_text)

    # Calculate metrics
    skill_diversity = calculate_skill_diversity(skills_by_category)

    # Extract other information
    experience_years = extract_experience_years(resume_text)
    education_level = extract_education_level(resume_text)
    has_certs = has_certifications(resume_text)
    has_lead = has_leadership_experience(resume_text)

    # Count technical skills
    technical_categories = ['programming_languages', 'web_technologies', 'databases',
                           'data_science', 'cloud_devops', 'mobile', 'other_technical']
    technical_skills_count = sum(
        len(skills_by_category[cat]) for cat in technical_categories
    )

    return {
        'extracted_skills': skills,
        'num_skills': len(skills),
        'skills_by_category': skills_by_category,
        'skill_diversity': round(skill_diversity, 3),
        'technical_skills_count': technical_skills_count,
        'experience_years': experience_years,
        'education_level': education_level,
        'has_certifications': has_certs,
        'has_leadership': has_lead
    }
