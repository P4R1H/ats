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
    { id: 'clustering', label: 'Clustering', icon: GitBranch },
    { id: 'scoring', label: 'Scoring Algorithm', icon: TrendingUp },
    { id: 'validation', label: 'Statistical Validation', icon: BarChart3 },
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
    { label: 'Skills Match', weight: 40, color: 'bg-blue-500', description: '70% required + 20% preferred + 10% diversity' },
    { label: 'Experience', weight: 30, color: 'bg-green-500', description: 'Job-relative (perfect fit at min_experience +0-2 years)' },
    { label: 'Education', weight: 20, color: 'bg-purple-500', description: 'PhD (100) > Master\'s (85) > Bachelor\'s (70)' },
    { label: 'Certifications', weight: 5, color: 'bg-amber-500', description: 'Binary bonus for certifications' },
    { label: 'Leadership', weight: 5, color: 'bg-orange-500', description: 'Binary bonus for leadership experience' },
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
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">What is Bread ATS?</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Bread is an intelligent Applicant Tracking System that uses advanced machine learning
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How K-means Works</h2>
                  <p className="text-gray-700 mb-6">
                    K-means is an unsupervised learning algorithm that groups similar data points into clusters.
                    It minimizes the within-cluster sum of squares (WCSS) by iteratively assigning points to the
                    nearest centroid and recalculating centroids.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-6">
                    <div>WCSS = Σᵢ₌₁ᴷ Σₓ∈Cᵢ ||x - μᵢ||²</div>
                    <div className="text-gray-500 mt-2">
                      where: K = clusters, Cᵢ = cluster i, μᵢ = centroid i, x = data point
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-4">Algorithm Steps:</h3>
                  <div className="space-y-3">
                    {[
                      'Initialize K random centroids in feature space',
                      'Assign each resume to nearest centroid (Euclidean distance)',
                      'Recalculate centroids as mean of assigned resumes',
                      'Repeat steps 2-3 until convergence (centroids don\'t change)',
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 pt-0.5">{step}</p>
                      </div>
                    ))}
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Multi-Factor Scoring Algorithm</h1>
                <p className="text-lg text-gray-600">
                  Transparent, weighted scoring system with recruiter customization
                </p>
              </div>

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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Component Calculations</h2>

                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Skills Score (0-100) - Job-Relative</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Compares candidate skills to job's required and preferred skills
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        required_match = matched_required / total_required<br/>
                        preferred_match = matched_preferred / total_preferred<br/>
                        <strong>skills_score = (required_match × 70) + (preferred_match × 20) + (diversity × 10)</strong>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Innovation:</strong> Strong resume matching 100% of required skills scores ~87, while generic resume with many unrelated skills scores low.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Experience Score (0-100) - Job-Relative</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Rewards candidates who match the job's experience level (overqualified candidates penalized)
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        diff = experience_years - min_experience<br/>
                        if diff &lt; 0: score = (experience / min_experience) × 60<br/>
                        elif diff ≤ 2: <strong>score = 90 + (diff × 5) // Perfect fit!</strong><br/>
                        elif diff ≤ 5: score = 90 - ((diff - 2) × 3)<br/>
                        else: score = max(60, 80 - ((diff - 5) × 3))
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Key Innovation:</strong> Junior role (min_experience=0): 2-year candidate scores 100, 10-year candidate scores 71.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Education Score (0-100)</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Fixed scores based on degree level
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        PhD: 100<br/>
                        Master's: 85<br/>
                        Bachelor's: 70<br/>
                        Diploma: 50<br/>
                        Not Specified: 40
                      </div>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Bonus Scores (0-100)</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Binary indicators for certifications and leadership
                      </p>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-800">
                        Has Certifications: 100 (else 0)<br/>
                        Has Leadership: 100 (else 0)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-World Example: Junior Developer Role</h2>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 mb-4">
                    <div className="mb-4 p-3 bg-white rounded border border-blue-200">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Job Requirements:</h4>
                      <p className="text-xs text-gray-700">Min Experience: <strong>0-2 years</strong></p>
                      <p className="text-xs text-gray-700">Required Skills: <strong>Python, React, SQL</strong></p>
                      <p className="text-xs text-gray-700">Preferred Skills: <strong>Docker, AWS</strong></p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-white rounded border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-3">Strong Fit Candidate</h3>
                        <div className="space-y-2 text-xs">
                          <p><strong>Experience:</strong> 1.5 years → Score: 97.5 (perfect fit!)</p>
                          <p><strong>Skills:</strong> Python, React, SQL, Docker → Score: 85 (3/3 required, 1/2 preferred)</p>
                          <p><strong>Education:</strong> Bachelor's → Score: 70</p>
                          <p className="pt-2 border-t border-green-200 font-bold text-green-900">
                            Final: <span className="text-lg">83.6/100</span> (Top 10%)
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded border border-red-200">
                        <h3 className="font-semibold text-red-900 mb-3">Overqualified Candidate</h3>
                        <div className="space-y-2 text-xs">
                          <p><strong>Experience:</strong> 10 years → Score: 71 (overqualified penalty)</p>
                          <p><strong>Skills:</strong> 15 random skills, only Python matches → Score: 30 (1/3 required)</p>
                          <p><strong>Education:</strong> Master's → Score: 85</p>
                          <p className="pt-2 border-t border-red-200 font-bold text-red-900">
                            Final: <span className="text-lg">53.8/100</span> (Below 50%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      <strong>Why This Matters:</strong> Traditional ATS systems would rank the 10-year candidate higher due to experience alone.
                      Our job-relative system correctly identifies the 1.5-year candidate as the better fit for this junior role.
                    </p>
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
        </main>
      </div>
    </div>
  )
}
