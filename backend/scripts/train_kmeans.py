"""Train K-means clustering model from existing application data."""
import sys
import os
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

import json
import numpy as np
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Application
from ml_integration.clustering import train_kmeans_model, prepare_clustering_features

def main():
    """Train K-means model from database applications."""
    # Connect to database
    db_path = backend_dir / "ats_database.db"
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    session = Session()

    # Load all applications
    applications = session.query(Application).all()
    print(f"Found {len(applications)} applications in database")

    if len(applications) < 10:
        print("⚠️  Warning: Less than 10 applications found. K-means works best with more data.")
        print("   Using default model initialization.")
        session.close()
        return

    # Prepare data for training
    training_data = []
    feature_lengths = []
    for app in applications:
        try:
            # Parse skills_by_category JSON if it exists
            skills_by_category = None
            if app.skills_by_category:
                try:
                    skills_by_category = json.loads(app.skills_by_category)
                except:
                    pass

            candidate_data = {
                'num_skills': app.num_skills or 0,
                'experience_years': app.experience_years or 0.0,
                'education_level': app.education_level or "bachelor's",
                'has_certifications': app.has_certifications or False,
                'has_leadership': app.has_leadership or False,
                'skill_diversity': app.skill_diversity or 0.5,
                'technical_skills_count': app.technical_skills_count,
                'skills_by_category': skills_by_category
            }
            training_data.append(candidate_data)
        except Exception as e:
            print(f"⚠️  Skipping application {app.id}: {e}")
            continue

    print(f"Prepared {len(training_data)} applications for training")

    if len(training_data) < 8:
        print("⚠️  Warning: Less than 8 valid applications. Cannot train 8-cluster model.")
        print("   Using default model initialization.")
        session.close()
        return

    # Train K-means model
    print("\n🔄 Training K-means model...")
    try:
        kmeans, cluster_labels, silhouette = train_kmeans_model(
            data=training_data,
            n_clusters=8,
            save_model=True
        )

        print(f"✅ K-means model trained successfully!")
        print(f"   Silhouette Score: {silhouette:.3f}")
        print(f"   Model saved to: ml/models/kmeans_model.pkl")

        # Show cluster distribution
        unique, counts = np.unique(cluster_labels, return_counts=True)
        print("\n📊 Cluster Distribution:")
        for cluster_id, count in zip(unique, counts):
            print(f"   Cluster {cluster_id}: {count} candidates ({count/len(cluster_labels)*100:.1f}%)")

    except Exception as e:
        print(f"❌ Error training model: {e}")
        import traceback
        traceback.print_exc()

    session.close()

if __name__ == "__main__":
    main()
