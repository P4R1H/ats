"""Main FastAPI application for ATS backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import init_db

# Import routers
from routers import auth, jobs, applications, recommendations

# Create FastAPI app
app = FastAPI(
    title="Intelligent ATS API",
    description="Machine Learning powered Applicant Tracking System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])

# Mount static files for resume uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_db()
    print("✓ Database initialized")
    print("✓ API server ready at http://localhost:8000")
    print("✓ API docs available at http://localhost:8000/docs")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Intelligent ATS API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
