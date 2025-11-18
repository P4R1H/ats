# Quick Start Guide - ATS Platform

Get the full-stack ATS platform running in under 5 minutes!

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

## Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./setup.sh
```

Then start the servers:

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

## Option 2: Manual Setup

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Steps

1. Visit http://localhost:3000
2. Click "Get Started"
3. Register as a Candidate or Recruiter
4. Explore the features!

### As a Candidate

- Browse available jobs
- Upload your resume (PDF or DOCX)
- View your scores and percentile rankings
- See skill gap analysis
- Get personalized recommendations

### As a Recruiter

- Create job postings
- Customize scoring weights
- View all applications
- See ML-powered insights
- Filter and sort candidates

## Test Data

The system starts with an empty database. You'll need to:

1. Register users (both candidates and recruiters)
2. Create job postings (as recruiter)
3. Submit applications (as candidate with resume)
4. View results!

## Troubleshooting

### Backend won't start

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Frontend won't start

```bash
# Reinstall node modules
rm -rf node_modules package-lock.json
npm install

# Check .env.local exists
cp .env.local.example .env.local
```

### Can't upload resumes

- Ensure `backend/uploads/resumes/` directory exists
- Check file size < 5MB
- Only PDF and DOCX supported

## What's Working

✅ **Backend (FastAPI)**:
- User authentication (JWT)
- Job posting CRUD
- Resume upload & processing
- ML skill extraction (150+ skills)
- Scoring algorithm
- Clustering (8 clusters)
- Percentile ranking
- Skill gap analysis

✅ **Frontend (Next.js)**:
- Landing page
- Auth (login/register)
- Candidate dashboard
- Recruiter dashboard
- Beautiful Vercel-inspired design
- Dark/light mode support

## Next Steps

For full documentation, see:
- [README_FULLSTACK.md](README_FULLSTACK.md) - Complete guide
- [docs/02_ML_METHODOLOGY.md](docs/02_ML_METHODOLOGY.md) - ML details
- API Docs: http://localhost:8000/docs

## Support

- Check the logs in your terminal for errors
- Review the API docs at http://localhost:8000/docs
- See README_FULLSTACK.md for detailed troubleshooting

**Happy hiring! 🚀**
