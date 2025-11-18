"""Test TF-IDF vectorization and similarity matching."""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from ml_integration.tfidf_matching import (
    calculate_similarity,
    calculate_job_resume_similarity,
    get_top_terms,
    calculate_vocabulary_overlap
)

def test_similarity():
    """Test TF-IDF similarity calculation."""
    print("🧪 Testing TF-IDF Similarity Calculation\n")

    # Test case 1: Similar texts
    print("Test 1: Similar job and resume (Python developer)")
    resume1 = """
    Senior Python Developer with 5 years of experience.
    Expert in Django, Flask, FastAPI frameworks.
    Strong skills in SQL, PostgreSQL, MongoDB databases.
    Experience with AWS cloud deployment and Docker containers.
    """

    job1 = """
    Looking for Python Developer with experience in web frameworks.
    Must know Django or Flask. PostgreSQL database experience required.
    AWS and Docker knowledge is a plus.
    """

    similarity1 = calculate_similarity(resume1, job1)
    print(f"  Similarity: {similarity1:.4f} ({similarity1*100:.2f}%)")

    job_sim1 = calculate_job_resume_similarity(resume1, job1)
    print(f"  TF-IDF Score: {job_sim1['tfidf_score']:.2f}/100\n")

    # Test case 2: Different domains
    print("Test 2: Different domains (Python dev vs Designer)")
    resume2 = """
    Graphic Designer with expertise in Adobe Photoshop, Illustrator, and Figma.
    5 years of UI/UX design experience. Created designs for mobile apps and websites.
    Strong understanding of color theory and typography.
    """

    job2 = """
    Python Developer needed for backend development.
    Must have experience with REST APIs and databases.
    """

    similarity2 = calculate_similarity(resume2, job2)
    print(f"  Similarity: {similarity2:.4f} ({similarity2*100:.2f}%)")

    job_sim2 = calculate_job_resume_similarity(resume2, job2)
    print(f"  TF-IDF Score: {job_sim2['tfidf_score']:.2f}/100\n")

    # Test case 3: Partial match
    print("Test 3: Partial match (Junior dev vs Senior position)")
    resume3 = """
    Junior Python Developer with 1 year of experience.
    Familiar with Flask framework and MySQL database.
    Eager to learn AWS and Docker.
    """

    job3 = """
    Senior Python Developer position. 5+ years experience required.
    Expert-level Django, Flask, FastAPI knowledge needed.
    Must have production AWS and Kubernetes experience.
    """

    similarity3 = calculate_similarity(resume3, job3)
    print(f"  Similarity: {similarity3:.4f} ({similarity3*100:.2f}%)")

    job_sim3 = calculate_job_resume_similarity(resume3, job3)
    print(f"  TF-IDF Score: {job_sim3['tfidf_score']:.2f}/100\n")


def test_top_terms():
    """Test extraction of top terms."""
    print("=" * 60)
    print("📊 Testing Top Terms Extraction\n")

    resume = """
    Full Stack Developer with expertise in React, Node.js, and MongoDB.
    Built multiple web applications using modern JavaScript frameworks.
    Experience with RESTful APIs, GraphQL, and microservices architecture.
    Proficient in Git, Docker, and CI/CD pipelines.
    """

    print("Top 10 terms from Full Stack Developer resume:")
    top_terms = get_top_terms(resume, top_n=10)
    for i, (term, score) in enumerate(top_terms, 1):
        print(f"  {i}. {term}: {score:.4f}")


def test_vocabulary_overlap():
    """Test vocabulary overlap calculation."""
    print("\n" + "=" * 60)
    print("📝 Testing Vocabulary Overlap\n")

    text1 = """
    Python developer with Django and Flask experience.
    Strong SQL and PostgreSQL database skills.
    """

    text2 = """
    Looking for Python engineer with web framework knowledge.
    PostgreSQL and database design experience required.
    """

    overlap = calculate_vocabulary_overlap(text1, text2)
    print(f"Common terms ({len(overlap['common_terms'])}): {overlap['common_terms'][:5]}")
    print(f"Text1 unique: {overlap['text1_unique'][:3]}")
    print(f"Text2 unique: {overlap['text2_unique'][:3]}")
    print(f"Overlap ratio: {overlap['overlap_ratio']:.4f}")


if __name__ == "__main__":
    try:
        test_similarity()
        test_top_terms()
        test_vocabulary_overlap()
        print("\n✅ All TF-IDF tests completed successfully!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
