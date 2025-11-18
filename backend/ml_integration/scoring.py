"""
Two-Stage Resume Scoring Algorithm.

Stage 1: Requirements Check (Pass/Fail)
  - Candidates must meet ALL requirements to proceed
  - Missing ANY requirement → automatic rejection (score = 0)

Stage 2: Component Scoring (0-100 each)
  - Only applied to candidates who passed Stage 1
  - Scores based on how much they EXCEED minimums
  - Weighted combination produces final ranking score

This fixes the fundamental flaw where weights were confused with requirements.
"""
import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional


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
        },
        "education_hierarchy": {
            "none": 0,
            "diploma": 1,
            "bachelors": 2,
            "masters": 3,
            "phd": 4
        }
    }


def check_requirements(
    candidate_skills: List[str],
    candidate_experience: float,
    candidate_education: str,
    candidate_has_certifications: bool,
    candidate_has_leadership: bool,
    job_required_skills: List[str],
    job_min_experience: int,
    job_min_education: str,
    job_certifications_required: bool,
    job_leadership_required: bool
) -> Tuple[bool, List[str], str]:
    """
    STAGE 1: Check if candidate meets ALL hard requirements.

    This is a PASS/FAIL check. Candidates must meet ALL requirements
    to proceed to scoring. Missing ANY requirement = automatic rejection.

    Args:
        candidate_skills: Candidate's extracted skills
        candidate_experience: Candidate's years of experience
        candidate_education: Candidate's education level
        candidate_has_certifications: Whether candidate has certifications
        candidate_has_leadership: Whether candidate has leadership experience
        job_required_skills: Job's required skills (must have ALL)
        job_min_experience: Job's minimum years of experience
        job_min_education: Job's minimum education level
        job_certifications_required: Whether certifications are required
        job_leadership_required: Whether leadership is required

    Returns:
        Tuple of (meets_requirements, missing_requirements, rejection_reason)
    """
    missing = []

    # Check required skills (candidate must have ALL)
    if job_required_skills:
        candidate_skills_lower = [s.lower() for s in candidate_skills]
        required_skills_lower = [s.lower() for s in job_required_skills]

        missing_skills = []
        for skill in required_skills_lower:
            if skill not in candidate_skills_lower:
                missing_skills.append(skill)

        if missing_skills:
            missing.append(f"Missing required skills: {', '.join(missing_skills)}")

    # Check minimum experience
    if candidate_experience < job_min_experience:
        missing.append(f"Experience: {candidate_experience} years < {job_min_experience} years required")

    # Check minimum education level
    if job_min_education and job_min_education != "none":
        education_hierarchy = SCORING_CONFIG.get("education_hierarchy", {})

        # Map candidate education to hierarchy level
        candidate_edu_level = 0
        candidate_edu_lower = candidate_education.lower() if candidate_education else ""
        if "phd" in candidate_edu_lower or "doctorate" in candidate_edu_lower:
            candidate_edu_level = 4
        elif "master" in candidate_edu_lower:
            candidate_edu_level = 3
        elif "bachelor" in candidate_edu_lower:
            candidate_edu_level = 2
        elif "diploma" in candidate_edu_lower or "associate" in candidate_edu_lower:
            candidate_edu_level = 1
        else:
            candidate_edu_level = 0

        required_edu_level = education_hierarchy.get(job_min_education, 0)

        if candidate_edu_level < required_edu_level:
            missing.append(f"Education: {candidate_education or 'Not Specified'} < {job_min_education} required")

    # Check certifications requirement
    if job_certifications_required and not candidate_has_certifications:
        missing.append("Certifications required but not found")

    # Check leadership requirement
    if job_leadership_required and not candidate_has_leadership:
        missing.append("Leadership experience required but not found")

    # Determine pass/fail
    meets_requirements = len(missing) == 0
    rejection_reason = "; ".join(missing) if missing else ""

    return meets_requirements, missing, rejection_reason


def calculate_skills_score(
    candidate_skills: List[str],
    preferred_skills: List[str],
    skill_diversity: float = 0.5
) -> float:
    """
    STAGE 2: Calculate skills score (0-100) based on PREFERRED skills.

    NOTE: Required skills are checked in Stage 1. At this point, the candidate
    already has all required skills. This function scores:
    - Preferred skills match (nice-to-have bonus)
    - Skill diversity (breadth of expertise)

    Args:
        candidate_skills: Candidate's skills (already has all required)
        preferred_skills: Job's preferred skills (bonus points)
        skill_diversity: Skill diversity score (0-1)

    Returns:
        Skills score (0-100)

    Scoring breakdown:
    - 80 points: Preferred skills match (0% = 0 pts, 100% = 80 pts)
    - 20 points: Skill diversity (0 = 0 pts, 1.0 = 20 pts)
    """
    # Convert to lowercase for matching
    candidate_skills_lower = [s.lower() for s in candidate_skills]
    preferred_skills_lower = [s.lower() for s in preferred_skills] if preferred_skills else []

    # Calculate preferred skills match (80 points max)
    if preferred_skills_lower:
        matched_preferred = len(set(candidate_skills_lower) & set(preferred_skills_lower))
        preferred_match_pct = matched_preferred / len(preferred_skills_lower)
        preferred_score = preferred_match_pct * 80
    else:
        # No preferred skills defined = give base score for having skills
        preferred_score = min(80, len(candidate_skills) * 4)

    # Diversity bonus (20 points max)
    diversity_score = skill_diversity * 20

    # Total skills score
    skills_score = preferred_score + diversity_score

    return round(min(100, skills_score), 2)


def calculate_experience_score(
    candidate_experience: float,
    min_experience: int
) -> float:
    """
    STAGE 2: Calculate experience score (0-100) for years BEYOND minimum.

    NOTE: Candidate already meets minimum (checked in Stage 1).
    This scores how much they EXCEED the minimum.

    Args:
        candidate_experience: Candidate's years of experience
        min_experience: Job's minimum experience (candidate already meets this)

    Returns:
        Experience score (0-100)

    Scoring breakdown:
    - At minimum: 70 points (baseline)
    - +1 to +2 years: 70-100 points (perfect fit range)
    - +3 to +5 years: 85-95 points (good but slightly overqualified)
    - +6+ years: 70-85 points (overqualified, diminishing returns)
    """
    experience_beyond_min = candidate_experience - min_experience

    if experience_beyond_min <= 0:
        # At minimum = baseline score
        score = 70
    elif experience_beyond_min <= 2:
        # Perfect fit range (+1-2 years beyond min)
        # +1 year = 85 points, +2 years = 100 points
        score = 70 + (experience_beyond_min * 15)
    elif experience_beyond_min <= 5:
        # Slightly overqualified but still good
        # +3 years = 95, +5 years = 85
        score = 100 - ((experience_beyond_min - 2) * 3)
    else:
        # Overqualified - diminishing returns
        # +6 years = 82, +10 years = 70
        score = max(70, 85 - ((experience_beyond_min - 5) * 3))

    return round(min(100, max(0, score)), 2)


def calculate_education_score(
    candidate_education: str,
    min_education: str = "none"
) -> float:
    """
    STAGE 2: Calculate education score (0-100) RELATIVE to minimum.

    NOTE: Candidate already meets minimum (checked in Stage 1).
    This scores how much they EXCEED the minimum.

    Args:
        candidate_education: Candidate's education level
        min_education: Job's minimum education requirement

    Returns:
        Education score (0-100)

    Scoring examples:
    - If min = None: Bachelor's=70, Master's=85, PhD=100
    - If min = Bachelor's: Bachelor's=60, Master's=85, PhD=100
    - If min = Master's: Master's=70, PhD=100
    - If min = PhD: PhD=100
    """
    education_hierarchy = SCORING_CONFIG.get("education_hierarchy", {})

    # Map candidate education to level
    candidate_edu_lower = candidate_education.lower() if candidate_education else ""
    if "phd" in candidate_edu_lower or "doctorate" in candidate_edu_lower:
        candidate_level = 4
        candidate_name = "PhD"
    elif "master" in candidate_edu_lower:
        candidate_level = 3
        candidate_name = "Master's"
    elif "bachelor" in candidate_edu_lower:
        candidate_level = 2
        candidate_name = "Bachelor's"
    elif "diploma" in candidate_edu_lower or "associate" in candidate_edu_lower:
        candidate_level = 1
        candidate_name = "Diploma"
    else:
        candidate_level = 0
        candidate_name = "Not Specified"

    # Get minimum required level
    min_level = education_hierarchy.get(min_education, 0) if min_education else 0

    # Calculate score relative to minimum
    levels_above_min = candidate_level - min_level

    if levels_above_min == 0:
        # Exactly at minimum = baseline
        if min_level == 0:  # No requirement
            return SCORING_CONFIG["education_scores"].get(candidate_name, 40)
        else:
            return 70  # Met requirement exactly
    elif levels_above_min == 1:
        # One level above minimum
        return 85
    elif levels_above_min >= 2:
        # Two or more levels above
        return 100
    else:
        # Below minimum (shouldn't happen, caught in Stage 1)
        return 0


def calculate_bonus_score(
    has_certifications: bool,
    has_leadership: bool
) -> float:
    """
    Calculate bonus score from certifications and leadership (0-100).

    NOTE: If these are required, candidate already has them (Stage 1).
    This is for bonus points when not required.

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
    # Candidate attributes
    candidate_skills: List[str],
    candidate_experience: float,
    candidate_education: str,
    candidate_has_certifications: bool,
    candidate_has_leadership: bool,
    candidate_skill_diversity: float,
    # Job requirements (hard filters)
    job_required_skills: List[str],
    job_preferred_skills: List[str],
    job_min_experience: int,
    job_min_education: str = "none",
    job_certifications_required: bool = False,
    job_leadership_required: bool = False,
    # Job weights (for ranking)
    weights: Optional[Dict[str, float]] = None
) -> Dict:
    """
    TWO-STAGE SCORING SYSTEM: Check requirements, then rank qualified candidates.

    STAGE 1: Requirements Check (Pass/Fail)
      - Candidate must meet ALL requirements
      - Missing ANY requirement → rejection (score = 0)

    STAGE 2: Component Scoring (0-100 each)
      - Only for candidates who passed Stage 1
      - Score how much they exceed minimums
      - Weighted combination = final score

    Args:
        Candidate attributes (from resume parsing)
        Job requirements (from job posting)
        Job weights (for scoring)

    Returns:
        Dictionary with:
          - meets_requirements: bool
          - missing_requirements: list
          - rejection_reason: str (if rejected)
          - component_scores: dict (if passed)
          - final_score: float (0-100, or 0 if rejected)
    """
    # Use default weights if not provided
    if weights is None:
        weights = SCORING_CONFIG["weights"]

    # ========== STAGE 1: REQUIREMENTS CHECK (PASS/FAIL) ==========
    meets_requirements, missing, rejection_reason = check_requirements(
        candidate_skills=candidate_skills,
        candidate_experience=candidate_experience,
        candidate_education=candidate_education,
        candidate_has_certifications=candidate_has_certifications,
        candidate_has_leadership=candidate_has_leadership,
        job_required_skills=job_required_skills,
        job_min_experience=job_min_experience,
        job_min_education=job_min_education,
        job_certifications_required=job_certifications_required,
        job_leadership_required=job_leadership_required
    )

    # If requirements not met → REJECT (score = 0)
    if not meets_requirements:
        return {
            "meets_requirements": False,
            "missing_requirements": missing,
            "rejection_reason": rejection_reason,
            "final_score": 0,
            "skills_score": 0,
            "experience_score": 0,
            "education_score": 0,
            "bonus_score": 0
        }

    # ========== STAGE 2: COMPONENT SCORING (0-100 EACH) ==========
    # Candidate passed all requirements → score how much they exceed minimums

    skills_score = calculate_skills_score(
        candidate_skills=candidate_skills,
        preferred_skills=job_preferred_skills,
        skill_diversity=candidate_skill_diversity
    )

    experience_score = calculate_experience_score(
        candidate_experience=candidate_experience,
        min_experience=job_min_experience
    )

    education_score = calculate_education_score(
        candidate_education=candidate_education,
        min_education=job_min_education
    )

    bonus_score = calculate_bonus_score(
        has_certifications=candidate_has_certifications,
        has_leadership=candidate_has_leadership
    )

    # ========== STAGE 3: WEIGHTED FINAL SCORE ==========
    final_score = (
        skills_score * weights.get("skills", 0.4) +
        experience_score * weights.get("experience", 0.3) +
        education_score * weights.get("education", 0.2) +
        bonus_score * (weights.get("certification", 0.05) + weights.get("leadership", 0.05))
    )

    return {
        "meets_requirements": True,
        "missing_requirements": [],
        "rejection_reason": "",
        "final_score": round(final_score, 2),
        "skills_score": round(skills_score, 2),
        "experience_score": round(experience_score, 2),
        "education_score": round(education_score, 2),
        "bonus_score": round(bonus_score, 2)
    }


def calculate_percentile(score: float, all_scores: List[float]) -> float:
    """
    Calculate percentile ranking for a score.

    Args:
        score: The score to rank
        all_scores: List of all scores to compare against

    Returns:
        Percentile (0-100)
    """
    if not all_scores:
        return 50.0

    # Count how many scores are below this score
    below_count = sum(1 for s in all_scores if s < score)

    # Calculate percentile
    percentile = (below_count / len(all_scores)) * 100

    return round(percentile, 2)
