# Bread ATS - Intelligent Applicant Tracking System

A full-stack, ML-powered Applicant Tracking System that provides transparent, data-driven insights for both candidates and recruiters. Built with FastAPI, Next.js, and production-ready Machine Learning models.

**Academic Project** | Foundations of Data Science Course

---

## 🎯 Overview

Bread ATS revolutionizes the hiring process by combining modern web technologies with advanced machine learning to create a fair, transparent, and intelligent recruitment platform.

### What Makes This Different

Traditional ATS systems:
- ❌ Generic rejections ("not a good fit")
- ❌ No feedback for improvement
- ❌ Black-box decision making
- ❌ No transparency

**Bread ATS provides:**
- ✅ **Percentile feedback**: "You're in the top 35% of candidates"
- ✅ **Skill gap analysis**: "You're missing: React, Docker"
- ✅ **Transparent scoring**: See exact score breakdown
- ✅ **Improvement recommendations**: Actionable next steps
- ✅ **Data-driven clustering**: Scientific candidate grouping
- ✅ **150+ Skill Extraction**: NLP-powered skill detection

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** and npm
- **4GB RAM minimum**

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Download NLP model
python -m spacy download en_core_web_sm

# Start backend server
python main.py
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3. Start Using the App

1. Visit **http://localhost:3000**
2. Register as a candidate or recruiter
3. Recruiters: Create job postings
4. Candidates: Upload resume and apply
5. See ML-powered analysis in real-time!

---

## 📋 Features

### For Candidates
- 📊 **Multi-Factor Scoring**: Weighted algorithm (skills 40%, experience 30%, education 20%, bonuses 10%)
- 📈 **Percentile Ranking**: Know where you stand (e.g., "Top 25% of all candidates")
- 🎯 **Skill Gap Analysis**: Identify missing skills with improvement recommendations
- 🏷️ **Cluster Assignment**: See your candidate profile group (8 intelligent clusters)
- 💼 **Application Tracking**: View all applications with detailed analytics
- 📄 **Resume Upload**: PDF/DOCX support with automatic text extraction

### For Recruiters
- 🔍 **Smart Clustering**: K-means clustering groups candidates by skills/experience
- 📋 **Top Candidates**: Filter by percentile bands (Top 10%, Top 25%, etc.)
- 🤝 **Job Matching**: TF-IDF + cosine similarity for resume-job matching
- 📊 **Analytics Dashboard**: Score distributions, skill frequencies, statistical insights
- ⚖️ **Customizable Weights**: Adjust scoring criteria per job posting
- 🎨 **Beautiful UI**: Clean, modern interface with data visualizations

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Zero-setup database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **PyPDF2 & python-docx** - Resume parsing

### Machine Learning
- **scikit-learn** - Clustering, PCA, preprocessing
- **spaCy** - NLP for skill extraction (150+ skills)
- **pandas, NumPy** - Data manipulation
- **SciPy** - Statistical analysis

---

## 📁 Project Structure

```
ats/
├── backend/                        # FastAPI Backend
│   ├── main.py                    # App entry point
│   ├── database.py                # Database config
│   ├── models.py                  # SQLAlchemy models
│   ├── schemas.py                 # Pydantic schemas
│   ├── auth.py                    # JWT authentication
│   ├── routers/                   # API endpoints
│   │   ├── auth.py               # Auth routes
│   │   ├── jobs.py               # Job routes
│   │   ├── applications.py       # Application routes
│   │   └── recommendations.py    # Recommendation routes
│   ├── ml_integration/            # ML modules
│   │   ├── skills_database.py    # 150+ skills (9 categories)
│   │   ├── extract_skills.py     # NLP skill extraction
│   │   ├── scoring.py            # Scoring algorithm
│   │   ├── clustering.py         # Candidate clustering
│   │   ├── skill_gap.py          # Skill gap analysis
│   │   └── resume_parser.py      # PDF/DOCX parser
│   └── requirements.txt           # Python dependencies
│
├── frontend/                       # Next.js 14 Frontend
│   ├── app/                       # App Router
│   │   ├── page.tsx              # Landing page
│   │   ├── auth/                 # Login/Register
│   │   ├── candidate/            # Candidate dashboard
│   │   └── recruiter/            # Recruiter dashboard
│   ├── components/ui/             # shadcn/ui components
│   ├── lib/                       # Utilities & API client
│   └── package.json               # Node dependencies
│
├── ml/                             # ML Pipeline (Research)
│   ├── notebooks/                 # Jupyter notebooks (1-6)
│   │   ├── 01_data_acquisition_and_exploration.ipynb
│   │   ├── 02_data_preprocessing_and_cleaning.ipynb
│   │   ├── 03_feature_engineering.ipynb
│   │   ├── 04_clustering_analysis.ipynb
│   │   ├── 05_scoring_and_ranking.ipynb
│   │   └── 06_statistical_validation.ipynb
│   ├── models/                    # Saved models & configs
│   ├── data/                      # Datasets
│   └── src/                       # Python scripts
│
└── docs/                           # Documentation
    ├── 01_PROJECT_OVERVIEW.md    # Architecture overview
    ├── 02_ML_METHODOLOGY.md      # ML concepts & techniques
    └── TROUBLESHOOTING.md        # Common issues
```

---

## 🤖 ML Pipeline

### How It Works

When a candidate submits an application:

1. **Resume Upload** → PDF/DOCX file uploaded
2. **Text Extraction** → PyPDF2/python-docx extracts text
3. **Skill Extraction** → spaCy NLP analyzes and extracts 150+ skills
4. **Scoring**:
   - Skills score (count + diversity)
   - Experience score (non-linear scaling)
   - Education score (PhD/Master's/Bachelor's)
   - Bonus scores (certifications, leadership)
   - Final weighted score
5. **Clustering** → Assigns to 1 of 8 clusters
6. **Percentile Ranking** → Compares against all applicants
7. **Skill Gap Analysis** → Matches against job requirements
8. **Recommendations** → Generates personalized tips

### Scoring Algorithm

```
Final Score =
  Skills Score      × 0.40 +
  Experience Score  × 0.30 +
  Education Score   × 0.20 +
  Bonus Score       × 0.10
```

Weights are **customizable per job** by recruiters.

### 8 Intelligent Clusters

- Entry-Level Generalists
- Junior Specialists
- Mid-Level Generalists/Specialists
- Senior Professionals
- Expert Level
- Highly Skilled Early Career
- Experienced Focused

---

## 📊 Data Science Techniques

### Implemented & Validated

1. **Data Wrangling**
   - Missing value handling, duplicate removal
   - Text cleaning & normalization
   - Outlier detection (IQR method)

2. **Feature Engineering**
   - NLP-based skill extraction (150+ skills)
   - Derived features (skill diversity, technical ratio)
   - Feature encoding & scaling

3. **Unsupervised Learning**
   - K-means clustering (optimal K via elbow + silhouette)
   - Hierarchical clustering (Ward linkage)
   - Cluster validation & characterization

4. **Statistical Analysis**
   - Distribution analysis & normality tests
   - Hypothesis testing (4 tests with p-values)
   - Correlation analysis
   - Feature importance

5. **Dimensionality Reduction**
   - PCA (Principal Component Analysis)
   - t-SNE (t-Distributed Stochastic Neighbor Embedding)

6. **Text Analysis**
   - TF-IDF vectorization
   - Cosine similarity for matching
   - NLP-powered skill detection

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login & get JWT token
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Applications
- `POST /api/applications` - Submit application with resume
- `GET /api/applications/my` - Get my applications
- `GET /api/applications/{id}` - Get application details
- `GET /api/applications/job/{job_id}` - Get job applications (recruiter)
- `PUT /api/applications/{id}/status` - Update status (recruiter)

Full API documentation: **http://localhost:8000/docs**

---

## 🗄️ Database Schema

### Users
- Email, password hash, role (candidate/recruiter), full name

### Job Postings
- Title, description, category, skills, requirements
- Customizable scoring weights (5 parameters)
- Status (active/closed)

### Applications
- Resume file path & extracted text
- **ML Fields**: Extracted skills, num_skills, skill_diversity
- **Scores**: skills_score, experience_score, education_score, bonus_score, final_score
- **Rankings**: overall_percentile, category_percentile
- **Clustering**: cluster_id, cluster_name, cluster_description
- **Skill Gap**: matched_skills, missing_skills, recommendations
- Status (pending/shortlisted/rejected)

---

## 🧪 ML Research Notebooks

For research and experimentation, explore the Jupyter notebooks:

```bash
# Set up ML environment
cd ml
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Generate synthetic data
python src/generate_synthetic_data.py

# Start Jupyter
jupyter notebook

# Run notebooks in order: 01 → 06
```

**Optional**: Download real resume dataset from [Kaggle](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset) and place in `ml/data/raw/`.

---

## 🐛 Troubleshooting

### Backend Issues

**Module not found:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**spaCy model missing:**
```bash
python -m spacy download en_core_web_sm
```

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection refused:**
- Ensure backend is running on port 8000
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Resume Upload Issues

**File upload fails:**
- Check file size < 10MB
- Ensure file is PDF or DOCX format
- Verify `backend/uploads/resumes/` exists

---

## 🧑‍💻 Testing the Application

### 1. Register Users
1. Visit http://localhost:3000
2. Register as a candidate
3. Open incognito → Register as a recruiter

### 2. Create a Job (Recruiter)
1. Login as recruiter
2. Navigate to dashboard
3. Create new job posting
4. Add required/preferred skills
5. Customize scoring weights (optional)

### 3. Apply to Job (Candidate)
1. Login as candidate
2. Browse jobs
3. Upload resume (PDF/DOCX)
4. Submit application
5. View detailed ML analysis

### 4. Review Applications (Recruiter)
1. Login as recruiter
2. View job postings
3. See all applications with ML scores
4. Filter, sort, and update statuses

---

## 📈 Key Results

- **Clustering**: Optimal K=8 clusters with silhouette score ~0.3-0.6
- **Scoring**: Multi-dimensional scoring (0-100) with good distribution
- **Statistical Validation**: 4 hypothesis tests conducted
- **Skill Extraction**: 150+ skills across 9 categories
- **Feature Engineering**: 20+ features from raw data
- **Real-time Processing**: Applications scored instantly

---

## 🌐 Production Deployment

### Backend (Railway/Render)
```env
SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://...
```

### Frontend (Vercel)
1. Push to GitHub
2. Import in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

---

## 📚 Documentation

- **[01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md)** - Architecture & design
- **[02_ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md)** - FDS concepts & techniques
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues & solutions

---

## 🎓 Academic Context

**Project**: Intelligent ATS with ML
**Course**: Foundations of Data Science
**Developer**: Parth Gupta
**Focus**: Unsupervised learning, NLP, statistical analysis, full-stack integration

---

## 📝 License

Educational use only - Academic Project

---

## 🙏 Acknowledgments

- **scikit-learn** for ML algorithms
- **spaCy** for NLP capabilities
- **FastAPI** for backend framework
- **Next.js** for frontend framework
- **shadcn/ui** for beautiful components
- **Kaggle** for resume datasets

---

## 📧 Support

For questions or issues:
1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review [ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md)
3. Check API docs at http://localhost:8000/docs

---

**Ready to revolutionize hiring with ML?** 🚀

Start both servers and visit **http://localhost:3000** to begin!
