"""TF-IDF vectorization for job-resume matching using cosine similarity."""
import joblib
import numpy as np
from pathlib import Path
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Lazy imports for sklearn
_tfidf_vectorizer = None
_tfidf_matrix = None

def _load_or_create_vectorizer():
    """Lazily load or create TF-IDF vectorizer."""
    global _tfidf_vectorizer

    if _tfidf_vectorizer is not None:
        return _tfidf_vectorizer

    models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'
    vectorizer_path = models_dir / 'tfidf_vectorizer.pkl'

    if vectorizer_path.exists():
        _tfidf_vectorizer = joblib.load(vectorizer_path)
    else:
        # Create new vectorizer with parameters from ML methodology
        _tfidf_vectorizer = TfidfVectorizer(
            max_features=100,         # Top 100 terms (reduces dimensionality)
            stop_words='english',     # Remove common words
            ngram_range=(1, 2),       # Unigrams and bigrams
            min_df=2,                 # Must appear in ≥2 documents
            max_df=0.8,               # Must not appear in >80% of documents
            lowercase=True,           # Convert to lowercase
            strip_accents='unicode',  # Remove accents
            token_pattern=r'\b[a-zA-Z]{2,}\b'  # Only words with 2+ letters
        )

    return _tfidf_vectorizer


def train_tfidf_vectorizer(resume_texts: List[str], save_model: bool = True) -> TfidfVectorizer:
    """
    Train TF-IDF vectorizer on resume corpus.

    Args:
        resume_texts: List of resume text strings
        save_model: Whether to save the trained vectorizer

    Returns:
        Trained TfidfVectorizer
    """
    global _tfidf_vectorizer

    vectorizer = TfidfVectorizer(
        max_features=100,
        stop_words='english',
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.8,
        lowercase=True,
        strip_accents='unicode',
        token_pattern=r'\b[a-zA-Z]{2,}\b'
    )

    # Fit vectorizer on resume corpus
    vectorizer.fit(resume_texts)

    # Save model if requested
    if save_model:
        models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'
        models_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(vectorizer, models_dir / 'tfidf_vectorizer.pkl')

    _tfidf_vectorizer = vectorizer
    return vectorizer


def vectorize_text(text: str) -> np.ndarray:
    """
    Convert text to TF-IDF vector.

    Args:
        text: Input text string

    Returns:
        TF-IDF vector as numpy array
    """
    vectorizer = _load_or_create_vectorizer()

    try:
        # Transform text to TF-IDF vector
        vector = vectorizer.transform([text])
        return vector
    except Exception as e:
        # If vectorizer is not fitted, return zero vector
        print(f"Warning: Could not vectorize text: {e}")
        return None


def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate cosine similarity between two text strings.

    Args:
        text1: First text string
        text2: Second text string

    Returns:
        Cosine similarity score (0.0 to 1.0)
    """
    try:
        vec1 = vectorize_text(text1)
        vec2 = vectorize_text(text2)

        if vec1 is None or vec2 is None:
            return 0.0

        # Calculate cosine similarity
        similarity = cosine_similarity(vec1, vec2)[0][0]
        return float(similarity)

    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0


def calculate_job_resume_similarity(
    resume_text: str,
    job_description: str,
    job_requirements: str = ""
) -> Dict[str, float]:
    """
    Calculate similarity between resume and job posting.

    Args:
        resume_text: Resume text
        job_description: Job description text
        job_requirements: Job requirements text (optional)

    Returns:
        Dictionary with similarity scores
    """
    # Combine job description and requirements
    job_text = job_description
    if job_requirements:
        job_text += " " + job_requirements

    # Calculate overall similarity
    overall_similarity = calculate_similarity(resume_text, job_text)

    # Calculate description-only similarity
    description_similarity = calculate_similarity(resume_text, job_description)

    # Calculate requirements-only similarity if provided
    requirements_similarity = 0.0
    if job_requirements:
        requirements_similarity = calculate_similarity(resume_text, job_requirements)

    return {
        'overall_similarity': overall_similarity,
        'description_similarity': description_similarity,
        'requirements_similarity': requirements_similarity,
        'tfidf_score': overall_similarity * 100  # Convert to 0-100 scale
    }


def find_similar_resumes(
    target_resume_text: str,
    resume_texts: List[str],
    resume_ids: List[int] = None,
    top_k: int = 10
) -> List[Tuple[int, float]]:
    """
    Find resumes similar to target resume using TF-IDF cosine similarity.

    Args:
        target_resume_text: Target resume text
        resume_texts: List of resume texts to compare against
        resume_ids: List of resume IDs (parallel to resume_texts)
        top_k: Number of top similar resumes to return

    Returns:
        List of tuples (resume_id, similarity_score) sorted by similarity
    """
    if resume_ids is None:
        resume_ids = list(range(len(resume_texts)))

    similarities = []
    for i, resume_text in enumerate(resume_texts):
        similarity = calculate_similarity(target_resume_text, resume_text)
        similarities.append((resume_ids[i], similarity))

    # Sort by similarity (descending) and return top K
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_k]


def get_top_terms(text: str, top_n: int = 10) -> List[Tuple[str, float]]:
    """
    Get top N terms from text by TF-IDF score.

    Args:
        text: Input text
        top_n: Number of top terms to return

    Returns:
        List of tuples (term, tfidf_score)
    """
    vectorizer = _load_or_create_vectorizer()

    try:
        # Get TF-IDF vector
        vector = vectorizer.transform([text])

        # Get feature names (terms)
        feature_names = vectorizer.get_feature_names_out()

        # Get TF-IDF scores
        tfidf_scores = vector.toarray()[0]

        # Create term-score pairs
        term_scores = [(feature_names[i], tfidf_scores[i])
                      for i in range(len(feature_names))
                      if tfidf_scores[i] > 0]

        # Sort by score (descending)
        term_scores.sort(key=lambda x: x[1], reverse=True)

        return term_scores[:top_n]

    except Exception as e:
        print(f"Error getting top terms: {e}")
        return []


def calculate_vocabulary_overlap(text1: str, text2: str) -> Dict[str, any]:
    """
    Calculate vocabulary overlap between two texts.

    Args:
        text1: First text
        text2: Second text

    Returns:
        Dictionary with overlap statistics
    """
    # Get top terms from each text
    terms1 = set([term for term, _ in get_top_terms(text1, top_n=50)])
    terms2 = set([term for term, _ in get_top_terms(text2, top_n=50)])

    # Calculate overlap
    common_terms = terms1.intersection(terms2)
    union_terms = terms1.union(terms2)

    overlap_ratio = len(common_terms) / len(union_terms) if len(union_terms) > 0 else 0

    return {
        'common_terms': list(common_terms),
        'common_count': len(common_terms),
        'text1_unique': list(terms1 - terms2),
        'text2_unique': list(terms2 - terms1),
        'overlap_ratio': overlap_ratio,
        'jaccard_similarity': overlap_ratio  # Same as overlap ratio for sets
    }


def batch_calculate_similarities(
    resume_texts: List[str],
    job_text: str
) -> List[float]:
    """
    Calculate similarities for multiple resumes against one job posting.

    Args:
        resume_texts: List of resume texts
        job_text: Job posting text

    Returns:
        List of similarity scores (parallel to resume_texts)
    """
    vectorizer = _load_or_create_vectorizer()

    try:
        # Vectorize all resumes
        resume_vectors = vectorizer.transform(resume_texts)

        # Vectorize job
        job_vector = vectorizer.transform([job_text])

        # Calculate cosine similarities
        similarities = cosine_similarity(resume_vectors, job_vector)

        # Return as list of floats
        return [float(sim[0]) for sim in similarities]

    except Exception as e:
        print(f"Error in batch similarity calculation: {e}")
        return [0.0] * len(resume_texts)
