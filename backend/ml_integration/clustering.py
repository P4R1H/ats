"""Simple clustering for candidates based on their profiles."""
from typing import List, Dict


# Predefined cluster definitions based on experience and skills
CLUSTER_DEFINITIONS = [
    {
        "id": 0,
        "name": "Entry-Level Generalists",
        "description": "Early career professionals with diverse but foundational skills",
        "min_experience": 0,
        "max_experience": 2,
        "min_skills": 0,
        "max_skills": 10
    },
    {
        "id": 1,
        "name": "Junior Specialists",
        "description": "Focused skillset with 1-3 years of experience",
        "min_experience": 1,
        "max_experience": 3,
        "min_skills": 8,
        "max_skills": 15
    },
    {
        "id": 2,
        "name": "Mid-Level Generalists",
        "description": "Experienced professionals with broad skill coverage",
        "min_experience": 3,
        "max_experience": 6,
        "min_skills": 10,
        "max_skills": 20
    },
    {
        "id": 3,
        "name": "Mid-Level Specialists",
        "description": "Strong depth in specific technical areas",
        "min_experience": 3,
        "max_experience": 6,
        "min_skills": 12,
        "max_skills": 25
    },
    {
        "id": 4,
        "name": "Senior Professionals",
        "description": "Highly experienced with extensive skillset",
        "min_experience": 6,
        "max_experience": 10,
        "min_skills": 15,
        "max_skills": 999
    },
    {
        "id": 5,
        "name": "Expert Level",
        "description": "Elite professionals with 10+ years and comprehensive skills",
        "min_experience": 10,
        "max_experience": 999,
        "min_skills": 15,
        "max_skills": 999
    },
    {
        "id": 6,
        "name": "Highly Skilled Early Career",
        "description": "Young professionals with impressive skill acquisition",
        "min_experience": 0,
        "max_experience": 3,
        "min_skills": 15,
        "max_skills": 999
    },
    {
        "id": 7,
        "name": "Experienced Focused",
        "description": "Veteran professionals with concentrated expertise",
        "min_experience": 7,
        "max_experience": 999,
        "min_skills": 8,
        "max_skills": 15
    }
]


def assign_cluster(experience_years: float, num_skills: int, skill_diversity: float = 0.5) -> Dict[str, any]:
    """
    Assign a candidate to a cluster based on their profile.

    Args:
        experience_years: Years of experience
        num_skills: Number of skills
        skill_diversity: Skill diversity score (0-1)

    Returns:
        Dictionary with cluster_id and cluster_name
    """
    # Score each cluster based on how well the candidate fits
    cluster_scores = []

    for cluster in CLUSTER_DEFINITIONS:
        score = 0

        # Experience fit
        if cluster["min_experience"] <= experience_years <= cluster["max_experience"]:
            score += 2

        # Skills fit
        if cluster["min_skills"] <= num_skills <= cluster["max_skills"]:
            score += 2

        # Partial credit for close matches
        exp_diff = min(
            abs(experience_years - cluster["min_experience"]),
            abs(experience_years - cluster["max_experience"])
        )
        if exp_diff <= 2:
            score += 1

        skills_diff = min(
            abs(num_skills - cluster["min_skills"]),
            abs(num_skills - cluster["max_skills"])
        )
        if skills_diff <= 3:
            score += 1

        cluster_scores.append((score, cluster))

    # Sort by score and get best match
    cluster_scores.sort(key=lambda x: x[0], reverse=True)
    best_cluster = cluster_scores[0][1]

    return {
        "cluster_id": best_cluster["id"],
        "cluster_name": best_cluster["name"],
        "cluster_description": best_cluster["description"]
    }


def get_cluster_info(cluster_id: int) -> Dict[str, any]:
    """
    Get information about a specific cluster.

    Args:
        cluster_id: The cluster ID

    Returns:
        Dictionary with cluster information
    """
    for cluster in CLUSTER_DEFINITIONS:
        if cluster["id"] == cluster_id:
            return cluster

    return CLUSTER_DEFINITIONS[0]  # Default to entry-level


def get_all_clusters() -> List[Dict[str, any]]:
    """Get all cluster definitions."""
    return CLUSTER_DEFINITIONS
