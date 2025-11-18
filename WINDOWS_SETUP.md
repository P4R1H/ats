# ATS Platform Setup - Windows Guide

## Quick Setup for Windows

### Option 1: Use the Windows Setup Script (Recommended)

```cmd
setup.bat
```

This will:
- Check for Python and Node.js
- Set up the backend virtual environment
- Install all dependencies
- Download the spaCy model
- Set up the frontend

### Option 2: Manual Setup

#### Backend Setup

1. **Open Command Prompt or PowerShell**

2. **Navigate to backend directory**
   ```cmd
   cd backend
   ```

3. **Create virtual environment**
   ```cmd
   python -m venv venv
   ```

4. **Activate virtual environment**
   ```cmd
   venv\Scripts\activate
   ```

5. **Install dependencies**
   ```cmd
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

6. **Download spaCy model**
   ```cmd
   python -m spacy download en_core_web_sm
   ```

#### Frontend Setup

1. **Open a new Command Prompt or PowerShell**

2. **Navigate to frontend directory**
   ```cmd
   cd frontend
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

4. **Create environment file**
   ```cmd
   copy .env.local.example .env.local
   ```

## Running the Application

### Terminal 1 - Backend

```cmd
cd backend
venv\Scripts\activate
python main.py
```

You should see:
```
✓ Database initialized
✓ API server ready at http://localhost:8000
✓ API docs available at http://localhost:8000/docs
```

### Terminal 2 - Frontend

```cmd
cd frontend
npm run dev
```

You should see:
```
> ats-frontend@1.0.0 dev
> next dev -p 3000

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

### Issue: "python: command not found"

**Solution**: Make sure Python is installed and added to PATH
- Download from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### Issue: "node: command not found"

**Solution**: Make sure Node.js is installed and added to PATH
- Download from: https://nodejs.org/
- Use the LTS version

### Issue: "Cannot activate virtual environment"

**Solution**: Use the Windows-specific activation script
```cmd
venv\Scripts\activate.bat
```

Or if using PowerShell:
```powershell
venv\Scripts\Activate.ps1
```

If PowerShell gives an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "Module not found" errors in backend

**Solution**: Make sure virtual environment is activated
```cmd
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: "Port already in use"

**Backend (port 8000)**:
```cmd
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (use the PID from above)
taskkill /PID <PID> /F
```

**Frontend (port 3000)**:
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (use the PID from above)
taskkill /PID <PID> /F
```

### Issue: npm install fails

**Solution**: Try clearing npm cache
```cmd
npm cache clean --force
npm install
```

## First Steps After Setup

1. **Visit** http://localhost:3000

2. **Register as Recruiter**
   - Click "I'm a Recruiter"
   - Fill in the form
   - Login

3. **Create a Job Posting**
   - Go to dashboard
   - Create a new job
   - Add required skills

4. **Register as Candidate** (use incognito/different browser)
   - Click "I'm a Candidate"
   - Fill in the form
   - Login

5. **Apply to Job**
   - Browse jobs
   - Upload resume (PDF or DOCX)
   - Submit application

6. **View Results**
   - Candidate: See your scores, percentiles, skill gaps
   - Recruiter: Review applications with ML insights

## Tips for Windows Development

### Using Git Bash
If you have Git for Windows installed, you can use Git Bash which supports Unix commands:
```bash
# In Git Bash
./setup.sh  # This should work in Git Bash
```

### Using WSL (Windows Subsystem for Linux)
For the best experience, consider using WSL:
```bash
# In WSL
./setup.sh  # Unix commands work natively
```

### Using PowerShell
PowerShell is recommended over Command Prompt for better features:
- Tab completion
- Better error messages
- Modern scripting

## Next Steps

Once both servers are running:
- Read `README_FULLSTACK.md` for complete documentation
- Check `IMPLEMENTATION_SUMMARY.md` for feature overview
- Visit http://localhost:8000/docs for API documentation

---

**Need help?** Check the main README_FULLSTACK.md or the troubleshooting section above.
