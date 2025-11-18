# Complete ATS Platform - Full Stack Implementation

An intelligent Applicant Tracking System powered by Machine Learning, featuring transparent scoring, percentile ranking, skill gap analysis, and ML-driven clustering.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Features](#features)
9. [API Documentation](#api-documentation)
10. [ML Pipeline Integration](#ml-pipeline-integration)
11. [Database Schema](#database-schema)
12. [Environment Variables](#environment-variables)
13. [Troubleshooting](#troubleshooting)

---

## Overview

This is a complete full-stack ATS (Applicant Tracking System) that integrates production-ready ML models for intelligent candidate evaluation. The system provides:

- **For Candidates**: Transparent feedback with percentile rankings, skill gap analysis, and improvement recommendations
- **For Recruiters**: Smart clustering, customizable scoring weights, and data-driven candidate insights
- **For Everyone**: Fair, objective, ML-powered evaluation with complete transparency

### Key Innovations

- ✅ **Percentile Ranking**: "Top 35% of candidates" instead of generic rejections
- ✅ **Skill Gap Analysis**: Actionable recommendations for improvement
- ✅ **Transparent Scoring**: See exact breakdown of scores
- ✅ **ML Clustering**: 8 intelligent candidate clusters
- ✅ **150+ Skill Extraction**: NLP-powered skill detection
- ✅ **Customizable Weights**: Recruiters can adjust scoring criteria

---

## Project Structure

```
ats/
├── backend/                        # FastAPI Backend
│   ├── main.py                    # FastAPI app entry point
│   ├── database.py                # SQLAlchemy database config
│   ├── models.py                  # Database models
│   ├── schemas.py                 # Pydantic validation schemas
│   ├── auth.py                    # JWT authentication
│   ├── routers/                   # API endpoints
│   │   ├── auth.py               # Authentication routes
│   │   ├── jobs.py               # Job posting routes
│   │   └── applications.py       # Application routes
│   ├── ml_integration/            # ML modules
│   │   ├── skills_database.py    # 150+ skills across 9 categories
│   │   ├── extract_skills.py     # NLP skill extraction
│   │   ├── scoring.py            # Resume scoring algorithm
│   │   ├── clustering.py         # Candidate clustering
│   │   ├── skill_gap.py          # Skill gap analysis
│   │   └── resume_parser.py      # PDF/DOCX text extraction
│   ├── uploads/resumes/           # Resume file storage
│   ├── requirements.txt           # Python dependencies
│   └── ats_database.db           # SQLite database (auto-created)
│
├── frontend/                       # Next.js 14 Frontend
│   ├── app/                       # App Router
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── candidate/            # Candidate dashboard
│   │   │   └── dashboard/page.tsx
│   │   └── recruiter/            # Recruiter dashboard
│   │       └── dashboard/page.tsx
│   ├── components/                # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── charts/               # Recharts visualizations
│   │   └── shared/               # Shared components
│   ├── lib/                       # Utilities
│   │   ├── api.ts                # API client
│   │   ├── utils.ts              # Helper functions
│   │   └── context/              # React contexts
│   ├── package.json               # Node dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── tailwind.config.ts         # Tailwind CSS config
│
└── ml/                             # Existing ML Pipeline
    ├── models/                     # Saved models & configs
    │   ├── scoring_config.json    # Scoring weights
    │   ├── ml_features.json       # Feature list
    │   └── validation_summary.json
    ├── notebooks/                  # Jupyter notebooks (1-6)
    └── data/                       # Datasets
```

---

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database (zero setup)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **PyPDF2 & python-docx** - Resume parsing
- **scikit-learn** - ML integration

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### ML (Pre-existing)
- **Python** - Core language
- **pandas, NumPy** - Data processing
- **scikit-learn** - Clustering, PCA
- **spaCy** - NLP skill extraction
- **SciPy** - Statistical analysis

---

## Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** and npm
- **pip** (Python package manager)
- **4GB RAM minimum**

### 1. Clone Repository

```bash
cd /home/user/ats
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Download spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 5. Initialize Database

The database will be automatically created when you first run the server. The schema includes:
- `users` - Candidates and recruiters
- `job_postings` - Jobs created by recruiters
- `applications` - Candidate applications with ML metrics

### 6. Start Backend Server

```bash
# From backend directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 8000
```

Server will start at: **http://localhost:8000**
API docs available at: **http://localhost:8000/docs**

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend  # From backend directory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Install Additional Dependencies (if needed)

```bash
npm install tailwindcss-animate
```

### 5. Start Development Server

```bash
npm run dev
```

Frontend will start at: **http://localhost:3000**

---

## Running the Application

### Option 1: Run Both Servers Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using Multiple Terminal Tabs

1. Open two terminal tabs
2. In Tab 1: Start backend (port 8000)
3. In Tab 2: Start frontend (port 3000)

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Features

### Landing Page
- Beautiful Vercel-inspired design
- Dark/light mode support
- Feature showcase
- Stats section
- Dual CTAs (Candidate/Recruiter)

### Authentication
- User registration (candidate or recruiter)
- Secure JWT-based login
- Role-based access control
- Password hashing with bcrypt

### For Candidates
1. **Browse Jobs**: View all active job postings
2. **Apply**: Upload resume (PDF/DOCX)
3. **View Applications**: See all your applications
4. **Application Details**:
   - Final score (0-100)
   - Score breakdown (skills, experience, education, bonuses)
   - Percentile rankings (overall + category)
   - Cluster assignment
   - Skill gap analysis
   - Matched vs missing skills
   - Personalized recommendations

### For Recruiters
1. **Create Jobs**: Post jobs with customizable scoring weights
2. **Manage Jobs**: View, edit, delete job postings
3. **View Applications**: See all applications for your jobs
4. **Application Analysis**:
   - Candidate scores and rankings
   - Skill match percentages
   - Cluster information
   - Filter and sort candidates
   - Update application status

### ML Features (Automated)
1. **Skill Extraction**: NLP extracts 150+ skills from resumes
2. **Scoring**: Multi-factor algorithm (customizable weights)
3. **Clustering**: Assigns candidates to 1 of 8 clusters
4. **Percentile Ranking**: Calculates overall and category percentiles
5. **Skill Gap Analysis**: Identifies missing skills + recommendations

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "role": "candidate"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "candidate",
    "created_at": "2024-01-15T10:30:00"
  }
}
```

#### POST `/api/auth/login`
Login and get JWT token.

#### GET `/api/auth/me`
Get current user information (requires auth).

### Job Endpoints

#### GET `/api/jobs`
Get all jobs (filtered by role).

#### POST `/api/jobs`
Create a new job posting (recruiters only).

**Request Body:**
```json
{
  "title": "Senior Data Scientist",
  "description": "We are looking for...",
  "category": "Data Science",
  "required_skills": ["Python", "Machine Learning", "SQL"],
  "preferred_skills": ["TensorFlow", "AWS"],
  "min_experience": 3,
  "education_level": "Master's",
  "weight_skills": 0.40,
  "weight_experience": 0.30,
  "weight_education": 0.20,
  "weight_certifications": 0.05,
  "weight_leadership": 0.05
}
```

#### PUT `/api/jobs/{job_id}`
Update a job posting (owner only).

#### DELETE `/api/jobs/{job_id}`
Delete a job posting (owner only).

### Application Endpoints

#### POST `/api/applications`
Submit an application with resume upload.

**Form Data:**
- `job_id`: integer
- `resume_file`: file (PDF or DOCX, max 5MB)

#### GET `/api/applications/my`
Get all applications for current candidate.

#### GET `/api/applications/{application_id}`
Get detailed application information.

#### GET `/api/applications/job/{job_id}`
Get all applications for a job (recruiter only).

#### PUT `/api/applications/{application_id}/status`
Update application status (recruiter only).

---

## ML Pipeline Integration

### How It Works

When a candidate submits an application:

1. **Resume Upload**: PDF/DOCX file uploaded
2. **Text Extraction**: PyPDF2/python-docx extracts text
3. **Skill Extraction**: NLP analyzes text and extracts 150+ skills
4. **Scoring**:
   - Skills score (based on count + diversity)
   - Experience score (non-linear scaling)
   - Education score (PhD/Master's/Bachelor's)
   - Bonus scores (certifications, leadership)
   - Final weighted score
5. **Clustering**: Assigns to 1 of 8 clusters based on profile
6. **Percentile Ranking**: Compares against all applicants
7. **Skill Gap Analysis**: Matches against job requirements
8. **Recommendations**: Generates personalized improvement tips

### Scoring Algorithm

```
Final Score =
  Skills Score × 0.40 +
  Experience Score × 0.30 +
  Education Score × 0.20 +
  Bonus Score × 0.10
```

(Weights are customizable per job)

### Clusters

8 predefined clusters:
- Entry-Level Generalists
- Junior Specialists
- Mid-Level Generalists
- Mid-Level Specialists
- Senior Professionals
- Expert Level
- Highly Skilled Early Career
- Experienced Focused

---

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email
- `password_hash`: Bcrypt hashed password
- `role`: 'candidate' or 'recruiter'
- `full_name`: User's full name
- `created_at`: Timestamp

### Job Postings Table
- `id`: Primary key
- `recruiter_id`: Foreign key to users
- `title`, `description`, `category`
- `required_skills`, `preferred_skills`: JSON arrays
- `min_experience`, `education_level`
- `weight_*`: Scoring weights (5 fields)
- `status`: 'active' or 'closed'
- `created_at`: Timestamp

### Applications Table
- `id`: Primary key
- `job_id`: Foreign key
- `candidate_id`: Foreign key
- `resume_file_path`: Path to uploaded file
- `resume_text`: Extracted text
- **ML Fields**:
  - `extracted_skills`: JSON array
  - `num_skills`, `skill_diversity`
  - `experience_years`, `education_level`
  - `has_certifications`, `has_leadership`
- **Scores**:
  - `skills_score`, `experience_score`, `education_score`
  - `bonus_score`, `final_score`
- **Rankings**:
  - `overall_percentile`, `category_percentile`
- **Clustering**:
  - `cluster_id`, `cluster_name`
- **Skill Gap**:
  - `matched_skills`, `missing_skills`: JSON arrays
  - `skill_match_percentage`
  - `recommendations`: JSON array
- `status`: 'pending', 'reviewed', 'shortlisted', 'rejected'
- `applied_at`: Timestamp

---

## Environment Variables

### Backend (`.env` - optional)

```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///./ats_database.db
MAX_UPLOAD_SIZE_MB=5
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Backend Issues

**Problem**: Module not found error
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Problem**: spaCy model not found
```bash
python -m spacy download en_core_web_sm
```

**Problem**: Database errors
```bash
# Delete database and restart (WARNING: deletes all data)
rm ats_database.db
python main.py
```

**Problem**: Port already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn main:app --port 8001
```

### Frontend Issues

**Problem**: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: TypeScript errors
```bash
# Check tsconfig.json is correct
npm run build
```

**Problem**: API connection refused
- Make sure backend is running on port 8000
- Check `.env.local` has correct API URL
- Verify CORS is configured in `backend/main.py`

### Resume Upload Issues

**Problem**: File upload fails
- Check file size < 5MB
- Ensure file is PDF or DOCX
- Verify `backend/uploads/resumes/` directory exists

**Problem**: Text extraction fails
- Try a different PDF reader (some PDFs are image-based)
- Ensure DOCX is not corrupted
- Check error message in API response

---

## Testing the Application

### 1. Register Users

1. Go to http://localhost:3000
2. Click "I'm a Candidate" → Register
3. Open incognito window → Register as Recruiter

### 2. Create a Job (as Recruiter)

1. Login as recruiter
2. Navigate to dashboard
3. Create a new job posting
4. Add required/preferred skills
5. Customize scoring weights (optional)

### 3. Apply to Job (as Candidate)

1. Login as candidate
2. Browse available jobs
3. Upload resume (PDF or DOCX)
4. Submit application
5. View application details with scores

### 4. Review Applications (as Recruiter)

1. Login as recruiter
2. View job postings
3. Click on a job to see applications
4. Review candidate scores, percentiles, skills
5. Update application status

---

## Production Deployment

### Backend (Railway/Render)

1. Update `SECRET_KEY` in environment
2. Use PostgreSQL instead of SQLite
3. Configure file storage (AWS S3)
4. Set up proper CORS origins
5. Enable HTTPS

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

---

## License

Educational use only - Academic Project for Foundations of Data Science Course.

---

## Acknowledgments

- **ML Pipeline**: Built from scratch with scikit-learn, pandas, spaCy
- **Backend**: FastAPI framework
- **Frontend**: Next.js 14 + shadcn/ui
- **Design Inspiration**: Vercel

---

## Support

For questions or issues:
1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review [02_ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md)
3. Check API docs at http://localhost:8000/docs

---

**Ready to revolutionize hiring with ML?** 🚀

Start both servers and visit http://localhost:3000 to begin!
