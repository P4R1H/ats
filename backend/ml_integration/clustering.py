"""ML-based clustering for candidates using K-means."""
import json
import os
import numpy as np
from typing import List, Dict, Tuple
from pathlib import Path
import joblib

# Lazy imports for sklearn (only imported when needed)
_kmeans_model = None
_clustering_features = None
_cluster_names = None

def _load_models():
    """Lazily load K-means model and related files."""
    global _kmeans_model, _clustering_features, _cluster_names

    if _kmeans_model is not None:
        return _kmeans_model, _clustering_features, _cluster_names

    models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'

    # Load clustering features
    features_path = models_dir / 'clustering_features.json'
    if features_path.exists():
        with open(features_path, 'r') as f:
            _clustering_features = json.load(f)
    else:
        # Default features if file doesn't exist
        _clustering_features = [
            'Num_Skills',
            'Experience_Years',
            'Skill_Diversity',
            'Technical_Skills_Count',
            'Technical_Ratio',
            'Has_Certification_Encoded',
            'Has_Leadership_Encoded',
        ]

    # Load cluster names
    names_path = models_dir / 'cluster_names.json'
    if names_path.exists():
        with open(names_path, 'r') as f:
            _cluster_names = json.load(f)
    else:
        # Default cluster names
        _cluster_names = {
            "0": "Entry-Level Generalists",
            "1": "Junior Specialists",
            "2": "Mid-Level Generalists",
            "3": "Mid-Level Specialists",
            "4": "Senior Professionals",
            "5": "Expert Level",
            "6": "Highly Skilled Early Career",
            "7": "Experienced Focused"
        }

    # Load K-means model if exists
    model_path = models_dir / 'kmeans_model.pkl'
    if model_path.exists():
        _kmeans_model = joblib.load(model_path)
    else:
        # Train a new K-means model with default parameters
        from sklearn.cluster import KMeans
        _kmeans_model = KMeans(
            n_clusters=8,
            random_state=42,
            n_init=10,
            max_iter=300
        )

    return _kmeans_model, _clustering_features, _cluster_names


def prepare_clustering_features(
    num_skills: int,
    experience_years: float,
    education_level: str,
    has_certifications: bool,
    has_leadership: bool,
    skill_diversity: float,
    technical_skills_count: int = None,
    skills_by_category: Dict[str, List[str]] = None
) -> np.ndarray:
    """
    Prepare features for clustering prediction.

    Args:
        num_skills: Total number of skills
        experience_years: Years of experience
        education_level: Education level string
        has_certifications: Has certifications boolean
        has_leadership: Has leadership experience boolean
        skill_diversity: Skill diversity score (0-1)
        technical_skills_count: Count of technical skills
        skills_by_category: Dictionary of skills organized by category

    Returns:
        numpy array of features ready for clustering
    """
    # Education level encoding
    education_encoding = {
        'phd': 4,
        'master\'s': 3,
        'bachelor\'s': 2,
        'diploma': 1,
        'none': 0
    }
    education_encoded = education_encoding.get(education_level.lower(), 1)

    # Experience level encoding
    if experience_years < 1:
        exp_level_encoded = 0  # Entry
    elif experience_years < 3:
        exp_level_encoded = 1  # Junior
    elif experience_years < 6:
        exp_level_encoded = 2  # Mid
    else:
        exp_level_encoded = 3  # Senior

    # Technical skills count and ratio
    if technical_skills_count is None:
        if skills_by_category:
            technical_categories = ['programming_languages', 'web_technologies',
                                  'databases', 'data_science', 'cloud_devops',
                                  'mobile', 'other_technical']
            technical_skills_count = sum(
                len(skills_by_category.get(cat, []))
                for cat in technical_categories
            )
        else:
            technical_skills_count = int(num_skills * 0.7)  # Estimate

    technical_ratio = technical_skills_count / num_skills if num_skills > 0 else 0

    # Outlier detection (simple threshold-based)
    # Skills outlier: more than 30 skills is considered an outlier
    num_skills_is_outlier = 1 if num_skills > 30 else 0
    # Companies outlier: not tracked in current schema, default to 0
    num_companies_is_outlier = 0

    # Build feature vector (matching clustering_features.json order)
    features = [
        num_skills,
        experience_years,
        exp_level_encoded,
        education_encoded,
        skill_diversity,
        technical_skills_count,
        technical_ratio,
        1 if has_certifications else 0,
        1 if has_leadership else 0,
        num_skills_is_outlier,
        num_companies_is_outlier,
    ]

    # Add skill category counts (always add to maintain consistent feature length)
    skill_categories = [
        'programming_languages', 'web_technologies', 'databases',
        'data_science', 'cloud_devops', 'mobile', 'design',
        'soft_skills', 'other_technical'
    ]

    if skills_by_category:
        for category in skill_categories:
            val = skills_by_category.get(category, 0)
            # Handle both array format and count format
            if isinstance(val, list):
                features.append(len(val))
            elif isinstance(val, int):
                features.append(val)
            else:
                features.append(0)
    else:
        # Pad with zeros to maintain consistent feature vector length
        features.extend([0] * len(skill_categories))

    return np.array(features).reshape(1, -1)


def assign_cluster(
    experience_years: float,
    num_skills: int,
    skill_diversity: float = 0.5,
    education_level: str = "bachelor's",
    has_certifications: bool = False,
    has_leadership: bool = False,
    technical_skills_count: int = None,
    skills_by_category: Dict[str, List[str]] = None,
    use_ml: bool = True
) -> Dict[str, any]:
    """
    Assign a candidate to a cluster using ML or rule-based approach.

    Args:
        experience_years: Years of experience
        num_skills: Number of skills
        skill_diversity: Skill diversity score (0-1)
        education_level: Education level
        has_certifications: Has certifications
        has_leadership: Has leadership experience
        technical_skills_count: Count of technical skills
        skills_by_category: Skills organized by category
        use_ml: Whether to use ML clustering (True) or rule-based (False)

    Returns:
        Dictionary with cluster_id, cluster_name, cluster_description
    """
    if use_ml:
        try:
            # Load K-means model
            kmeans, clustering_features, cluster_names = _load_models()

            # Prepare features
            X = prepare_clustering_features(
                num_skills=num_skills,
                experience_years=experience_years,
                education_level=education_level,
                has_certifications=has_certifications,
                has_leadership=has_leadership,
                skill_diversity=skill_diversity,
                technical_skills_count=technical_skills_count,
                skills_by_category=skills_by_category
            )

            # Handle missing features (pad or trim to match model)
            expected_features = len(clustering_features) if clustering_features else 20
            actual_features = X.shape[1]

            if actual_features < expected_features:
                # Pad with zeros
                padding = np.zeros((1, expected_features - actual_features))
                X = np.hstack([X, padding])
            elif actual_features > expected_features:
                # Trim
                X = X[:, :expected_features]

            # Handle NaN values
            X = np.nan_to_num(X, nan=0.0)

            # Predict cluster
            if hasattr(kmeans, 'predict'):
                cluster_id = int(kmeans.predict(X)[0])
            else:
                # Model not trained, use rule-based
                return _assign_cluster_rule_based(
                    experience_years, num_skills, skill_diversity
                )

            # Get cluster name
            cluster_name = cluster_names.get(str(cluster_id), f"Cluster {cluster_id}")

            return {
                "cluster_id": cluster_id,
                "cluster_name": cluster_name,
                "cluster_description": f"ML-identified cluster based on {expected_features} features"
            }

        except Exception as e:
            # Fallback to rule-based if ML fails
            print(f"ML clustering failed: {e}. Using rule-based approach.")
            return _assign_cluster_rule_based(
                experience_years, num_skills, skill_diversity
            )
    else:
        return _assign_cluster_rule_based(
            experience_years, num_skills, skill_diversity
        )


def _assign_cluster_rule_based(
    experience_years: float,
    num_skills: int,
    skill_diversity: float
) -> Dict[str, any]:
    """Rule-based clustering fallback."""
    # Predefined cluster definitions
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

    # Score each cluster
    cluster_scores = []
    for cluster in CLUSTER_DEFINITIONS:
        score = 0

        # Experience fit
        if cluster["min_experience"] <= experience_years <= cluster["max_experience"]:
            score += 2

        # Skills fit
        if cluster["min_skills"] <= num_skills <= cluster["max_skills"]:
            score += 2

        # Partial credit
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

    # Get best match
    cluster_scores.sort(key=lambda x: x[0], reverse=True)
    best_cluster = cluster_scores[0][1]

    return {
        "cluster_id": best_cluster["id"],
        "cluster_name": best_cluster["name"],
        "cluster_description": best_cluster["description"]
    }


def train_kmeans_model(
    data: List[Dict],
    n_clusters: int = 8,
    save_model: bool = True
) -> Tuple:
    """
    Train a new K-means model on candidate data.

    Args:
        data: List of candidate dictionaries with features
        n_clusters: Number of clusters (default 8 from notebook analysis)
        save_model: Whether to save the trained model

    Returns:
        Tuple of (model, cluster_labels, silhouette_score)
    """
    from sklearn.cluster import KMeans
    from sklearn.metrics import silhouette_score

    # Prepare feature matrix
    X = []
    for candidate in data:
        features = prepare_clustering_features(
            num_skills=candidate.get('num_skills', 0),
            experience_years=candidate.get('experience_years', 0),
            education_level=candidate.get('education_level', "bachelor's"),
            has_certifications=candidate.get('has_certifications', False),
            has_leadership=candidate.get('has_leadership', False),
            skill_diversity=candidate.get('skill_diversity', 0.5),
            technical_skills_count=candidate.get('technical_skills_count'),
            skills_by_category=candidate.get('skills_by_category')
        )
        X.append(features[0])

    X = np.array(X)
    X = np.nan_to_num(X, nan=0.0)  # Handle NaN

    # Train K-means
    kmeans = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10,
        max_iter=300
    )
    cluster_labels = kmeans.fit_predict(X)

    # Calculate silhouette score
    sil_score = silhouette_score(X, cluster_labels)

    # Save model if requested
    if save_model:
        models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'
        models_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(kmeans, models_dir / 'kmeans_model.pkl')

    return kmeans, cluster_labels, sil_score


def get_cluster_info(cluster_id: int) -> Dict[str, any]:
    """Get information about a specific cluster."""
    _, _, cluster_names = _load_models()

    cluster_name = cluster_names.get(str(cluster_id), f"Cluster {cluster_id}")

    return {
        "id": cluster_id,
        "name": cluster_name,
        "description": f"ML-identified cluster group {cluster_id}"
    }


def get_all_clusters() -> List[Dict[str, any]]:
    """Get all cluster definitions."""
    _, _, cluster_names = _load_models()

    clusters = []
    for cluster_id, name in cluster_names.items():
        clusters.append({
            "id": int(cluster_id),
            "name": name,
            "description": f"ML-identified cluster group {cluster_id}"
        })

    return sorted(clusters, key=lambda x: x['id'])
