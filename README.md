# ATS - Intelligent Applicant Tracking System

An ML-powered ATS that provides transparent, data-driven insights for both candidates and recruiters. Built using unsupervised learning, statistical analysis, and NLP.

**Academic Project** | Foundations of Data Science Course

---

## Features

### For Candidates
- 📊 **Multi-Factor Scoring**: Weighted algorithm (skills 40%, experience 30%, education 20%, bonuses 10%)
- 📈 **Percentile Ranking**: Know where you stand (e.g., "Top 25% of all candidates")
- 🎯 **Skill Gap Analysis**: Identify missing skills with improvement recommendations
- 🏷️ **Cluster Assignment**: See your candidate profile group

### For Recruiters
- 🔍 **Smart Clustering**: K-means clustering groups candidates by skills/experience
- 📋 **Top Candidates**: Filter by percentile bands (Top 10%, Top 25%, etc.)
- 🤝 **Job Matching**: TF-IDF + cosine similarity for resume-job matching
- 📊 **Analytics**: Score distributions, skill frequencies, statistical insights

---

## Quick Start

### Prerequisites
- Python 3.9+
- pip (Python package manager)
- 4GB RAM minimum
- 2GB free disk space

### Installation (5-10 minutes)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ATS

# 2. Set up Python environment
cd ml
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Download NLP model
python -m spacy download en_core_web_sm
```

### Generate Data

```bash
# Generate 800+ synthetic resumes
python src/generate_synthetic_data.py

# When prompted, enter: 800
```

**Optional**: Download real resume dataset from Kaggle for better results:
1. Visit: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset
2. Download CSV
3. Place in `ml/data/raw/resume_dataset.csv`
4. Notebooks will automatically combine both datasets

### Run the Analysis

```bash
# Start Jupyter Notebook
jupyter notebook

# Run notebooks in order:
# 1. 01_data_acquisition_and_exploration.ipynb
# 2. 02_data_preprocessing_and_cleaning.ipynb
# 3. 03_feature_engineering.ipynb
# 4. 04_clustering_analysis.ipynb
# 5. 05_scoring_and_ranking.ipynb
# 6. 06_statistical_validation.ipynb
```

**Important**: Run notebooks sequentially - each depends on outputs from previous ones.

### Expected Outputs

After running all notebooks, you should have:

```
ml/data/processed/
├── resumes_cleaned.csv           # Cleaned data
├── resumes_with_features.csv     # Engineered features
├── resumes_clustered.csv         # Cluster assignments
├── resumes_scored.csv            # Final scores & percentiles
└── key_insights.txt              # Statistical insights

ml/models/
├── kmeans_model.pkl              # Clustering model
├── pca_model.pkl                 # Dimensionality reduction
├── tfidf_vectorizer.pkl          # Text vectorizer
├── feature_scaler.pkl            # Feature scaler
└── [config files].json           # Model configurations
```

---

## Project Structure

```
ATS/
├── README.md                      # This file
├── docs/                          # Documentation
│   ├── 01_PROJECT_OVERVIEW.md    # High-level overview
│   ├── 02_ML_METHODOLOGY.md      # FDS concepts & techniques
│   └── TROUBLESHOOTING.md        # Common issues & fixes
├── ml/                            # Machine Learning Pipeline
│   ├── data/
│   │   ├── raw/                  # Original datasets
│   │   └── processed/            # Processed data
│   ├── notebooks/                # Jupyter notebooks (01-06)
│   │   ├── 01_data_acquisition_and_exploration.ipynb
│   │   ├── 02_data_preprocessing_and_cleaning.ipynb
│   │   ├── 03_feature_engineering.ipynb
│   │   ├── 04_clustering_analysis.ipynb
│   │   ├── 05_scoring_and_ranking.ipynb
│   │   └── 06_statistical_validation.ipynb
│   ├── models/                   # Saved ML models
│   ├── src/                      # Python scripts
│   │   ├── generate_synthetic_data.py
│   │   └── download_dataset.py
│   ├── requirements.txt          # Python dependencies
│   └── setup.sh                  # Automated setup script
├── backend/                       # (Future) FastAPI endpoints
└── frontend/                      # (Future) Next.js UI
```

---

## Tech Stack

### Data Science & ML
- **Python 3.9+**: Core language
- **pandas, NumPy**: Data manipulation
- **scikit-learn**: Machine learning (K-means, PCA, preprocessing)
- **spaCy**: NLP for skill extraction
- **matplotlib, seaborn**: Visualizations
- **SciPy**: Statistical tests

### Data
- **800+ resumes**: Synthetic + optional real data
- **150+ skills**: Across 9 categories
- **10 job categories**: Data Science, Web Dev, Mobile Dev, etc.

### Future (To Be Implemented)
- **Backend**: FastAPI (Python) for ML endpoints
- **Frontend**: Next.js + React + TailwindCSS
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

---

## Data Science Techniques Demonstrated

### ✅ Implemented & Validated

1. **Data Wrangling**
   - Missing value handling (imputation, removal)
   - Duplicate detection & removal
   - Text cleaning & normalization
   - Outlier detection (IQR method)

2. **Feature Engineering**
   - NLP-based skill extraction (150+ skills)
   - Derived features (skill diversity, technical ratio)
   - Feature encoding (label, one-hot)
   - Feature scaling (standardization)

3. **Unsupervised Learning**
   - K-means clustering (optimal K via elbow + silhouette)
   - Hierarchical clustering (Ward linkage)
   - Cluster validation (multiple metrics)
   - Cluster characterization & naming

4. **Statistical Analysis**
   - Distribution analysis (normality tests)
   - Hypothesis testing (4 tests with p-values)
   - Correlation analysis
   - Feature importance analysis

5. **Dimensionality Reduction**
   - PCA (Principal Component Analysis)
   - t-SNE (t-Distributed Stochastic Neighbor Embedding)

6. **Algorithm Design**
   - Multi-factor weighted scoring
   - Percentile ranking system
   - Job-resume matching (TF-IDF + cosine similarity)

7. **Model Validation**
   - Silhouette score
   - Davies-Bouldin index
   - Calinski-Harabasz index
   - Adjusted Rand Index (ARI)
   - Normalized Mutual Information (NMI)

---

## Key Results

- **Clustering**: Identified optimal K clusters with silhouette score ~0.4-0.6
- **Scoring**: Multi-dimensional scoring (0-100) with good distribution
- **Statistical Validation**: 4 hypothesis tests conducted (all documented)
- **Skill Extraction**: 150+ skills successfully extracted via NLP
- **Feature Engineering**: 20+ engineered features from raw data

---

## Documentation

- **[README.md](README.md)** - This file (quick start guide)
- **[docs/01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md)** - Project overview & architecture
- **[docs/02_ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md)** - In-depth FDS concepts & methodology
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues & solutions

---

## Troubleshooting

### Common Issues

**1. Module Not Found Error**
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**2. spaCy Model Missing**
```bash
python -m spacy download en_core_web_sm
```

**3. Jupyter Not Found**
```bash
pip install jupyter ipykernel
```

**4. File Not Found in Notebooks**
- Run notebooks in order (01 → 06)
- Each notebook creates outputs needed by the next

**5. JSON Serialization Error**
- Already fixed in Notebook 04 (int32 → string conversion)
- Re-download the latest version if you see this

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more solutions.

---

## Innovation & Impact

### What Makes This Different

Traditional ATS systems provide:
- ❌ Generic rejections ("not a good fit")
- ❌ No feedback for improvement
- ❌ Black-box decision making
- ❌ No transparency

Our ATS provides:
- ✅ **Percentile feedback**: "You're in the top 35% of candidates"
- ✅ **Skill gap analysis**: "You're missing: React, Docker"
- ✅ **Transparent scoring**: See exact score breakdown
- ✅ **Improvement recommendations**: Actionable next steps
- ✅ **Data-driven clustering**: Scientific candidate grouping

---

## Project Timeline

- **Week 1** ✅: Data Foundation (wrangling, preprocessing, feature engineering)
- **Week 2** ✅: ML Models (clustering, scoring, statistical validation)
- **Week 3** 🔄: Backend API (FastAPI endpoints)
- **Week 4** ⏳: Frontend (Next.js dashboards)

**Current Status**: ML pipeline complete and validated

---

## Contributing

This is an academic project for a Foundations of Data Science course.

**Team**: [Your Name]
**Course**: Foundations of Data Science
**Institution**: [Your University]

---

## License

Educational use only.

---

## Acknowledgments

- **Kaggle** for resume datasets
- **scikit-learn** for ML algorithms
- **spaCy** for NLP capabilities
- Course instructors for guidance

---

## Contact

For questions about this project:
- See documentation in `docs/` folder
- Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Ready to explore?** Run the notebooks in order and see the ML pipeline in action! 🚀
