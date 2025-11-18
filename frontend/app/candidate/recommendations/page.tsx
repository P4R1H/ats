'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat, Upload, FileText, Sparkles, TrendingUp, Target, CheckCircle,
  XCircle, ArrowRight, Briefcase, Award, Lightbulb, ArrowLeft, Loader2
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatPercentile } from '@/lib/utils'

interface ResumeAnalysis {
  skills: string[]
  experience_years: number
  education_level: string
  has_certifications: boolean
  has_leadership: boolean
}

interface JobRecommendation {
  job: any
  match_score: number
  skills_match_percentage: number
  predicted_percentile: number
  missing_required_skills: string[]
  missing_preferred_skills: string[]
  meets_requirements: boolean
  potential_score: number
}

export default function JobRecommendationsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragging, setDragging] = useState(false)

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await api.getCurrentUser()
      setUser(currentUser)
    } catch (error: any) {
      if (error.message.includes('401')) {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))

    if (pdfFile) {
      handleFileSelected(pdfFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelected(file)
    }
  }

  const handleFileSelected = async (file: File) => {
    setResumeFile(file)
    setAnalyzing(true)

    try {
      // Upload and analyze resume
      const analysis = await api.analyzeResume(file)
      setResumeAnalysis(analysis)

      // Get job recommendations
      const recs = await api.getJobRecommendations(analysis)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error analyzing resume:', error)
      alert('Failed to analyze resume. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setResumeAnalysis(null)
    setRecommendations([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-700'
    if (percentage >= 60) return 'text-amber-700'
    return 'text-gray-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-md transition-shadow">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Bread</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.name}</span>
            <Button variant="outline" onClick={() => router.push('/candidate/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/candidate/dashboard')}
          className="mb-6 px-0 text-gray-600 hover:text-gray-900 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Recommendations</h1>
          <p className="text-gray-600">
            Upload your resume to discover jobs where you're likely to rank high
          </p>
        </div>

        {/* Upload Section */}
        {!resumeAnalysis && (
          <Card className="border border-gray-200 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Your Resume</h2>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-colors
                  ${dragging ? 'border-gray-400 bg-gray-50' : 'border-gray-300 bg-white'}
                  ${analyzing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-gray-400 hover:bg-gray-50'}
                `}
                onClick={() => !analyzing && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {analyzing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-gray-900 animate-spin" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">Analyzing your resume...</p>
                      <p className="text-sm text-gray-600">
                        Extracting skills, experience, and qualifications
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-sm text-gray-600">
                        PDF format only • Max 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">We'll analyze your resume to extract your skills, experience, and qualifications, then match you with jobs where you're predicted to rank in the top percentiles.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Analysis & Recommendations */}
        {resumeAnalysis && (
          <>
            {/* Analysis Summary */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Resume Analyzed</h2>
                    <p className="text-sm text-gray-600">{resumeFile?.name}</p>
                  </div>
                  <Button variant="outline" onClick={handleReset}>
                    Upload Different Resume
                  </Button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100 h-full flex flex-col justify-center">
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      {resumeAnalysis.skills.length}
                    </div>
                    <div className="text-sm text-gray-600">Skills Found</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 h-full flex flex-col justify-center">
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      {resumeAnalysis.experience_years}
                    </div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100 h-full flex flex-col justify-center">
                    <div className="text-xl font-semibold text-purple-700 mb-1">
                      {resumeAnalysis.education_level}
                    </div>
                    <div className="text-sm text-gray-600">Education</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100 h-full flex flex-col justify-center">
                    <div className="text-lg font-semibold text-amber-700 mb-1">
                      {resumeAnalysis.has_certifications ? 'Yes' : 'No'} / {resumeAnalysis.has_leadership ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">Certs / Leadership</div>
                  </div>
                </div>

                {resumeAnalysis.skills.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Detected Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skills.slice(0, 20).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-md text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {resumeAnalysis.skills.length > 20 && (
                        <span className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium">
                          +{resumeAnalysis.skills.length - 20} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Recommended Jobs ({recommendations.length})
                  </h2>
                  <p className="text-gray-600">
                    Jobs ranked by your predicted performance and skills match
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {recommendations.map((rec, idx) => (
                    <Card key={rec.job.id} className="border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={rec.job.title}>
                                {rec.job.title}
                              </h3>
                              <p className="text-sm text-gray-600 font-medium">
                                {rec.job.category}
                              </p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              rec.predicted_percentile >= 80 ? 'bg-green-100 text-green-800' :
                              rec.predicted_percentile >= 60 ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {formatPercentile(rec.predicted_percentile)} Match
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="h-4 w-4 text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">Skills Match</span>
                              </div>
                              <div className={`text-lg font-bold ${getMatchColor(rec.skills_match_percentage)}`}>
                                {rec.skills_match_percentage}%
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                {rec.meets_requirements ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-xs text-gray-500 font-medium">Requirements</span>
                              </div>
                              <div className={`text-lg font-bold ${rec.meets_requirements ? 'text-green-700' : 'text-red-700'}`}>
                                {rec.meets_requirements ? 'Met' : 'Not Met'}
                              </div>
                            </div>
                          </div>

                          {(rec.missing_required_skills.length > 0 || rec.missing_preferred_skills.length > 0) && (
                            <div className="space-y-3 mb-6">
                              {rec.missing_required_skills.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Missing Required Skills
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {rec.missing_required_skills.slice(0, 3).map((skill, sidx) => (
                                      <span
                                        key={sidx}
                                        className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-100"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {rec.missing_required_skills.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium border border-gray-200">
                                        +{rec.missing_required_skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {rec.missing_preferred_skills.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-amber-600 mb-2 flex items-center gap-1">
                                    <Lightbulb className="h-3 w-3" />
                                    Missing Preferred Skills
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {rec.missing_preferred_skills.slice(0, 3).map((skill, sidx) => (
                                      <span
                                        key={sidx}
                                        className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium border border-amber-100"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {rec.missing_preferred_skills.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium border border-gray-200">
                                        +{rec.missing_preferred_skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => router.push(`/candidate/jobs#${rec.job.id}`)}
                          className="w-full mt-auto group"
                        >
                          View Job Details
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {recommendations.length === 0 && (
              <Card className="border border-gray-200">
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No job recommendations found</p>
                  <p className="text-sm text-gray-500">
                    Try uploading a different resume or check back later for new job postings
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
