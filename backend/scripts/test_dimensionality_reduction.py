"""Test PCA and t-SNE dimensionality reduction."""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

import numpy as np
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Application
from ml_integration.clustering import prepare_clustering_features
from ml_integration.dimensionality_reduction import (
    reduce_dimensions_pca,
    reduce_dimensions_tsne,
    visualize_clusters,
    calculate_pca_components,
    optimal_perplexity
)

def test_with_database_data():
    """Test dimensionality reduction with actual application data."""
    print("🧪 Testing Dimensionality Reduction with Database Data\n")

    # Connect to database
    db_path = backend_dir / "ats_database.db"
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    session = Session()

    # Load applications
    applications = session.query(Application).limit(100).all()
    print(f"Loaded {len(applications)} applications from database")

    if len(applications) < 10:
        print("⚠️  Not enough applications for testing. Need at least 10.")
        session.close()
        return

    # Prepare feature matrix
    X = []
    cluster_labels = []
    for app in applications:
        try:
            features = prepare_clustering_features(
                num_skills=app.num_skills or 0,
                experience_years=app.experience_years or 0,
                education_level=app.education_level or "bachelor's",
                has_certifications=app.has_certifications or False,
                has_leadership=app.has_leadership or False,
                skill_diversity=app.skill_diversity or 0.5
            )
            X.append(features[0])
            cluster_labels.append(app.cluster_id or 0)
        except:
            continue

    X = np.array(X)
    cluster_labels = np.array(cluster_labels)

    print(f"Feature matrix shape: {X.shape}")
    print(f"Number of unique clusters: {len(np.unique(cluster_labels))}\n")

    # Test PCA
    print("=" * 60)
    print("🔹 Testing PCA (Principal Component Analysis)\n")

    X_pca, pca_model, explained_var = reduce_dimensions_pca(X, n_components=2)
    print(f"PCA reduced shape: {X_pca.shape}")
    print(f"Explained variance (2 components): {explained_var:.4f} ({explained_var*100:.2f}%)")
    print(f"PC1 variance: {pca_model.explained_variance_ratio_[0]:.4f}")
    print(f"PC2 variance: {pca_model.explained_variance_ratio_[1]:.4f}")

    # PCA analysis
    pca_analysis = calculate_pca_components(X, n_components=10)
    print(f"Components for 90% variance: {pca_analysis['components_for_90_percent']}")
    print(f"Components for 95% variance: {pca_analysis['components_for_95_percent']}")

    # Test t-SNE
    print("\n" + "=" * 60)
    print("🔹 Testing t-SNE (t-Distributed Stochastic Neighbor Embedding)\n")

    perplexity = optimal_perplexity(len(X))
    print(f"Optimal perplexity for {len(X)} samples: {perplexity}")

    X_tsne, tsne_model = reduce_dimensions_tsne(
        X, n_components=2, perplexity=perplexity, n_iter=500
    )
    print(f"t-SNE reduced shape: {X_tsne.shape}")
    print(f"t-SNE completed in {tsne_model.n_iter_} iterations")

    # Test cluster visualization
    print("\n" + "=" * 60)
    print("📊 Testing Cluster Visualization\n")

    # PCA visualization
    pca_viz = visualize_clusters(X, cluster_labels, method='pca')
    print(f"PCA visualization:")
    print(f"  Method: {pca_viz['method']}")
    print(f"  Coordinates shape: {len(pca_viz['coordinates'])} x 2")
    print(f"  Explained variance: {pca_viz['explained_variance']:.4f}")

    # t-SNE visualization
    tsne_viz = visualize_clusters(X, cluster_labels, method='tsne', perplexity=perplexity)
    print(f"\nt-SNE visualization:")
    print(f"  Method: {tsne_viz['method']}")
    print(f"  Coordinates shape: {len(tsne_viz['coordinates'])} x 2")
    print(f"  Perplexity: {tsne_viz['perplexity']}")

    # Show sample coordinates
    print("\nSample PCA coordinates (first 3 points):")
    for i in range(min(3, len(pca_viz['coordinates']))):
        coord = pca_viz['coordinates'][i]
        cluster = pca_viz['cluster_labels'][i]
        print(f"  Point {i+1}: [{coord[0]:.3f}, {coord[1]:.3f}], Cluster: {cluster}")

    session.close()


def test_with_synthetic_data():
    """Test with simple synthetic data."""
    print("\n" + "=" * 60)
    print("🧪 Testing with Synthetic Data\n")

    # Generate 3 clusters of data
    np.random.seed(42)

    # Cluster 1: Low values
    cluster1 = np.random.randn(30, 10) * 0.5 + np.array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

    # Cluster 2: Medium values
    cluster2 = np.random.randn(30, 10) * 0.5 + np.array([5, 5, 5, 5, 5, 5, 5, 5, 5, 5])

    # Cluster 3: High values
    cluster3 = np.random.randn(30, 10) * 0.5 + np.array([10, 10, 10, 10, 10, 10, 10, 10, 10, 10])

    X = np.vstack([cluster1, cluster2, cluster3])
    labels = np.array([0]*30 + [1]*30 + [2]*30)

    print(f"Synthetic data shape: {X.shape}")
    print(f"Number of clusters: {len(np.unique(labels))}")

    # PCA
    X_pca, _, explained_var = reduce_dimensions_pca(X)
    print(f"\nPCA explained variance: {explained_var:.4f} ({explained_var*100:.2f}%)")

    # t-SNE
    X_tsne, _ = reduce_dimensions_tsne(X, perplexity=20, n_iter=500)
    print(f"t-SNE completed successfully")

    print("\n✅ Synthetic data test completed!")


if __name__ == "__main__":
    try:
        test_with_database_data()
        test_with_synthetic_data()
        print("\n" + "=" * 60)
        print("✅ All dimensionality reduction tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
