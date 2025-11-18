"""Train TF-IDF vectorizer from existing application data."""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Application
from ml_integration.tfidf_matching import train_tfidf_vectorizer, get_top_terms

def main():
    """Train TF-IDF vectorizer from database applications."""
    # Connect to database
    db_path = backend_dir / "ats_database.db"
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    session = Session()

    # Load all applications
    applications = session.query(Application).all()
    print(f"Found {len(applications)} applications in database")

    if len(applications) < 10:
        print("⚠️  Warning: Less than 10 applications found. TF-IDF works best with more data.")
        print("   Using default vectorizer initialization.")
        session.close()
        return

    # Extract resume texts
    resume_texts = []
    for app in applications:
        if app.resume_text and len(app.resume_text.strip()) > 0:
            resume_texts.append(app.resume_text)

    print(f"Prepared {len(resume_texts)} resume texts for training")

    if len(resume_texts) < 5:
        print("⚠️  Warning: Less than 5 valid resume texts. Skipping training.")
        session.close()
        return

    # Train TF-IDF vectorizer
    print("\n🔄 Training TF-IDF vectorizer...")
    try:
        vectorizer = train_tfidf_vectorizer(
            resume_texts=resume_texts,
            save_model=True
        )

        print(f"✅ TF-IDF vectorizer trained successfully!")
        print(f"   Vocabulary size: {len(vectorizer.vocabulary_)}")
        print(f"   Features: {vectorizer.max_features}")
        print(f"   N-gram range: {vectorizer.ngram_range}")
        print(f"   Model saved to: ml/models/tfidf_vectorizer.pkl")

        # Show top terms from first resume
        if resume_texts:
            print("\n📊 Top 10 terms from first resume (example):")
            top_terms = get_top_terms(resume_texts[0], top_n=10)
            for term, score in top_terms:
                print(f"   {term}: {score:.4f}")

    except Exception as e:
        print(f"❌ Error training vectorizer: {e}")
        import traceback
        traceback.print_exc()

    session.close()

if __name__ == "__main__":
    main()
