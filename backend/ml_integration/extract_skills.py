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
    # Word boundaries \b don't work well with special chars like +, #, and .
    # Also handle variations like "NextJS" vs "Next.js"
    special_patterns = {
        'c++': r'\bc\+\+(?!\w)',
        'c#': r'\bc#(?!\w)',
        'asp.net': r'\basp\.net\b',
        '.net': r'\.net\b',
        'next.js': r'\b(?:next\.js|nextjs)\b',  # Matches both "Next.js" and "NextJS"
        'node.js': r'\b(?:node\.js|nodejs)\b',  # Matches both "Node.js" and "NodeJS"
        'vue.js': r'\b(?:vue\.js|vuejs)\b',     # Matches both "Vue.js" and "VueJS"
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
    Uses heuristics to find experience mentions and calculate duration from date ranges.
    """
    resume_lower = resume_text.lower()

    # Pattern 1: Explicit "X years of experience" statements (most reliable)
    pattern_explicit = r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp\.?)'
    explicit_matches = re.findall(pattern_explicit, resume_lower)
    if explicit_matches:
        # Take the maximum value found in explicit statements
        years = max(int(match) for match in explicit_matches)
        return min(float(years), 20.0)  # Cap at 20 years

    # Pattern 2: Calculate from date ranges (Month YYYY – Month YYYY or YYYY – YYYY)
    # Common formats: "Jan 2024 – Present", "2023 – 2024", "May 2023 – Dec 2024"
    total_months = 0

    # Match ranges like "Month YYYY – Month YYYY" or "Month YYYY – Present"
    date_range_pattern = r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\s*[–—-]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})|present|current)'
    date_matches = re.findall(date_range_pattern, resume_lower)

    from datetime import datetime
    current_year = datetime.now().year

    for match in date_matches:
        start_year = int(match[0])
        end_year = int(match[1]) if match[1] else current_year

        # Only count realistic work experience (not future dates, not too far in past)
        if 1990 <= start_year <= current_year and start_year <= end_year <= current_year + 1:
            months = (end_year - start_year) * 12
            total_months += months

    if total_months > 0:
        years = total_months / 12.0
        return min(round(years, 1), 20.0)

    # Pattern 3: Look for year ranges without months "2023 – 2024"
    year_range_pattern = r'\b(19\d{2}|20\d{2})\s*[–—-]\s*(19\d{2}|20\d{2}|present|current)\b'
    year_matches = re.findall(year_range_pattern, resume_lower)

    total_years = 0
    for match in year_matches:
        start_year = int(match[0])
        end_year = int(match[1]) if match[1] not in ['present', 'current'] else current_year

        # Only count realistic work experience
        if 1990 <= start_year <= current_year and start_year <= end_year <= current_year + 1:
            years_diff = end_year - start_year
            if years_diff <= 10:  # Sanity check: single position shouldn't be more than 10 years
                total_years += years_diff

    if total_years > 0:
        return min(float(total_years), 20.0)

    # Default: estimate from resume length (very rough heuristic)
    word_count = len(resume_text.split())
    if word_count > 500:
        return 1.0  # Changed from 3.0 to 1.0 for more conservative estimate
    elif word_count > 300:
        return 0.5
    else:
        return 0.0


def extract_education_level(resume_text: str) -> str:
    """
    Extract education level from resume text.
    Returns: PhD, Master's, Bachelor's, Diploma, or Not Specified
    """
    resume_lower = resume_text.lower()

    # Check for different education levels with comprehensive patterns
    if 'phd' in resume_lower or 'ph.d' in resume_lower or 'doctorate' in resume_lower or 'doctoral' in resume_lower:
        return "PhD"
    elif ("master's" in resume_lower or 'masters' in resume_lower or 'm.s.' in resume_lower or
          'msc' in resume_lower or 'm.sc' in resume_lower or 'mba' in resume_lower or
          'master of' in resume_lower or 'm.tech' in resume_lower):
        return "Master's"
    elif ("bachelor's" in resume_lower or 'bachelors' in resume_lower or
          'b.s.' in resume_lower or 'bsc' in resume_lower or 'b.sc' in resume_lower or
          'b.tech' in resume_lower or 'b.e.' in resume_lower or
          'bachelor of technology' in resume_lower or 'bachelor of science' in resume_lower or
          'bachelor of arts' in resume_lower or 'bachelor of engineering' in resume_lower or
          'bachelor of computer' in resume_lower or 'undergraduate' in resume_lower):
        return "Bachelor's"
    elif 'diploma' in resume_lower or 'associate' in resume_lower:
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
