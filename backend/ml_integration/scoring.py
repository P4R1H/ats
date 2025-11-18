"""Resume scoring algorithm."""
import json
from pathlib import Path


# Load scoring configuration
SCORING_CONFIG_PATH = Path(__file__).parent.parent.parent / "ml" / "models" / "scoring_config.json"

try:
    with open(SCORING_CONFIG_PATH, 'r') as f:
        SCORING_CONFIG = json.load(f)
except FileNotFoundError:
    # Fallback default configuration
    SCORING_CONFIG = {
        "weights": {
            "skills": 0.4,
            "experience": 0.3,
            "education": 0.2,
            "certification": 0.05,
            "leadership": 0.05
        },
        "education_scores": {
            "PhD": 100,
            "Master's": 85,
            "Bachelor's": 70,
            "Diploma": 50,
            "Not Specified": 40
        }
    }


def calculate_skills_score(
    candidate_skills: list,
    required_skills: list,
    preferred_skills: list = None,
    skill_diversity: float = 0.5
) -> float:
    """
    Calculate skills score (0-100) based on job requirements match.

    This is the CORE of the ATS scoring system - we compare candidate skills
    directly against the job's required and preferred skills.

    Args:
        candidate_skills: List of skills extracted from resume
        required_skills: List of required skills for the job
        preferred_skills: List of preferred skills for the job (optional)
        skill_diversity: Skill diversity score (0-1)

    Returns:
        Skills score (0-100)

    Scoring breakdown:
    - 70 points: Required skills match (critical for job fit)
    - 20 points: Preferred skills match (nice-to-have)
    - 10 points: Skill diversity (breadth of expertise)
    """
    if preferred_skills is None:
        preferred_skills = []

    # Convert all skills to lowercase for case-insensitive matching
    candidate_skills_lower = [s.lower() for s in candidate_skills]
    required_skills_lower = [s.lower() for s in required_skills]
    preferred_skills_lower = [s.lower() for s in preferred_skills] if preferred_skills else []

    # Calculate required skills match percentage (70 points max)
    if required_skills_lower:
        matched_required = len(set(candidate_skills_lower) & set(required_skills_lower))
        required_match_pct = matched_required / len(required_skills_lower)
        required_score = required_match_pct * 70
    else:
        # If no required skills specified, give base score based on having any skills
        required_score = min(70, len(candidate_skills) * 7)

    # Calculate preferred skills match percentage (20 points max)
    if preferred_skills_lower:
        matched_preferred = len(set(candidate_skills_lower) & set(preferred_skills_lower))
        preferred_match_pct = matched_preferred / len(preferred_skills_lower)
        preferred_score = preferred_match_pct * 20
    else:
        # If no preferred skills, distribute some weight to having extra skills
        preferred_score = min(20, (len(candidate_skills) - len(required_skills_lower)) * 2) if len(candidate_skills) > len(required_skills_lower) else 0

    # Diversity bonus (10 points max)
    diversity_score = skill_diversity * 10

    # Calculate final skills score
    skills_score = required_score + preferred_score + diversity_score

    return round(min(100, skills_score), 2)


def calculate_experience_score(experience_years: float, min_experience: int = 0) -> float:
    """
    Calculate experience score (0-100) relative to job requirements.

    This scoring rewards candidates who match the job's experience level.
    Overqualified candidates receive diminishing returns.

    Args:
        experience_years: Candidate's years of experience
        min_experience: Job's minimum required experience

    Returns:
        Experience score (0-100)

    Scoring breakdown:
    - Below minimum: Proportional penalty (0-60 points)
    - At minimum to +2 years: Perfect fit range (90-100 points)
    - +3 to +5 years overqualified: Good but declining (80-90 points)
    - +6+ years overqualified: Risk of leaving/boredom (70-80 points)
    """
    if experience_years < 0:
        return 0

    # Calculate difference from minimum requirement
    experience_diff = experience_years - min_experience

    if experience_diff < 0:
        # Below minimum - proportional penalty
        # At 50% of minimum → 50 points, at 0% → 0 points
        score = (experience_years / max(min_experience, 1)) * 60
    elif experience_diff <= 2:
        # Perfect fit range - highest scores
        # At minimum → 90, at +2 years → 100
        score = 90 + (experience_diff * 5)
    elif experience_diff <= 5:
        # Slightly overqualified - good but not perfect
        # At +3 years → 88, at +5 years → 80
        score = 90 - ((experience_diff - 2) * 3)
    else:
        # Significantly overqualified - diminishing returns
        # Risk: may leave for better opportunity, may be bored
        # At +6 years → 77, at +10 years → 65
        score = max(60, 80 - ((experience_diff - 5) * 3))

    return round(min(100, max(0, score)), 2)


def calculate_education_score(education_level: str) -> float:
    """
    Calculate education score (0-100).

    Args:
        education_level: Education level string

    Returns:
        Education score (0-100)
    """
    return float(SCORING_CONFIG["education_scores"].get(education_level, 40))


def calculate_bonus_score(has_certifications: bool, has_leadership: bool) -> float:
    """
    Calculate bonus score from certifications and leadership.

    Args:
        has_certifications: Whether candidate has certifications
        has_leadership: Whether candidate has leadership experience

    Returns:
        Bonus score (0-100)
    """
    bonus = 0

    if has_certifications:
        bonus += 50  # 50 points for certifications

    if has_leadership:
        bonus += 50  # 50 points for leadership

    return round(bonus, 2)


def calculate_final_score(
    candidate_skills: list,
    required_skills: list,
    preferred_skills: list,
    skill_diversity: float,
    experience_years: float,
    min_experience: int,
    education_level: str,
    has_certifications: bool,
    has_leadership: bool,
    weights: dict = None
) -> dict:
    """
    Calculate final resume score using weighted components.

    This is the MAIN SCORING FUNCTION that combines all components
    to produce a final candidate score for a specific job.

    Args:
        candidate_skills: List of candidate's skills
        required_skills: List of job's required skills
        preferred_skills: List of job's preferred skills
        skill_diversity: Skill diversity (0-1)
        experience_years: Years of experience
        min_experience: Job's minimum experience requirement
        education_level: Education level
        has_certifications: Has certifications
        has_leadership: Has leadership experience
        weights: Optional custom weights dict

    Returns:
        Dictionary with all score components
    """
    # Use default weights if not provided
    if weights is None:
        weights = SCORING_CONFIG["weights"]

    # Calculate component scores using JOB-SPECIFIC criteria
    skills_score = calculate_skills_score(
        candidate_skills,
        required_skills,
        preferred_skills,
        skill_diversity
    )
    experience_score = calculate_experience_score(experience_years, min_experience)
    education_score = calculate_education_score(education_level)
    bonus_score = calculate_bonus_score(has_certifications, has_leadership)

    # Calculate weighted final score
    final_score = (
        skills_score * weights.get("skills", 0.4) +
        experience_score * weights.get("experience", 0.3) +
        education_score * weights.get("education", 0.2) +
        bonus_score * (weights.get("certification", 0.05) + weights.get("leadership", 0.05))
    )

    return {
        "skills_score": skills_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "bonus_score": bonus_score,
        "final_score": round(final_score, 2)
    }


def calculate_percentile(score: float, all_scores: list) -> float:
    """
    Calculate percentile ranking for a score.

    Args:
        score: The score to rank
        all_scores: List of all scores to compare against

    Returns:
        Percentile (0-100)
    """
    if not all_scores:
        return 50.0  # Default to 50th percentile if no comparison data

    # Count how many scores are below this score
    below_count = sum(1 for s in all_scores if s < score)

    # Calculate percentile
    percentile = (below_count / len(all_scores)) * 100

    return round(percentile, 2)
