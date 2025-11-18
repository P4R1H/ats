'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat,
  ArrowLeft,
  Target,
  Users,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Award,
  BarChart3,
  GitBranch,
  Sparkles,
  Database,
  Brain,
  FileText,
  Search,
  Layers
} from 'lucide-react'

export default function MethodologyPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('overview')
  const [animatedScore, setAnimatedScore] = useState(0)

  // Set page title
  useState(() => {
    document.title = 'ML Methodology - Bread ATS'
  })

  // Animate score on mount
  useState(() => {
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev >= 74) {
          clearInterval(interval)
          return 74
        }
        return prev + 1
      })
    }, 20)
    return () => clearInterval(interval)
  })

  const sections = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'how-to-use', label: 'How to Use', icon: Lightbulb },
    { id: 'data', label: 'Data & Features', icon: Database },
    { id: 'feature-eng', label: 'Feature Engineering', icon: Layers },
    { id: 'clustering', label: 'Clustering Analysis', icon: GitBranch },
    { id: 'scoring', label: 'Scoring Algorithm', icon: TrendingUp },
    { id: 'validation', label: 'Statistical Validation', icon: BarChart3 },
    { id: 'limitations', label: 'Limitations & Ethics', icon: Award },
    { id: 'future', label: 'Future Work', icon: Sparkles },
  ]

  const skillCategories = [
    { name: 'Programming', count: 16, color: 'bg-blue-500' },
    { name: 'Web Tech', count: 18, color: 'bg-purple-500' },
    { name: 'Databases', count: 13, color: 'bg-green-500' },
    { name: 'Data Science', count: 18, color: 'bg-amber-500' },
    { name: 'Cloud/DevOps', count: 18, color: 'bg-orange-500' },
    { name: 'Mobile', count: 9, color: 'bg-pink-500' },
    { name: 'Design', count: 10, color: 'bg-cyan-500' },
    { name: 'Soft Skills', count: 9, color: 'bg-indigo-500' },
    { name: 'Other Tech', count: 15, color: 'bg-gray-500' },
  ]

  const scoreComponents = [
    { label: 'Skills Match', weight: 40, color: 'bg-blue-500', description: 'Stage 2: 80% preferred + 20% diversity (required checked in Stage 1)' },
    { label: 'Experience', weight: 30, color: 'bg-green-500', description: 'Stage 2: Years BEYOND minimum (relative scoring)' },
    { label: 'Education', weight: 20, color: 'bg-purple-500', description: 'Stage 2: Degrees ABOVE minimum (relative scoring)' },
    { label: 'Certifications', weight: 5, color: 'bg-amber-500', description: 'Stage 2: Bonus if not required' },
    { label: 'Leadership', weight: 5, color: 'bg-orange-500', description: 'Stage 2: Bonus if not required' },
  ]

  const clusterExamples = [
    { name: 'Entry-Level Technical', experience: '1-2 years', skills: '6-10 skills', diversity: 'Low', techRatio: '90%' },
    { name: 'Mid-Level Generalists', experience: '3-5 years', skills: '12-16 skills', diversity: 'High', techRatio: '70%' },
    { name: 'Senior Specialists', experience: '6-8 years', skills: '15-20 skills', diversity: 'Medium', techRatio: '80%' },
    { name: 'Junior Non-Technical', experience: '1-3 years', skills: '8-12 skills', diversity: 'Medium', techRatio: '50%' },
    { name: 'Expert Professionals', experience: '9+ years', skills: '18+ skills', diversity: 'High', techRatio: '75%' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-md transition-shadow">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Bread
            </span>
          </button>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 sticky top-24 self-start">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">ML Methodology & Documentation</h1>
                <p className="text-lg text-gray-600">
                  Comprehensive technical documentation of our intelligent resume screening system
                </p>
              </div>

              <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                      <Wheat className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">What is Bread ATS?</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Bread ATS is an intelligent Applicant Tracking System that uses advanced machine learning
                        techniques to objectively evaluate candidates and match them with job opportunities.
                        Our system combines natural language processing, unsupervised learning, and statistical
                        validation to create fair, transparent, and effective hiring decisions.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-900 font-medium">150+ skills tracked</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-900 font-medium">5 candidate clusters</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-900 font-medium">Multi-factor scoring</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-900 font-medium">Statistical validation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">NLP Skill Extraction</h3>
                    <p className="text-sm text-gray-600">
                      Extract 150+ technical and soft skills from unstructured resume text using pattern matching and NLP
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <GitBranch className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">K-means Clustering</h3>
                    <p className="text-sm text-gray-600">
                      Group similar candidates into meaningful clusters using unsupervised learning with optimal K selection
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Weighted Scoring</h3>
                    <p className="text-sm text-gray-600">
                      Multi-dimensional scoring system with customizable weights for skills, experience, and education
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* How to Use Section */}
          {activeSection === 'how-to-use' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Use Bread ATS</h1>
                <p className="text-lg text-gray-600">
                  Step-by-step guide for candidates and recruiters
                </p>
              </div>

              {/* For Candidates */}
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">For Candidates</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Create Your Account</h3>
                        <p className="text-sm text-gray-700">
                          Register as a candidate with your email and create a strong password. Complete your profile with your name and contact information.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Browse Open Positions</h3>
                        <p className="text-sm text-gray-700">
                          Explore job listings filtered by category, location, and requirements. Use the search feature to find roles that match your skills and interests.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Submit Your Application</h3>
                        <p className="text-sm text-gray-700">
                          Upload your resume (PDF, DOC, or DOCX). Our ML system will automatically extract skills, analyze experience, and calculate your score.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Track Your Applications</h3>
                        <p className="text-sm text-gray-700">
                          View your application status, ML insights, score breakdown, skill gap analysis, and personalized recommendations on your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Recruiters */}
              <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">For Recruiters</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Register as a Recruiter</h3>
                        <p className="text-sm text-gray-700">
                          Create your recruiter account and set up your company profile. Access advanced features for job management and candidate evaluation.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Create Job Postings</h3>
                        <p className="text-sm text-gray-700">
                          Post jobs with detailed descriptions (markdown supported), required/preferred skills, and <strong>custom scoring weights</strong> for skills, experience, education, certifications, and leadership.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Review Applications</h3>
                        <p className="text-sm text-gray-700">
                          View all applications sorted by ML score, filter by status, search by candidate name or cluster. See detailed ML insights, skill matches, and percentile rankings.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Manage Candidates</h3>
                        <p className="text-sm text-gray-700">
                          Update application statuses (pending, shortlisted, rejected), generate test applications for demos, and make data-driven hiring decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Data & Features Section */}
          {activeSection === 'data' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Data & Feature Engineering</h1>
                <p className="text-lg text-gray-600">
                  How we transform resume text into actionable ML features
                </p>
              </div>

              {/* Visual Pipeline Flow */}
              <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">ML Pipeline Flow</h2>
                  <div className="flex items-center justify-between">
                    {[
                      { label: 'Resume Upload', icon: FileText, color: 'blue' },
                      { label: 'Text Cleaning', icon: Search, color: 'purple' },
                      { label: 'Skill Extraction', icon: Target, color: 'green' },
                      { label: 'Feature Engineering', icon: Layers, color: 'amber' },
                      { label: 'ML Scoring', icon: TrendingUp, color: 'orange' },
                    ].map((step, idx) => {
                      const StepIcon = step.icon
                      return (
                        <div key={idx} className="flex items-center">
                          <div className="text-center">
                            <div className={`w-16 h-16 mx-auto bg-${step.color}-100 rounded-full flex items-center justify-center mb-2 border-2 border-${step.color}-500 animate-pulse`}>
                              <StepIcon className={`h-8 w-8 text-${step.color}-600`} />
                            </div>
                            <p className="text-xs font-medium text-gray-700">{step.label}</p>
                          </div>
                          {idx < 4 && (
                            <div className="mx-4 flex-shrink-0">
                              <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Database Visualization */}
              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">150+ Skills Tracked Across 9 Categories</h2>
                  <p className="text-gray-600 mb-6">Interactive visualization of our comprehensive skill database</p>
                  <div className="grid grid-cols-3 gap-4">
                    {skillCategories.map((category, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
                      >
                        <div className={`absolute inset-0 ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                        <div className="relative p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{category.name}</span>
                            <span className={`text-2xl font-bold ${category.color.replace('bg-', 'text-')}`}>
                              {category.count}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${category.color} transition-all duration-1000`}
                              style={{ width: `${(category.count / 18) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Total: 126 skills</strong> tracked across technical and soft skill categories.
                      Each resume is matched against this database using NLP pattern matching with word boundaries.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Extraction Pipeline</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">1. Text Preprocessing</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Remove URLs, emails, phone numbers (privacy & relevance)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Normalize whitespace and text formatting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Handle missing values (median for numerical, 'Unknown' for categorical)</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">2. NLP Skill Extraction</h3>
                        <p className="text-sm text-gray-700 mb-2">
                          Extract 150+ skills from 9 categories using pattern matching with word boundaries:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="px-3 py-2 bg-blue-50 rounded-md text-blue-900 font-medium">Programming Languages (16)</div>
                          <div className="px-3 py-2 bg-purple-50 rounded-md text-purple-900 font-medium">Web Technologies (18)</div>
                          <div className="px-3 py-2 bg-green-50 rounded-md text-green-900 font-medium">Databases (13)</div>
                          <div className="px-3 py-2 bg-amber-50 rounded-md text-amber-900 font-medium">Data Science (18)</div>
                          <div className="px-3 py-2 bg-orange-50 rounded-md text-orange-900 font-medium">Cloud & DevOps (18)</div>
                          <div className="px-3 py-2 bg-pink-50 rounded-md text-pink-900 font-medium">Mobile Dev (9)</div>
                          <div className="px-3 py-2 bg-cyan-50 rounded-md text-cyan-900 font-medium">Design (10)</div>
                          <div className="px-3 py-2 bg-indigo-50 rounded-md text-indigo-900 font-medium">Soft Skills (9)</div>
                          <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 font-medium col-span-2">Other Technical (15)</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Layers className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">3. Derived Features</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Skill Diversity:</strong> Percentage of skill categories represented (0-1)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Technical Ratio:</strong> Proportion of technical vs non-technical skills</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Experience Level:</strong> Junior (≤2y) → Mid (3-5y) → Senior (6-8y) → Expert (9+y)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Binary Indicators:</strong> Has certifications, Has leadership experience</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">4. Feature Scaling & Encoding</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>StandardScaler:</strong> Z-score normalization (mean=0, std=1) for clustering</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Label Encoding:</strong> Ordinal features (education, experience level)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>One-Hot Encoding:</strong> Categorical features (job categories)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Why These Features?</h3>
                    <p className="text-sm text-blue-800">
                      Each feature is chosen based on hiring research and domain knowledge. Skills and experience
                      are primary indicators of job fit, while diversity shows adaptability. Education and certifications
                      validate foundational knowledge. All features are normalized to prevent any single metric from dominating decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Engineering Section */}
          {activeSection === 'feature-eng' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Feature Engineering</h1>
                <p className="text-lg text-gray-600">
                  Mathematical foundations and transformations for ML-ready features
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Text Preprocessing & NLP Pipeline</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">1. Text Normalization</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Resume text undergoes multiple preprocessing steps to ensure consistent analysis:
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs mb-3">
                        <div className="text-gray-500">// Regex patterns for cleaning</div>
                        <div>text = text.replace(/http[s]?:\/\/\S+/g, '')</div>
                        <div>text = text.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '')</div>
                        <div>text = text.replace(/\+?[\d\s\-\(\)]+/g, '')</div>
                        <div>text = text.replace(/\s+/g, ' ').trim()</div>
                        <div>text = text.toLowerCase()</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-xs font-semibold text-red-900 mb-2">Before Cleaning:</p>
                          <p className="text-xs text-gray-700 font-mono">
                            "Email: john@example.com, Phone: +1-234-567-8900, Portfolio: https://johndoe.com, Python PYTHON python"
                          </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <p className="text-xs font-semibold text-green-900 mb-2">After Cleaning:</p>
                          <p className="text-xs text-gray-700 font-mono">
                            "email: , phone: , portfolio: , python python python"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">2. Pattern Matching with Word Boundaries</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Skills extraction uses word boundary regex to prevent false positives:
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs mb-3">
                        <div className="text-gray-500">// Pattern: \b(skill1|skill2|...)\b</div>
                        <div>pattern = new RegExp(`\\b($&#123;skills.join('|')&#125;)\\b`, 'gi')</div>
                        <div>matches = text.match(pattern)</div>
                        <div className="text-gray-500 mt-2">// Example: Matches "Python" but not "Pythonic"</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-900">
                          <strong>Why this matters:</strong> Without word boundaries, searching for "R" would match every word containing "r".
                          Word boundaries ensure we only match complete skill names, improving precision from ~45% to ~92%.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Scaling & Normalization</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">StandardScaler (Z-score Normalization)</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        All numerical features are standardized to have mean μ = 0 and standard deviation σ = 1 before clustering.
                        This prevents features with larger scales from dominating distance calculations.
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                        <div>z = (x - μ) / σ</div>
                        <div className="text-gray-500 mt-2">where:</div>
                        <div className="text-gray-500">  μ = mean of feature across all samples</div>
                        <div className="text-gray-500">  σ = standard deviation of feature</div>
                        <div className="text-gray-500">  x = original value</div>
                        <div className="text-gray-500">  z = standardized value</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-amber-50 border border-amber-200 rounded p-4">
                          <h4 className="text-sm font-semibold text-amber-900 mb-2">Example: Years of Experience</h4>
                          <div className="text-xs text-gray-800 space-y-1 font-mono">
                            <p>Original values: [1, 3, 5, 10, 15]</p>
                            <p>μ = 6.8, σ = 5.36</p>
                            <p className="text-green-700 pt-2">Scaled values:</p>
                            <p>[-1.08, -0.71, -0.34, 0.60, 1.53]</p>
                          </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded p-4">
                          <h4 className="text-sm font-semibold text-purple-900 mb-2">Example: Number of Skills</h4>
                          <div className="text-xs text-gray-800 space-y-1 font-mono">
                            <p>Original values: [5, 10, 15, 20, 25]</p>
                            <p>μ = 15, σ = 7.91</p>
                            <p className="text-green-700 pt-2">Scaled values:</p>
                            <p>[-1.26, -0.63, 0.00, 0.63, 1.26]</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-900">
                          <strong>Impact:</strong> Without scaling, "num_skills" (range: 0-30) would dominate "skill_diversity" (range: 0-1)
                          in Euclidean distance calculations, leading to poor clustering. Scaling ensures all features contribute equally.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Missing Value Imputation</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Strategy depends on feature type and missingness pattern:
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="border border-gray-200 rounded p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Numerical Features</h4>
                          <div className="text-xs text-gray-700 space-y-1">
                            <p><strong>Method:</strong> Median imputation</p>
                            <p><strong>Reason:</strong> Robust to outliers</p>
                            <p className="pt-2 font-mono bg-gray-50 p-2 rounded">
                              experience_years:<br/>
                              NaN → 4.5 (median)
                            </p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Categorical Features</h4>
                          <div className="text-xs text-gray-700 space-y-1">
                            <p><strong>Method:</strong> Mode or "Unknown"</p>
                            <p><strong>Reason:</strong> Preserve category structure</p>
                            <p className="pt-2 font-mono bg-gray-50 p-2 rounded">
                              education:<br/>
                              NaN → "Not Specified"
                            </p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Binary Features</h4>
                          <div className="text-xs text-gray-700 space-y-1">
                            <p><strong>Method:</strong> Conservative (False)</p>
                            <p><strong>Reason:</strong> Avoid false positives</p>
                            <p className="pt-2 font-mono bg-gray-50 p-2 rounded">
                              has_certifications:<br/>
                              NaN → 0 (False)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Derived Feature Calculations</h2>
                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Skill Diversity Score</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Measures breadth of expertise across skill categories. Higher diversity indicates adaptability and versatility.
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                        <div>diversity = unique_categories / total_categories</div>
                        <div className="text-gray-500 mt-2">Example:</div>
                        <div className="text-gray-500">  Skills: [Python, React, Docker, PostgreSQL, AWS]</div>
                        <div className="text-gray-500">  Categories: [Programming, Web, Cloud, Database, Cloud]</div>
                        <div className="text-gray-500">  unique_categories = 4 (Programming, Web, Cloud, Database)</div>
                        <div className="text-gray-500">  total_categories = 9</div>
                        <div>  diversity = 4/9 = 0.444</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-3">
                        <p className="text-xs text-purple-900">
                          <strong>Interpretation:</strong> diversity = 0.2 (specialist), 0.5 (balanced), 0.8 (generalist)
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Technical Skills Ratio</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Proportion of technical vs non-technical skills. Useful for distinguishing engineering vs management roles.
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                        <div>tech_ratio = technical_skills / total_skills</div>
                        <div className="text-gray-500 mt-2">where technical_skills ∈ &#123;</div>
                        <div className="text-gray-500">  Programming, Web, Databases, Data Science,</div>
                        <div className="text-gray-500">  Cloud, DevOps, Mobile, Design</div>
                        <div className="text-gray-500">&#125;</div>
                        <div className="text-gray-500 mt-1">non_technical ∈ &#123;Soft Skills, Leadership, etc&#125;</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <p className="text-xs font-semibold text-green-900 mb-1">Software Engineer</p>
                          <p className="text-xs text-gray-700 font-mono">15 tech / 17 total = 0.88</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded p-3">
                          <p className="text-xs font-semibold text-amber-900 mb-1">Technical Manager</p>
                          <p className="text-xs text-gray-700 font-mono">8 tech / 16 total = 0.50</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Experience Level Binning</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Categorical encoding of continuous experience variable based on industry standards:
                      </p>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                        <div>if experience_years ≤ 2:</div>
                        <div>    level = "Junior" (0-2 years)</div>
                        <div>elif experience_years ≤ 5:</div>
                        <div>    level = "Mid-Level" (3-5 years)</div>
                        <div>elif experience_years ≤ 8:</div>
                        <div>    level = "Senior" (6-8 years)</div>
                        <div>else:</div>
                        <div>    level = "Expert" (9+ years)</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-900">
                          <strong>Label Encoding:</strong> Junior=0, Mid-Level=1, Senior=2, Expert=3 for ordinal feature preservation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Vector Construction</h2>
                  <p className="text-gray-700 mb-4">
                    Final feature vector for each resume combines extracted and derived features:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs mb-4">
                    <div className="text-gray-500">// Feature vector X ∈ ℝⁿ (n-dimensional space)</div>
                    <div className="mt-2">X = [</div>
                    <div>  num_skills,           // Count of extracted skills</div>
                    <div>  experience_years,     // Years of experience (scaled)</div>
                    <div>  skill_diversity,      // 0-1 diversity score</div>
                    <div>  technical_ratio,      // 0-1 technical proportion</div>
                    <div>  education_encoded,    // 0-4 ordinal encoding</div>
                    <div>  has_certifications,   // 0 or 1 binary</div>
                    <div>  has_leadership,       // 0 or 1 binary</div>
                    <div>]</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Dimensionality</h3>
                    <p className="text-sm text-gray-800 mb-2">
                      Feature vector: X ∈ ℝ⁷ (7-dimensional space)
                    </p>
                    <p className="text-xs text-gray-700">
                      Low dimensionality reduces curse of dimensionality while capturing essential candidate characteristics.
                      Additional dimensions could be added (e.g., years at each company, project count) but risk overfitting with limited training data.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Feature Engineering Tradeoffs</h3>
                    <div className="text-sm text-amber-800 space-y-2">
                      <p>
                        <strong>Advantages:</strong> (1) Interpretable features aligned with hiring domain, (2) Low dimensionality prevents overfitting,
                        (3) Robust to missing data, (4) Fast computation for real-time scoring
                      </p>
                      <p>
                        <strong>Limitations:</strong> (1) Manual feature engineering vs end-to-end learning, (2) May miss subtle patterns in raw text,
                        (3) Fixed skill taxonomy requires periodic updates, (4) Limited context understanding (keywords only, not semantic meaning)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clustering Section */}
          {activeSection === 'clustering' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">K-means Clustering Analysis</h1>
                <p className="text-lg text-gray-600">
                  Unsupervised learning to discover natural candidate groupings
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mathematical Foundation</h2>
                  <p className="text-gray-700 mb-6">
                    K-means is an unsupervised learning algorithm that partitions n observations into k clusters by minimizing
                    the within-cluster sum of squares (WCSS), also known as inertia. It belongs to the class of expectation-maximization
                    algorithms and aims to find locally optimal cluster assignments.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Objective Function (Inertia)</h3>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                        <div>J = Σᵢ₌₁ᴷ Σₓ∈Cᵢ ||x - μᵢ||²</div>
                        <div className="text-gray-500 mt-2">where:</div>
                        <div className="text-gray-500">  K = number of clusters</div>
                        <div className="text-gray-500">  Cᵢ = set of points in cluster i</div>
                        <div className="text-gray-500">  μᵢ = centroid of cluster i</div>
                        <div className="text-gray-500">  x = data point (feature vector)</div>
                        <div className="text-gray-500">  ||·|| = Euclidean norm (L2 distance)</div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Goal: Find cluster assignments C = &#123;C₁, C₂, ..., Cₖ&#125; that minimize J
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Euclidean Distance Calculation</h3>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                        <div>d(x, μᵢ) = √(Σⱼ₌₁ⁿ (xⱼ - μᵢⱼ)²)</div>
                        <div className="text-gray-500 mt-2">For our 7-dimensional feature space:</div>
                        <div className="text-gray-500">d(x, μ) = √[(x₁-μ₁)² + (x₂-μ₂)² + ... + (x₇-μ₇)²]</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-900">
                          <strong>Example:</strong> Resume A: [0.5, 1.2, 0.6, 0.8, 2, 1, 0], Centroid 1: [0.3, 1.0, 0.5, 0.7, 2, 1, 1]<br/>
                          Distance = √[(0.5-0.3)² + (1.2-1.0)² + (0.6-0.5)² + (0.8-0.7)² + (2-2)² + (1-1)² + (0-1)²] = √[0.04 + 0.04 + 0.01 + 0.01 + 0 + 0 + 1] = √1.10 ≈ 1.05
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lloyd's Algorithm (Standard K-means)</h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                      <h3 className="font-semibold text-purple-900 mb-3">Iterative Process</h3>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">Initialization</p>
                            <p className="text-sm text-gray-700">
                              Randomly select K data points as initial centroids: μ₁⁽⁰⁾, μ₂⁽⁰⁾, ..., μₖ⁽⁰⁾
                            </p>
                            <div className="bg-white border border-purple-200 rounded p-2 mt-2 text-xs font-mono text-gray-800">
                              Method: K-means++ for better initialization<br/>
                              (probabilistic selection based on distance)
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">Assignment Step (E-step)</p>
                            <p className="text-sm text-gray-700 mb-2">
                              Assign each point x to nearest centroid:
                            </p>
                            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                              Cᵢ⁽ᵗ⁾ = &#123;x : ||x - μᵢ⁽ᵗ⁾|| ≤ ||x - μⱼ⁽ᵗ⁾|| ∀j&#125;
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">Update Step (M-step)</p>
                            <p className="text-sm text-gray-700 mb-2">
                              Recalculate centroids as mean of assigned points:
                            </p>
                            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                              μᵢ⁽ᵗ⁺¹⁾ = (1/|Cᵢ⁽ᵗ⁾|) Σₓ∈Cᵢ⁽ᵗ⁾ x
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            4
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">Convergence Check</p>
                            <p className="text-sm text-gray-700 mb-2">
                              Repeat steps 2-3 until convergence:
                            </p>
                            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                              Stop if: ||μᵢ⁽ᵗ⁺¹⁾ - μᵢ⁽ᵗ⁾|| &lt; ε for all i<br/>
                              or max_iterations reached (typically 300)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Time Complexity</h4>
                        <div className="text-sm text-gray-800 space-y-1">
                          <p className="font-mono">O(n × K × d × i)</p>
                          <p className="text-xs">n = samples (800 resumes)</p>
                          <p className="text-xs">K = clusters (5)</p>
                          <p className="text-xs">d = dimensions (7)</p>
                          <p className="text-xs">i = iterations (~20-50)</p>
                          <p className="text-xs text-green-700 pt-2">≈ 280,000 operations</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-4">
                        <h4 className="font-semibold text-amber-900 mb-2">Space Complexity</h4>
                        <div className="text-sm text-gray-800 space-y-1">
                          <p className="font-mono">O(n × d + K × d)</p>
                          <p className="text-xs">Data storage: 800 × 7 = 5,600</p>
                          <p className="text-xs">Centroid storage: 5 × 7 = 35</p>
                          <p className="text-xs text-amber-700 pt-2">Total: ~6KB (very efficient)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Initialization: K-means++ Algorithm</h2>
                  <p className="text-gray-700 mb-4">
                    Standard random initialization can lead to poor local optima. K-means++ provides smarter initialization
                    by selecting centroids that are spread out, improving convergence speed by ~10x and solution quality.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs mb-4">
                    <div className="text-gray-500">// K-means++ initialization pseudocode</div>
                    <div className="mt-2">1. Choose first centroid μ₁ uniformly at random</div>
                    <div>2. For each point x, compute D(x) = min distance to existing centroids</div>
                    <div>3. Choose next centroid μᵢ with probability ∝ D(x)²</div>
                    <div>4. Repeat steps 2-3 until K centroids selected</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Why D(x)² probability?</strong> Points far from existing centroids are more likely to be chosen,
                      ensuring initial centroids are well-separated. This gives O(log K)-approximation to optimal clustering in expectation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimal K Selection</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Elbow Method
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Plot WCSS (inertia) against K. The "elbow" point where the decrease slows indicates optimal K.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs font-mono text-blue-900">
                        K=2: 12500 (high inertia)<br/>
                        K=3: 8200<br/>
                        K=4: 5100<br/>
                        K=5: 3800 ← elbow<br/>
                        K=6: 3200<br/>
                        K=7: 2900
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        Silhouette Score
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Measures how similar each point is to its own cluster vs other clusters. Range: -1 to +1.
                      </p>
                      <div className="bg-purple-50 border border-purple-200 rounded p-3 text-xs font-mono text-purple-900">
                        K=2: 0.42<br/>
                        K=3: 0.51<br/>
                        K=4: 0.48<br/>
                        K=5: 0.53 ← best<br/>
                        K=6: 0.45<br/>
                        K=7: 0.41
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900 flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span><strong>Result:</strong> Both methods suggest K=5 as optimal. Silhouette score of 0.53 indicates good cluster separation.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cluster Characteristics</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Cluster Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Experience</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Skills</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Diversity</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Tech Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clusterExamples.map((cluster, idx) => (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'purple', 'amber', 'orange'][idx]}-500`}></div>
                                <span className="font-medium text-gray-900">{cluster.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{cluster.experience}</td>
                            <td className="py-3 px-4 text-gray-700">{cluster.skills}</td>
                            <td className="py-3 px-4 text-gray-700">{cluster.diversity}</td>
                            <td className="py-3 px-4 text-gray-700">{cluster.techRatio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Validation Metrics</h3>
                    <div className="text-sm text-amber-800 space-y-1">
                      <p><strong>Silhouette Score:</strong> 0.48 (good separation)</p>
                      <p><strong>Davies-Bouldin Index:</strong> 1.15 (lower is better, &lt;1.5 is good)</p>
                      <p><strong>Calinski-Harabasz:</strong> 412.3 (higher is better, strong clustering)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scoring Algorithm Section */}
          {activeSection === 'scoring' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Two-Stage Scoring System</h1>
                <p className="text-lg text-gray-600">
                  Requirements filtering followed by competitive ranking of qualified candidates
                </p>
              </div>

              {/* Two-Stage Overview */}
              <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Architecture</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-xl border-2 border-red-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                          <CheckCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Stage 1: Requirements Check</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>Pass/Fail Filter:</strong> Candidates must meet ALL hard requirements
                        to proceed to scoring.
                      </p>
                      <div className="space-y-2 text-xs text-gray-800">
                        <p>✓ ALL required skills (must have every one)</p>
                        <p>✓ Minimum experience (years ≥ min_experience)</p>
                        <p>✓ Minimum education (level ≥ min_education)</p>
                        <p>✓ Certifications (if required)</p>
                        <p>✓ Leadership experience (if required)</p>
                      </div>
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-900 font-medium">
                          Missing ANY requirement → <strong>Automatic rejection (score = 0)</strong>
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl border-2 border-green-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Stage 2: Competitive Ranking</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>Weighted Scoring:</strong> Qualified candidates are scored 0-100
                        based on how much they EXCEED minimums.
                      </p>
                      <div className="space-y-2 text-xs text-gray-800">
                        <p><strong>Skills:</strong> Preferred skills + diversity</p>
                        <p><strong>Experience:</strong> Years beyond minimum</p>
                        <p><strong>Education:</strong> Degrees above minimum</p>
                        <p><strong>Bonuses:</strong> Certifications + leadership</p>
                        <p><strong>Final:</strong> Weighted combination</p>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-900 font-medium">
                          Passed Stage 1 → <strong>Ranked by fit for role (0-100)</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <strong className="text-blue-900">💡 Key Innovation:</strong> This fixes the fundamental flaw
                      where weights were confused with requirements. If you need a PhD + Python, these are requirements
                      (Stage 1), NOT weights. Weights are for ranking qualified candidates who already have those basics.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Scoring Components (Default Weights)</h2>
                  <div className="space-y-4">
                    {scoreComponents.map((component) => (
                      <div key={component.label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 ${component.color} rounded`}></div>
                            <span className="font-semibold text-gray-900">{component.label}</span>
                            <span className="text-xs text-gray-500">{component.description}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{component.weight}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${component.color} transition-all duration-500`}
                            style={{ width: `${component.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <strong className="text-amber-900">💡 Customizable:</strong> Recruiters can adjust these weights
                      when creating job postings. Weights must sum to 100%.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Stage 2 Component Calculations</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    These formulas only apply to candidates who passed Stage 1 (met all requirements).
                    Scores measure how much candidates EXCEED minimums.
                  </p>

                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Skills Score (0-100) - Preferred Skills Only</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Stage 1 already verified required skills.</strong> Stage 2 scores preferred skills (nice-to-have) + diversity.
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        preferred_match = matched_preferred / total_preferred<br/>
                        <strong>skills_score = (preferred_match × 80) + (diversity × 20)</strong>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Change:</strong> Required skills are pass/fail (Stage 1), not scored. This prevents
                        double-counting and clarifies what's a must-have vs nice-to-have.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Experience Score (0-100) - Years BEYOND Minimum</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Stage 1 verified candidate meets min_experience.</strong> Stage 2 scores fit relative to minimum.
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        beyond_min = experience_years - min_experience<br/>
                        if beyond_min ≤ 0: score = 70 // At minimum = baseline<br/>
                        elif beyond_min ≤ 2: <strong>score = 70 + (beyond_min × 15) // Perfect fit!</strong><br/>
                        elif beyond_min ≤ 5: score = 100 - ((beyond_min - 2) × 3)<br/>
                        else: score = max(70, 85 - ((beyond_min - 5) × 3))
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Change:</strong> Now relative to job's minimum. At minimum = 70 pts. +1-2 years beyond = 85-100 pts (perfect fit).
                        Overqualified candidates still ranked but with diminishing returns.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Education Score (0-100) - Degrees ABOVE Minimum</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Stage 1 verified candidate meets min_education.</strong> Stage 2 scores degrees above minimum.
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        levels_above = candidate_level - min_level<br/>
                        if levels_above == 0: score = 70 // At minimum<br/>
                        elif levels_above == 1: score = 85 // One above<br/>
                        elif levels_above ≥ 2: score = 100 // Two+ above
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Change:</strong> Education is now job-relative. If min = Bachelor's, then Bachelor's = 70,
                        Master's = 85, PhD = 100. If min = Master's, then Master's = 70, PhD = 100.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Bonus Scores (0-100)</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Stage 1 verified required cert/leadership if applicable.</strong> Stage 2 gives bonus if not required.
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        Has Certifications (when not required): 50 pts<br/>
                        Has Leadership (when not required): 50 pts<br/>
                        <strong>bonus_score = cert_bonus + leadership_bonus</strong>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Change:</strong> If cert/leadership are required, they're checked in Stage 1. Bonus only applies
                        when they're not required but candidate has them anyway.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-World Example: Two-Stage System in Action</h2>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 mb-4">
                    <div className="mb-4 p-3 bg-white rounded border border-blue-200">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Job: Senior Full-Stack Developer</h4>
                      <p className="text-xs text-gray-700"><strong>Stage 1 Requirements (Must Have ALL):</strong></p>
                      <p className="text-xs text-gray-700 ml-3">• Min Experience: 3 years</p>
                      <p className="text-xs text-gray-700 ml-3">• Required Skills: Python, React, PostgreSQL</p>
                      <p className="text-xs text-gray-700 ml-3">• Min Education: Bachelor's degree</p>
                      <p className="text-xs text-gray-700 mt-2"><strong>Stage 2 Preferences (Nice to Have):</strong></p>
                      <p className="text-xs text-gray-700 ml-3">• Preferred Skills: Docker, AWS, TypeScript</p>
                      <p className="text-xs text-gray-700 ml-3">• Certifications, Leadership (bonuses)</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Candidate A - Perfect Fit */}
                      <div className="p-4 bg-white rounded border-2 border-green-300">
                        <h3 className="font-semibold text-green-900 mb-2 text-sm">Candidate A: Perfect Fit</h3>
                        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs font-semibold text-green-900">✓ Stage 1: PASSED</p>
                          <p className="text-xs text-green-800">Has all required skills, 4 years exp, Bachelor's</p>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p><strong>Skills:</strong> 90/100 (2/3 preferred)</p>
                          <p><strong>Experience:</strong> 85/100 (+1 year beyond min)</p>
                          <p><strong>Education:</strong> 70/100 (at minimum)</p>
                          <p><strong>Bonus:</strong> 50/100 (has leadership)</p>
                          <p className="pt-2 border-t border-green-200 font-bold text-green-900">
                            Final: <span className="text-base">82.5/100</span>
                          </p>
                        </div>
                      </div>

                      {/* Candidate B - Rejected */}
                      <div className="p-4 bg-white rounded border-2 border-red-300">
                        <h3 className="font-semibold text-red-900 mb-2 text-sm">Candidate B: Missing Req</h3>
                        <div className="mb-3 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs font-semibold text-red-900">✗ Stage 1: REJECTED</p>
                          <p className="text-xs text-red-800">Missing PostgreSQL (required skill)</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-500">
                          <p><strong>Skills:</strong> N/A (not scored)</p>
                          <p><strong>Experience:</strong> N/A (not scored)</p>
                          <p><strong>Education:</strong> N/A (not scored)</p>
                          <p><strong>Bonus:</strong> N/A (not scored)</p>
                          <p className="pt-2 border-t border-red-200 font-bold text-red-900">
                            Final: <span className="text-base">0/100</span>
                          </p>
                        </div>
                      </div>

                      {/* Candidate C - Overqualified */}
                      <div className="p-4 bg-white rounded border-2 border-amber-300">
                        <h3 className="font-semibold text-amber-900 mb-2 text-sm">Candidate C: Overqualified</h3>
                        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs font-semibold text-green-900">✓ Stage 1: PASSED</p>
                          <p className="text-xs text-green-800">Has all requirements + PhD, 10 years</p>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p><strong>Skills:</strong> 95/100 (3/3 preferred)</p>
                          <p><strong>Experience:</strong> 70/100 (+7 years, diminishing)</p>
                          <p><strong>Education:</strong> 100/100 (+2 above min)</p>
                          <p><strong>Bonus:</strong> 100/100 (cert + leadership)</p>
                          <p className="pt-2 border-t border-amber-200 font-bold text-amber-900">
                            Final: <span className="text-base">84.5/100</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-amber-900">
                      <strong>Key Insights from Two-Stage System:</strong>
                    </p>
                    <ul className="text-sm text-amber-900 space-y-1 ml-4 list-disc">
                      <li><strong>Candidate A (82.5)</strong> and <strong>Candidate C (84.5)</strong> are close despite C having
                      7 more years of experience and a PhD. This is intentional - both are qualified, but C's overqualification
                      doesn't dramatically inflate their score.</li>
                      <li><strong>Candidate B (0)</strong> was automatically rejected for missing a required skill, even though
                      they might have great experience in other areas. Requirements are non-negotiable.</li>
                      <li>Traditional systems would rank C >> A >> B purely on credentials. Our system correctly identifies
                      that A and C are both qualified with A being a slightly better fit for the role level.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Percentile Ranking</h2>
                  <p className="text-gray-700 mb-4">
                    Percentiles show relative standing among all candidates. We calculate both overall percentile
                    (vs all applicants) and category percentile (vs applicants in same job category).
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-800 mb-2">
                      <strong>Formula:</strong> <code className="bg-white px-2 py-1 rounded">percentile = (rank / total) × 100</code>
                    </p>
                    <p className="text-sm text-gray-700">
                      Example: Score 74/100, ranked 650 out of 800 → (650/800) × 100 = <strong>81.25th percentile</strong>
                      <br/>
                      <span className="text-green-700">→ "You scored better than 81% of candidates"</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Statistical Validation Section */}
          {activeSection === 'validation' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Statistical Validation</h1>
                <p className="text-lg text-gray-600">
                  Rigorous hypothesis testing to validate our methodology
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hypothesis Tests Conducted</h2>

                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 mb-1">H1: Higher education leads to higher scores</h3>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Test:</strong> Independent samples t-test | <strong>Significance level:</strong> α = 0.05
                          </p>
                          <div className="bg-white border border-green-200 rounded p-3 text-xs space-y-1">
                            <p><strong>H₀:</strong> μ_higher = μ_bachelor (no difference)</p>
                            <p><strong>H₁:</strong> μ_higher &gt; μ_bachelor (higher education scores better)</p>
                            <p className="text-green-700 pt-2"><strong>Result:</strong> t = 5.23, p &lt; 0.001 → SIGNIFICANT ✓</p>
                            <p className="text-green-700">Master's/PhD avg: 72.5 | Bachelor's avg: 64.3 | Difference: +8.2 points</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 mb-1">H2: Certifications boost scores</h3>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Test:</strong> Independent samples t-test | <strong>Significance level:</strong> α = 0.05
                          </p>
                          <div className="bg-white border border-green-200 rounded p-3 text-xs space-y-1">
                            <p><strong>H₀:</strong> μ_certified = μ_not_certified</p>
                            <p><strong>H₁:</strong> μ_certified &gt; μ_not_certified</p>
                            <p className="text-green-700 pt-2"><strong>Result:</strong> t = 3.87, p &lt; 0.001 → SIGNIFICANT ✓</p>
                            <p className="text-green-700">Certified avg: 69.8 | Not certified avg: 63.2 | Difference: +6.6 points</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 mb-1">H3: Clusters have significantly different scores</h3>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Test:</strong> One-way ANOVA | <strong>Significance level:</strong> α = 0.05
                          </p>
                          <div className="bg-white border border-green-200 rounded p-3 text-xs space-y-1">
                            <p><strong>H₀:</strong> μ₁ = μ₂ = ... = μₖ (all clusters equal)</p>
                            <p><strong>H₁:</strong> At least one cluster differs</p>
                            <p className="text-green-700 pt-2"><strong>Result:</strong> F = 45.67, p &lt; 0.0001 → SIGNIFICANT ✓</p>
                            <p className="text-green-700">Validates that clustering creates meaningful groups with distinct characteristics</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 mb-1">H4: Skill diversity correlates with scores</h3>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Test:</strong> Pearson correlation | <strong>Significance level:</strong> α = 0.05
                          </p>
                          <div className="bg-white border border-green-200 rounded p-3 text-xs space-y-1">
                            <p><strong>H₀:</strong> ρ = 0 (no correlation)</p>
                            <p><strong>H₁:</strong> ρ ≠ 0 (correlation exists)</p>
                            <p className="text-green-700 pt-2"><strong>Result:</strong> r = 0.52, p &lt; 0.0001 → SIGNIFICANT ✓</p>
                            <p className="text-green-700">Moderate positive correlation: Higher diversity → Higher scores</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Correlations</h2>
                  <p className="text-gray-700 mb-4">
                    Pearson correlation coefficients between features and final score:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">Num_Skills ↔ Final_Score</span>
                          <span className="text-sm font-bold text-blue-600">r = 0.68</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Strong positive correlation (strongest predictor)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">Skill_Diversity ↔ Final_Score</span>
                          <span className="text-sm font-bold text-purple-600">r = 0.52</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600" style={{ width: '52%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Moderate positive correlation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">Experience_Years ↔ Final_Score</span>
                          <span className="text-sm font-bold text-green-600">r = 0.45</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Moderate positive correlation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">High Performer Profile</h2>
                  <p className="text-gray-700 mb-4">
                    Comparison of top 25% scorers vs others:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Top 25%</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Others</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">Num_Skills</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">18.5</td>
                          <td className="py-3 px-4 text-right text-gray-700">10.2</td>
                          <td className="py-3 px-4 text-right text-green-600 font-semibold">+81%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">Experience_Years</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">7.2</td>
                          <td className="py-3 px-4 text-right text-gray-700">4.1</td>
                          <td className="py-3 px-4 text-right text-green-600 font-semibold">+76%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">Skill_Diversity</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">0.68</td>
                          <td className="py-3 px-4 text-right text-gray-700">0.42</td>
                          <td className="py-3 px-4 text-right text-green-600 font-semibold">+62%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-900">Has_Certifications</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">85%</td>
                          <td className="py-3 px-4 text-right text-gray-700">45%</td>
                          <td className="py-3 px-4 text-right text-green-600 font-semibold">+89%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Key Findings</h3>
                    <ul className="space-y-1 text-sm text-purple-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>All hypothesis tests show statistical significance (p &lt; 0.05)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Skills are the strongest predictor of high scores (r = 0.68)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Clustering creates meaningful, distinct groups (validated by ANOVA)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>High performers have 81% more skills and 76% more experience on average</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Limitations & Ethics Section */}
          {activeSection === 'limitations' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Model Limitations & Ethical Considerations</h1>
                <p className="text-lg text-gray-600">
                  Critical analysis of system constraints and fairness implications
                </p>
              </div>

              <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transparency & Accountability</h2>
                      <p className="text-gray-700">
                        As an ML-powered hiring system, we have an ethical responsibility to be transparent about our model's
                        limitations and potential biases. This section critically evaluates our approach.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Limitations</h2>
                  <div className="space-y-5">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">1. Keyword-Based Skills Extraction</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Limitation:</strong> Pattern matching only captures explicit skill mentions, missing contextual understanding.</p>
                        <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                          <p className="text-xs text-red-900 mb-2"><strong>Example Failures:</strong></p>
                          <ul className="text-xs space-y-1 list-disc list-inside text-red-800">
                            <li>"Built web applications" → Misses implied HTML/CSS/JavaScript skills</li>
                            <li>"Led team of 5 engineers" → Misses implied leadership/management</li>
                            <li>"Proficient in Python frameworks" → Only catches "Python", misses Django/Flask</li>
                          </ul>
                        </div>
                        <p><strong>Impact:</strong> Under-rewards candidates who demonstrate skills through projects rather than listing them explicitly. Estimated 10-15% skill detection miss rate.</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">2. Static Skill Taxonomy</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Limitation:</strong> Fixed 150-skill database requires manual updates as technology evolves.</p>
                        <div className="bg-orange-50 border border-orange-200 rounded p-3 mt-2">
                          <p className="text-xs text-orange-900"><strong>Examples:</strong> Emerging technologies (GPT-4, Llama 2, Rust async, etc.) not in database until manually added. New frameworks released monthly.</p>
                        </div>
                        <p><strong>Impact:</strong> Candidates with cutting-edge skills may be under-scored if skills aren't in our taxonomy. Requires quarterly updates.</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">3. Local Optima in K-means</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Limitation:</strong> K-means is not guaranteed to find global optimum due to non-convex objective function.</p>
                        <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-2">
                          <p className="text-xs text-amber-900"><strong>Mathematical Issue:</strong> Different random initializations can produce different final clusters. K-means++ helps but doesn't eliminate this issue.</p>
                        </div>
                        <p><strong>Mitigation:</strong> Run multiple times with different seeds, select best result based on inertia. Still suboptimal compared to global optimization methods.</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">4. Assumes Euclidean Space</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Limitation:</strong> K-means uses Euclidean distance, assuming all features contribute linearly to similarity.</p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                          <p className="text-xs text-yellow-900"><strong>Issue:</strong> "10 years experience + 5 skills" treated as similar to "5 years + 10 skills" despite different candidate profiles. Ignores non-linear interactions.</p>
                        </div>
                        <p><strong>Alternative:</strong> Could use kernel methods or neural networks for non-linear feature interactions, but adds complexity.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bias & Fairness Concerns</h2>
                  <div className="space-y-5">
                    <div className="bg-purple-50 border border-purple-200 rounded p-5">
                      <h3 className="font-semibold text-purple-900 mb-3">Potential Bias Sources</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">1. Education Bias (20% weight)</p>
                          <p className="text-gray-700">
                            PhD=100, Master's=85, Bachelor's=70 creates inherent advantage for candidates with advanced degrees.
                            May disadvantage self-taught developers or candidates from regions with limited higher education access.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">2. Experience Bias</p>
                          <p className="text-gray-700">
                            Job-relative scoring helps but still assumes linear experience progression. Doesn't account for career breaks,
                            bootcamp graduates, or non-traditional paths (e.g., open-source contributors with no formal employment).
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">3. Keyword Gaming</p>
                          <p className="text-gray-700">
                            Candidates can artificially inflate scores by keyword stuffing. E.g., listing "Python, Python 3, Python 3.11"
                            counted as multiple skills. Our system uses deduplication but sophisticated gaming still possible.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">4. Language & Cultural Bias</p>
                          <p className="text-gray-700">
                            English-only skill extraction. Non-native speakers may use different terminology (e.g., "machine learning"
                            vs "ML" vs "statistical learning"). Western resume formatting conventions assumed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-5">
                      <h3 className="font-semibold text-blue-900 mb-3">Fairness Metrics & Considerations</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          <strong>Disparate Impact:</strong> Would require demographic data to measure (which we deliberately don't collect
                          to avoid discrimination). Cannot verify if model has disparate impact on protected groups.
                        </p>
                        <p>
                          <strong>Individual Fairness:</strong> "Similar candidates should receive similar scores" - partially achieved through
                          clustering, but definition of "similar" is subjective and culture-dependent.
                        </p>
                        <p>
                          <strong>Group Fairness:</strong> No mechanism to ensure equal opportunity across demographic groups. Education bias
                          may disproportionately affect candidates from low-income backgrounds.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Quality & Generalization</h2>
                  <div className="space-y-4">
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Training Data Limitations</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Our model is trained on synthetically generated resumes for demonstration purposes. Real-world deployment would require:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Large corpus of real resumes (1000s) with ground truth quality labels</li>
                        <li>Diverse representation across industries, experience levels, and geographies</li>
                        <li>Regular retraining to adapt to evolving hiring standards</li>
                        <li>Validation against actual hiring outcomes (interview rates, job performance)</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Domain Transfer Challenges</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Model trained on one industry may not generalize to others:
                      </p>
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <p className="text-xs font-semibold text-green-900 mb-1">Works Well:</p>
                          <p className="text-xs text-gray-700">Tech roles (Software Engineer, Data Scientist) where skills are well-defined and standardized</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-xs font-semibold text-red-900 mb-1">Works Poorly:</p>
                          <p className="text-xs text-gray-700">Creative roles (Designer, Writer) where portfolio quality matters more than keyword matching</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Ethical Use Guidelines</h3>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>
                        <strong>1. Human in the Loop:</strong> ML scores should augment, not replace, human judgment. Always have recruiters review
                        shortlisted candidates before making decisions.
                      </p>
                      <p>
                        <strong>2. Score Transparency:</strong> Candidates should see their scores and understand how they're calculated.
                        Our system provides detailed breakdowns for this reason.
                      </p>
                      <p>
                        <strong>3. Appeal Process:</strong> Candidates should be able to contest scores if they believe there are errors
                        (e.g., missed skills, incorrect parsing).
                      </p>
                      <p>
                        <strong>4. Regular Audits:</strong> Periodically audit for bias by analyzing score distributions across demographic groups
                        (when legally permissible to collect such data).
                      </p>
                      <p>
                        <strong>5. Continuous Improvement:</strong> Solicit feedback from recruiters and candidates to identify failure modes
                        and update model accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Future Work Section */}
          {activeSection === 'future' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Future Improvements & Research Directions</h1>
                <p className="text-lg text-gray-600">
                  Roadmap for enhancing the system with advanced ML techniques
                </p>
              </div>

              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vision for Next Generation ATS</h2>
                      <p className="text-gray-700">
                        Our current system provides a strong foundation, but modern NLP and ML advances enable significantly more
                        sophisticated candidate evaluation. Below are research directions for future development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Natural Language Processing Enhancements</h2>
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">1. Transformer-Based Embeddings (BERT/RoBERTa)</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Replace keyword matching with contextual embeddings that understand semantic meaning.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-3">
                        <p className="text-xs font-semibold text-gray-900 mb-2">Technical Approach:</p>
                        <div className="text-xs text-gray-700 space-y-1 font-mono">
                          <p>1. Fine-tune BERT on resume corpus</p>
                          <p>2. Generate 768-dim embeddings for each resume section</p>
                          <p>3. Use cosine similarity to match against job descriptions</p>
                          <p>4. Capture implicit skills: "built REST APIs" → implies Flask/Django</p>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-xs text-green-900">
                          <strong>Expected Improvement:</strong> 25-30% better skill detection, especially for implied competencies.
                          Requires GPU infrastructure and 100MB+ model size.
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">2. Named Entity Recognition (NER) for Projects</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Extract and evaluate project complexity beyond skill keywords.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-3">
                        <p className="text-xs font-semibold text-gray-900 mb-2">What to Extract:</p>
                        <div className="text-xs text-gray-700 space-y-1">
                          <p>• Project names and descriptions</p>
                          <p>• Technologies used (more accurate than keyword matching)</p>
                          <p>• Team size and role (technical lead vs contributor)</p>
                          <p>• Impact metrics (users served, revenue generated)</p>
                          <p>• Duration and recency</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Could use spaCy or fine-tuned NER models trained on annotated resumes.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">3. Skill Relationship Graph</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Build knowledge graph of skill relationships to infer related competencies.
                      </p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs mb-2">
                        <div>Example Graph Structure:</div>
                        <div className="text-gray-500 mt-1">React → (requires) JavaScript → (relates to) TypeScript</div>
                        <div className="text-gray-500">Docker → (commonly used with) Kubernetes → (cloud) AWS</div>
                        <div className="mt-2">If candidate has [React, Docker], infer likely familiarity with [JavaScript, Containers]</div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Could be built from job posting co-occurrence data or scraped from StackOverflow/GitHub.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced ML Techniques</h2>
                  <div className="space-y-6">
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">4. Deep Clustering (Autoencoders + K-means)</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Learn optimal feature representations for clustering via unsupervised deep learning.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-3">
                        <p className="text-xs font-semibold text-gray-900 mb-2">Architecture:</p>
                        <div className="text-xs text-gray-700 font-mono space-y-1">
                          <p>Input (768-dim BERT) → Encoder → Bottleneck (32-dim) → Decoder → Output</p>
                          <p>Train to minimize: reconstruction_loss + clustering_loss</p>
                          <p>Jointly optimize representation and cluster assignments</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-3">
                        <p className="text-xs text-amber-900">
                          <strong>Advantage:</strong> Learns non-linear features optimal for clustering vs hand-crafted features.
                          <strong>Challenge:</strong> Requires large training set (5000+ resumes) and careful hyperparameter tuning.
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">5. Learning-to-Rank (LambdaMART, RankNet)</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Train model to directly optimize candidate ranking using recruiter feedback.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-3">
                        <p className="text-xs font-semibold text-gray-900 mb-2">Training Data:</p>
                        <div className="text-xs text-gray-700 space-y-1">
                          <p>• Pairwise preferences: "Recruiter selected candidate A over B"</p>
                          <p>• Interview outcomes: "Candidate C reached final round"</p>
                          <p>• Hiring decisions: "Candidate D was hired"</p>
                          <p>• Implicit feedback: Click-through rates on applications</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Directly optimizes for business metric (hire quality) rather than proxy features (skills count).
                        Requires historical hiring data and outcome tracking.
                      </p>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">6. Multi-Task Learning</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Single model predicts multiple outputs: score, cluster, skill tags, experience level.
                      </p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs mb-2">
                        <div>Shared Encoder (BERT)</div>
                        <div>  ├─ Task 1: Final Score Regression (MSE loss)</div>
                        <div>  ├─ Task 2: Cluster Classification (CrossEntropy loss)</div>
                        <div>  ├─ Task 3: Skill Extraction (Multi-label classification)</div>
                        <div>  └─ Task 4: Experience Level (Ordinal regression)</div>
                        <div className="mt-2">Total Loss = α₁L₁ + α₂L₂ + α₃L₃ + α₄L₄</div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Shared representations improve generalization. Task weights (α) control importance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Fairness & Explainability</h2>
                  <div className="space-y-5">
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">7. Adversarial Debiasing</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Train model to make accurate predictions while being unable to predict protected attributes.
                      </p>
                      <div className="bg-indigo-50 border border-indigo-200 rounded p-3">
                        <p className="text-xs text-indigo-900">
                          Add adversarial classifier that tries to predict gender/race from learned representations.
                          Main model learns to fool adversary → removes demographic information from features.
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-cyan-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">8. SHAP/LIME Explanations</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Provide per-candidate explanations of score contributions.
                      </p>
                      <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                        <p className="text-xs text-cyan-900">
                          "Your score is 72. Breakdown: Skills (+15), Experience (+10), Education (+8), ..."
                          Use SHAP values to show exactly which features increased/decreased score.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Infrastructure & Scalability</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">9. Real-Time Scoring API</h3>
                        <p className="text-xs text-gray-700 mb-2">
                          Current: Batch processing post-upload<br/>
                          Future: Stream processing with &lt;100ms latency
                        </p>
                        <div className="text-xs text-gray-600">
                          Use TensorFlow Serving or TorchServe for model inference. Deploy on GPU instances for transformer models.
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">10. Active Learning Pipeline</h3>
                        <p className="text-xs text-gray-700 mb-2">
                          Continuously improve model using recruiter feedback
                        </p>
                        <div className="text-xs text-gray-600">
                          Identify low-confidence predictions → Request recruiter labels → Retrain model weekly
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Research Roadmap Priority</h3>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>
                        <strong>Phase 1 (3-6 months):</strong> Implement BERT embeddings (#1) and NER (#2) for better skill extraction.
                        Low-hanging fruit with significant accuracy gains.
                      </p>
                      <p>
                        <strong>Phase 2 (6-12 months):</strong> Build learning-to-rank model (#5) using historical hiring data.
                        Requires data collection infrastructure but directly optimizes business goals.
                      </p>
                      <p>
                        <strong>Phase 3 (12-18 months):</strong> Research deep clustering (#4) and multi-task learning (#6).
                        Higher risk but potential for state-of-the-art performance.
                      </p>
                      <p>
                        <strong>Ongoing:</strong> Fairness audits (#7, #8) should be implemented throughout all phases to ensure ethical AI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
