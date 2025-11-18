"""Test K-means clustering integration."""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from ml_integration.clustering import assign_cluster, get_all_clusters

def test_ml_clustering():
    """Test ML-based clustering."""
    print("🧪 Testing ML-based K-means clustering\n")

    # Test case 1: Entry-level candidate
    print("Test 1: Entry-level candidate (1 year, 8 skills)")
    result = assign_cluster(
        experience_years=1.0,
        num_skills=8,
        skill_diversity=0.5,
        education_level="bachelor's",
        has_certifications=False,
        has_leadership=False,
        use_ml=True
    )
    print(f"  Cluster ID: {result['cluster_id']}")
    print(f"  Cluster Name: {result['cluster_name']}")
    print(f"  Description: {result['cluster_description']}\n")

    # Test case 2: Mid-level specialist
    print("Test 2: Mid-level specialist (5 years, 20 skills)")
    result = assign_cluster(
        experience_years=5.0,
        num_skills=20,
        skill_diversity=0.7,
        education_level="master's",
        has_certifications=True,
        has_leadership=False,
        use_ml=True
    )
    print(f"  Cluster ID: {result['cluster_id']}")
    print(f"  Cluster Name: {result['cluster_name']}")
    print(f"  Description: {result['cluster_description']}\n")

    # Test case 3: Senior expert
    print("Test 3: Senior expert (12 years, 30 skills)")
    result = assign_cluster(
        experience_years=12.0,
        num_skills=30,
        skill_diversity=0.8,
        education_level="phd",
        has_certifications=True,
        has_leadership=True,
        use_ml=True
    )
    print(f"  Cluster ID: {result['cluster_id']}")
    print(f"  Cluster Name: {result['cluster_name']}")
    print(f"  Description: {result['cluster_description']}\n")

    # Test case 4: Fallback to rule-based
    print("Test 4: Rule-based clustering (use_ml=False)")
    result = assign_cluster(
        experience_years=3.0,
        num_skills=12,
        skill_diversity=0.6,
        use_ml=False
    )
    print(f"  Cluster ID: {result['cluster_id']}")
    print(f"  Cluster Name: {result['cluster_name']}")
    print(f"  Description: {result['cluster_description']}\n")

def test_cluster_info():
    """Test cluster information retrieval."""
    print("📊 All available clusters:\n")
    clusters = get_all_clusters()
    for cluster in clusters:
        print(f"  Cluster {cluster['id']}: {cluster['name']}")

if __name__ == "__main__":
    try:
        test_ml_clustering()
        print("=" * 60)
        test_cluster_info()
        print("\n✅ All clustering tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
