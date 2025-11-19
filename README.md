# Bread ATS - Intelligent Applicant Tracking System

> Machine learning-powered recruitment platform providing transparent, data-driven candidate evaluation and feedback.

**Academic Project** | Foundations of Data Science | Shiv Nadar University

---

## Overview

Bread ATS transforms the hiring process by replacing generic rejection emails with actionable insights. Built with FastAPI, Next.js, and machine learning, the system provides candidates with percentile rankings, skill gap analysis, and transparent scoring while enabling recruiters to make data-driven decisions.

### The Problem

Traditional applicant tracking systems fail both candidates and recruiters:

- Candidates receive no feedback on how to improve
- Recruiters waste time on manual, inconsistent screening
- The process lacks transparency and objectivity

### The Solution

**For Candidates:**
- Multi-factor score breakdown (Skills: 40%, Experience: 30%, Education: 20%, Bonuses: 10%)
- Percentile ranking: "You're in the top 35% of candidates"
- Skill gap analysis with personalized recommendations

**For Recruiters:**
- Automatic candidate clustering using K-means (8 intelligent groups)
- Sortable tables with filtering by score, percentile, and cluster
- Advanced analytics with score distributions and insights

---

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- 4GB RAM minimum

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Download NLP model
python -m spacy download en_core_web_sm

# Start server
python main.py
```

Backend: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend: `http://localhost:3000`

### Using the Application

1. Visit `http://localhost:3000`
2. Register as a candidate or recruiter
3. Recruiters: Create job postings with custom scoring weights
4. Candidates: Upload resume (PDF) and apply to jobs
5. View real-time ML analysis with scores, percentiles, and recommendations

---

## Architecture

### System Overview

```
┌────────────────────────────────────────┐
│     Frontend (Next.js 14 + TypeScript) │
│   React Server Components, TailwindCSS │
└────────────────────────────────────────┘
                   ↓ REST API
┌────────────────────────────────────────┐
│      Backend (FastAPI + Python 3.9+)   │
│    JWT Auth, SQLite, PDF Processing    │
└────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│      ML Pipeline (scikit-learn)        │
│  K-means Clustering, TF-IDF Matching,  │
│  Scoring Engine, Skill Extraction      │
└────────────────────────────────────────┘
```

### Data Flow

**Resume Upload → ML Analysis → Insights**

1. **Upload**: Candidate submits PDF/DOCX resume
2. **Extraction**: PyPDF2 extracts text from document
3. **NLP Analysis**: spaCy identifies 127 skills across 9 categories
4. **Scoring**: Two-stage algorithm (requirements check → weighted scoring)
5. **Clustering**: K-means assigns to 1 of 8 candidate groups
6. **Ranking**: Percentile calculation vs. all applicants
7. **Skill Gap**: TF-IDF matching identifies missing skills
8. **Recommendations**: Personalized improvement suggestions

---

## Technology Stack

### Frontend
- Next.js 14 (React 18, App Router, TypeScript)
- TailwindCSS for utility-first styling
- shadcn/ui for component library
- Recharts for data visualization
- Lucide React for icons

### Backend
- FastAPI (high-performance async Python framework)
- SQLAlchemy ORM with SQLite database
- JWT authentication with bcrypt password hashing
- PyPDF2 for PDF text extraction

### Machine Learning
- scikit-learn (K-means, PCA, StandardScaler, TF-IDF)
- spaCy (NLP for skill extraction - 127 skills)
- pandas & NumPy (data processing)
- SciPy (statistical analysis and validation)

---

## Key Features

### Transparent Scoring System

**Two-Stage Algorithm:**
1. **Requirements Check** (Pass/Fail): Candidates must meet ALL hard requirements
2. **Component Scoring** (0-100): Weighted evaluation of exceeding minimums

```
Final Score = Skills × 0.40 + Experience × 0.30 + Education × 0.20 + Bonuses × 0.10
```

Recruiters can customize weights per job posting.

### Intelligent Clustering

**K-means with K=8 clusters:**
- Entry-Level Technical Specialists
- Junior Generalists
- Mid-Level Specialists
- Senior Professionals
- Expert Level
- Highly Skilled Early Career
- Experienced Focused

**Validation**: Silhouette score 0.45-0.65 (moderate to good separation)

### Skill Gap Analysis

**TF-IDF + Cosine Similarity:**
- Identifies matched vs. missing skills
- Calculates match percentage
- Generates personalized recommendations
- Separates required vs. preferred skills

### Percentile Rankings

- Overall percentile (vs. all candidates)
- Category percentile (vs. same job category)
- Component percentiles (skills, experience, education)

---

## Project Structure

```
ats/
├── backend/                          # FastAPI Backend
│   ├── main.py                      # App entry point
│   ├── models.py                    # Database schemas (User, JobPosting, Application)
│   ├── auth.py                      # JWT authentication
│   ├── routers/                     # API endpoints
│   │   ├── auth.py                 # Login/register
│   │   ├── jobs.py                 # Job CRUD
│   │   ├── applications.py         # Application submission + ML
│   │   └── recommendations.py      # Job matching
│   └── ml_integration/             # ML modules
│       ├── extract_skills.py       # NLP skill extraction
│       ├── scoring.py              # Two-stage scoring
│       ├── clustering.py           # K-means clustering
│       ├── skill_gap.py            # TF-IDF matching
│       └── skills_database.py      # 127 skills (9 categories)
│
├── frontend/                        # Next.js 14 Frontend
│   ├── app/                        # App Router pages
│   │   ├── page.tsx               # Landing page
│   │   ├── auth/                  # Login/register
│   │   ├── candidate/             # Candidate dashboard
│   │   ├── recruiter/             # Recruiter dashboard
│   │   └── methodology/           # ML methodology (2,136 lines)
│   ├── components/ui/             # shadcn/ui components
│   └── lib/api.ts                 # API client
│
├── ml/                             # ML Research
│   ├── notebooks/                 # Jupyter notebooks (6 comprehensive)
│   ├── models/                    # Model configs and artifacts
│   └── data/                      # Datasets
│
└── docs/                          # Documentation
    ├── 01_PROJECT_OVERVIEW.md    # Architecture overview
    ├── 02_ML_METHODOLOGY.md      # ML concepts (1,582 lines)
    └── TROUBLESHOOTING.md        # Common issues
```

---

## Machine Learning Methodology

### Data Preprocessing

**Feature Engineering (20+ features):**
- Skill extraction across 9 categories (programming, web, databases, cloud, etc.)
- Experience calculation from date ranges
- Education level encoding (PhD → Master's → Bachelor's → Diploma)
- Derived metrics: skill diversity, technical ratio, resume length

**Text Processing:**
- PDF/DOCX text extraction
- Pattern matching for skills (handles "Next.js" vs "NextJS")
- Date range parsing for experience calculation
- Education level detection via regex patterns

### Clustering Analysis

**K-means Implementation:**
- Optimal K=8 selected via elbow method
- StandardScaler for feature normalization
- Silhouette score validation (0.45-0.65)
- Automatic cluster naming based on characteristics

**Features Used:**
- Number of skills
- Years of experience
- Skill diversity score
- Technical skills count
- Technical ratio
- Has certifications (binary)
- Has leadership (binary)

### Scoring Algorithm

**Stage 1: Requirements Validation**
- All required skills must be present
- Minimum experience threshold
- Education level minimum
- Certifications (if required)
- Leadership experience (if required)

**Stage 2: Component Scoring**
```python
skills_score = (num_skills / 20) * 60 + skill_diversity * 40
experience_score = non_linear_scaling(years)  # 0-2: 0-60, 2-5: 60-80, 5+: 80-100
education_score = {PhD: 100, Masters: 85, Bachelors: 70, Diploma: 50}
bonus_score = (certifications * 50 + leadership * 50) / 1

final_score = skills * 0.40 + experience * 0.30 + education * 0.20 + bonus * 0.10
```

### Statistical Validation

**Hypothesis Tests Conducted:**
1. Master's/PhD candidates score higher than Bachelor's (t-test, p < 0.05)
2. Certified candidates score higher (t-test, p < 0.05)
3. Clusters show distinct score distributions (ANOVA, p < 0.001)
4. Skill diversity correlates with scores (Pearson r=0.68, p < 0.001)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login with JWT token
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all active jobs
- `POST /api/jobs` - Create job posting (recruiter only)
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job posting
- `DELETE /api/jobs/{id}` - Delete job posting

### Applications
- `POST /api/applications` - Submit application with resume
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/{id}` - Get application details with ML analysis
- `GET /api/applications/job/{job_id}` - List job applications (recruiter)
- `PUT /api/applications/{id}/status` - Update application status

### Recommendations
- `POST /api/recommendations/analyze-resume` - Analyze resume and extract skills
- `POST /api/recommendations/jobs` - Get recommended jobs for candidate

Full API documentation available at `http://localhost:8000/docs`

---

## Database Schema

### Users Table
- Email, password hash, role (candidate/recruiter)
- Full name, company name (recruiters), company logo

### Job Postings Table
- Title, description, category, status
- Required skills, preferred skills (JSON arrays)
- Minimum experience, education level
- Requirements (JSON: min_education, certifications_required, leadership_required)
- Custom scoring weights (5 configurable weights)

### Applications Table
- Resume file path, extracted text
- **ML Fields**: extracted_skills, num_skills, skill_diversity, experience_years, education_level
- **Scores**: skills_score, experience_score, education_score, bonus_score, final_score
- **Rankings**: overall_percentile, category_percentile, skills_percentile, experience_percentile
- **Clustering**: cluster_id, cluster_name, cluster_description
- **Skill Gap**: matched_skills, missing_skills, recommendations, match_percentage
- **Two-Stage**: meets_requirements, missing_requirements, rejection_reason

---

## Testing

### Manual Testing

**Candidate Flow:**
1. Register account
2. Browse available jobs
3. Upload resume and apply
4. View detailed ML analysis (scores, percentile, cluster)
5. Review skill gap recommendations

**Recruiter Flow:**
1. Register account with company details
2. Create job posting with custom weights
3. Review applications sorted by score
4. Filter by percentile bands (Top 10%, Top 25%, etc.)
5. Analyze candidate clusters and distributions

### Statistical Validation

Comprehensive hypothesis testing in Jupyter notebooks:
- 4 statistical tests with p-values
- Correlation analysis
- Distribution analysis
- Cluster validation metrics

---

## ML Research Notebooks

For detailed experimentation and analysis:

```bash
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

**Notebooks:**
1. Data Acquisition & Exploration
2. Data Preprocessing & Cleaning
3. Feature Engineering
4. Clustering Analysis
5. Scoring & Ranking
6. Statistical Validation

---

## Deployment

### Backend (Railway / Render)

```env
SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://...
```

### Frontend (Vercel)

1. Push repository to GitHub
2. Import in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. Deploy

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Resume Processing | <500ms per PDF |
| Skill Extraction | 127 skills in <200ms |
| Clustering Assignment | <50ms |
| Score Calculation | <100ms |
| Silhouette Score | 0.45-0.65 |
| Skill Extraction F1 | 0.915 |

---

## Documentation

### Comprehensive Guides

- **[PROJECT_SUBMISSION_REPORT.md](PROJECT_SUBMISSION_REPORT.md)** - Complete project submission report with methodology, architecture, and future improvements
- **[docs/01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md)** - System architecture and design decisions
- **[docs/02_ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md)** - In-depth ML techniques (1,582 lines)
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Live Documentation

Visit `http://localhost:3000/methodology` for interactive ML methodology page (2,136 lines)

---

## Troubleshooting

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

**Port 8000 in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Dependencies not installed:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection refused:**
- Ensure backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

---

## Academic Context

**Course**: Foundations of Data Science
**Institution**: Shiv Nadar University
**Developer**: Parth Gupta
**Focus**: Unsupervised learning, NLP, statistical analysis, full-stack ML integration

### Data Science Concepts Demonstrated

- Data wrangling and preprocessing
- Feature engineering from unstructured text
- Unsupervised learning (K-means clustering)
- Statistical hypothesis testing (4 tests)
- NLP for information extraction
- Algorithm design (multi-stage scoring)
- Model validation (silhouette, ANOVA, correlation)
- Dimensionality reduction (PCA, t-SNE)
- Production ML deployment

---

## Future Enhancements

### Short-Term
- Enhanced NLP with BERT for skill extraction
- PostgreSQL migration for scalability
- Redis caching for 5x faster response times

### Medium-Term
- Automated bias detection and fairness metrics
- Explainable AI with SHAP values
- Active learning for skill database expansion

### Long-Term
- Microservices architecture for horizontal scaling
- Real-time feedback loop with hire/no-hire outcomes
- Multi-language support for international hiring

---

## License

Educational use only - Academic Project

---

## Acknowledgments

- scikit-learn for ML algorithms
- spaCy for NLP capabilities
- FastAPI for backend framework
- Next.js for frontend framework
- shadcn/ui for component library

---

**Ready to transform hiring with data science?**

Start both servers and visit `http://localhost:3000`
