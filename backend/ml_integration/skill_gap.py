"""Skill gap analysis for candidates."""
from typing import List, Tuple


def analyze_skill_gap(
    candidate_skills: List[str],
    required_skills: List[str],
    preferred_skills: List[str] = None
) -> dict:
    """
    Analyze skill gaps between candidate and job requirements.

    Args:
        candidate_skills: List of skills the candidate has
        required_skills: List of skills required for the job
        preferred_skills: List of preferred skills for the job

    Returns:
        Dictionary with gap analysis results
    """
    if preferred_skills is None:
        preferred_skills = []

    # Normalize skill lists (case-insensitive comparison)
    candidate_skills_lower = [s.lower() for s in candidate_skills]
    required_skills_lower = [s.lower() for s in required_skills]
    preferred_skills_lower = [s.lower() for s in preferred_skills]

    # Find matched and missing required skills
    matched_required = []
    missing_required = []

    for skill in required_skills:
        if skill.lower() in candidate_skills_lower:
            matched_required.append(skill)
        else:
            missing_required.append(skill)

    # Find matched and missing preferred skills
    matched_preferred = []
    missing_preferred = []

    for skill in preferred_skills:
        if skill.lower() in candidate_skills_lower:
            matched_preferred.append(skill)
        else:
            missing_preferred.append(skill)

    # Calculate match percentage
    total_required = len(required_skills)
    if total_required > 0:
        required_match_percentage = (len(matched_required) / total_required) * 100
    else:
        required_match_percentage = 100.0

    total_skills = len(required_skills) + len(preferred_skills)
    if total_skills > 0:
        overall_match_percentage = (
            (len(matched_required) + len(matched_preferred)) / total_skills
        ) * 100
    else:
        overall_match_percentage = 100.0

    # Generate recommendations
    recommendations = generate_recommendations(
        missing_required,
        missing_preferred,
        matched_required,
        matched_preferred
    )

    return {
        "matched_skills": matched_required + matched_preferred,
        "matched_required": matched_required,
        "matched_preferred": matched_preferred,
        "missing_skills": missing_required + missing_preferred,
        "missing_required": missing_required,
        "missing_preferred": missing_preferred,
        "required_match_percentage": round(required_match_percentage, 2),
        "overall_match_percentage": round(overall_match_percentage, 2),
        "recommendations": recommendations
    }


def generate_recommendations(
    missing_required: List[str],
    missing_preferred: List[str],
    matched_required: List[str],
    matched_preferred: List[str]
) -> List[str]:
    """
    Generate actionable recommendations based on skill gaps.

    Args:
        missing_required: Missing required skills
        missing_preferred: Missing preferred skills
        matched_required: Matched required skills
        matched_preferred: Matched preferred skills

    Returns:
        List of recommendation strings
    """
    recommendations = []

    # Priority 1: Missing required skills
    if missing_required:
        if len(missing_required) <= 3:
            skills_str = ", ".join(missing_required)
            recommendations.append(
                f"Critical: Learn {skills_str} - these are required for this role"
            )
        else:
            top_missing = missing_required[:3]
            skills_str = ", ".join(top_missing)
            recommendations.append(
                f"Critical: Focus on learning {skills_str} first (top 3 missing required skills)"
            )

    # Priority 2: Missing preferred skills
    if missing_preferred and len(missing_preferred) <= 5:
        skills_str = ", ".join(missing_preferred[:3])
        recommendations.append(
            f"Recommended: Add {skills_str} to stand out from other candidates"
        )

    # Priority 3: Strengthen existing skills
    if matched_required:
        skills_str = ", ".join(matched_required[:2])
        recommendations.append(
            f"Strengthen your expertise in {skills_str} with certifications or projects"
        )

    # Priority 4: Build complementary skills
    complementary_skills = suggest_complementary_skills(
        matched_required + matched_preferred
    )
    if complementary_skills:
        recommendations.append(
            f"Consider learning {complementary_skills} to complement your existing skills"
        )

    # If candidate is a great match (all required skills matched)
    if not missing_required and matched_required:
        recommendations.append(
            "Excellent match! Consider highlighting relevant projects in your application"
        )

    return recommendations


def suggest_complementary_skills(existing_skills: List[str]) -> str:
    """
    Suggest complementary skills based on existing skills.

    Args:
        existing_skills: List of skills the candidate already has

    Returns:
        String with suggested complementary skills
    """
    existing_lower = [s.lower() for s in existing_skills]

    # Skill clusters and their complementary skills
    complementary_map = {
        'python': 'Django or Flask for web development',
        'react': 'TypeScript and Next.js',
        'javascript': 'Node.js and TypeScript',
        'aws': 'Docker and Kubernetes for containerization',
        'docker': 'Kubernetes for orchestration',
        'machine learning': 'MLOps and TensorFlow',
        'sql': 'NoSQL databases like MongoDB',
        'java': 'Spring Boot framework',
        'mobile': 'Flutter or React Native',
    }

    for skill, suggestion in complementary_map.items():
        if skill in existing_lower:
            return suggestion

    return "additional tools commonly used in your field"


def calculate_skill_similarity(skills1: List[str], skills2: List[str]) -> float:
    """
    Calculate similarity between two skill sets using Jaccard similarity.

    Args:
        skills1: First set of skills
        skills2: Second set of skills

    Returns:
        Similarity score (0-1)
    """
    if not skills1 or not skills2:
        return 0.0

    set1 = set(s.lower() for s in skills1)
    set2 = set(s.lower() for s in skills2)

    intersection = len(set1 & set2)
    union = len(set1 | set2)

    if union == 0:
        return 0.0

    return intersection / union
