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


def calculate_skills_score(num_skills: int, skill_diversity: float = 0.5) -> float:
    """
    Calculate skills score (0-100).

    Args:
        num_skills: Number of skills extracted
        skill_diversity: Skill diversity score (0-1)

    Returns:
        Skills score (0-100)
    """
    # Base score from number of skills (logarithmic scale)
    # 5 skills = ~50, 10 skills = ~70, 20 skills = ~90
    if num_skills == 0:
        base_score = 0
    else:
        import math
        base_score = min(100, 30 + (math.log(num_skills) / math.log(20)) * 70)

    # Diversity bonus (up to 20 points)
    diversity_bonus = skill_diversity * 20

    # Total skills score
    skills_score = min(100, base_score + diversity_bonus)

    return round(skills_score, 2)


def calculate_experience_score(experience_years: float) -> float:
    """
    Calculate experience score (0-100) with non-linear scaling.

    Args:
        experience_years: Years of experience

    Returns:
        Experience score (0-100)
    """
    if experience_years <= 0:
        return 0

    # Non-linear scaling: diminishing returns after 5 years
    # 0 years = 0, 1 year = 30, 2 years = 50, 5 years = 80, 10+ years = 100
    if experience_years >= 10:
        return 100.0
    elif experience_years >= 5:
        score = 80 + (experience_years - 5) * 4
    elif experience_years >= 2:
        score = 50 + (experience_years - 2) * 10
    else:
        score = experience_years * 30

    return round(min(100, score), 2)


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
    num_skills: int,
    skill_diversity: float,
    experience_years: float,
    education_level: str,
    has_certifications: bool,
    has_leadership: bool,
    weights: dict = None
) -> dict:
    """
    Calculate final resume score using weighted components.

    Args:
        num_skills: Number of skills
        skill_diversity: Skill diversity (0-1)
        experience_years: Years of experience
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

    # Calculate component scores
    skills_score = calculate_skills_score(num_skills, skill_diversity)
    experience_score = calculate_experience_score(experience_years)
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
