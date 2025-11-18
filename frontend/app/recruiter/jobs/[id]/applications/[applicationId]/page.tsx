'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat,
  ArrowLeft,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor } from '@/lib/utils'

export default function RecruiterApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const applicationId = params.applicationId as string

  const [user, setUser] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [currentUser, app] = await Promise.all([
        api.getCurrentUser(),
        api.getApplication(applicationId)
      ])

      setUser(currentUser)
      setApplication(app)

      // Load job details
      const jobData = await api.getJob(app.job_id)
      setJob(jobData)
    } catch (error: any) {
      if (error.message.includes('401')) {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    router.push('/')
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await api.updateApplicationStatus(parseInt(applicationId), newStatus)
      // Reload data
      const app = await api.getApplication(applicationId)
      setApplication(app)
    } catch (error: any) {
      alert('Failed to update status: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="border border-gray-200 max-w-md">
          <CardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application not found</h3>
            <p className="text-gray-600 mb-6">This application may have been removed.</p>
            <Button onClick={() => router.push('/recruiter/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate weighted contributions using job-specific weights
  const weights = {
    skills: job?.weight_skills || 0.4,
    experience: job?.weight_experience || 0.3,
    education: job?.weight_education || 0.2,
    certifications: job?.weight_certifications || 0.05,
    leadership: job?.weight_leadership || 0.05
  }

  const scoreBreakdown = [
    { label: 'Skills Match', value: (application.skills_score || 0) * weights.skills, weight: weights.skills * 100, color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { label: 'Experience', value: (application.experience_score || 0) * weights.experience, weight: weights.experience * 100, color: 'text-green-600', bgColor: 'bg-green-500' },
    { label: 'Education', value: (application.education_score || 0) * weights.education, weight: weights.education * 100, color: 'text-purple-600', bgColor: 'bg-purple-500' },
    { label: 'Bonus Points', value: (application.bonus_score || 0) * (weights.certifications + weights.leadership), weight: (weights.certifications + weights.leadership) * 100, color: 'text-amber-600', bgColor: 'bg-amber-500' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push(`/recruiter/jobs/${jobId}/applications`)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>

        {/* Header Card */}
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Application #{application.id}
                </h1>
                <p className="text-gray-600">
                  Applied to {job?.title || `Job #${application.job_id}`} on {formatDate(application.applied_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  {application.status === 'pending' && (
                    <span className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending Review
                    </span>
                  )}
                  {application.status === 'shortlisted' && (
                    <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Shortlisted
                    </span>
                  )}
                  {application.status === 'rejected' && (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-medium">
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              {application.status !== 'shortlisted' && (
                <Button
                  onClick={() => handleUpdateStatus('shortlisted')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Shortlist Candidate
                </Button>
              )}
              {application.status !== 'rejected' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus('rejected')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
              {application.status !== 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus('pending')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Pending
                </Button>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(application.final_score || 0)}`}>
                  {application.final_score?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Final Score (out of 100)</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold mb-2 text-gray-900">
                  {formatPercentile(application.overall_percentile || 50)}
                </div>
                <div className="text-sm text-gray-600">Overall Percentile</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold mb-2 text-gray-900">
                  {application.cluster_name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Talent Cluster</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Score Breakdown</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Detailed breakdown of the candidate's application score
              </p>
              <div className="space-y-5">
                {scoreBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>
                        {item.value.toFixed(1)} / {item.weight.toFixed(0)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.bgColor} transition-all duration-500`}
                        style={{ width: `${(item.value / item.weight) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-900">Total Score</span>
                    <span className={getScoreColor(application.final_score || 0)}>
                      {application.final_score?.toFixed(1) || 0} / 100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Profile */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Candidate Profile</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Key information extracted from the resume
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {application.experience_years?.toFixed(1) || 0} years
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Education Level</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {application.education_level || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Skills</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {application.num_skills || 0} skills
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Skill Diversity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {((application.skill_diversity || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className={`text-sm font-semibold ${application.has_certifications ? 'text-green-600' : 'text-gray-400'}`}>
                    {application.has_certifications ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">Leadership Experience</span>
                  <span className={`text-sm font-semibold ${application.has_leadership ? 'text-green-600' : 'text-gray-400'}`}>
                    {application.has_leadership ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Analysis */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Skills Analysis</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Skills extracted from resume and matched to job requirements
              </p>
              <div className="space-y-6">
                {application.matched_skills && application.matched_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">
                        Matched Skills ({application.matched_skills.length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {application.matched_skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-green-100 text-green-900 rounded-md text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.extracted_skills && application.extracted_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        All Extracted Skills ({application.extracted_skills.length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {application.extracted_skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-blue-100 text-blue-900 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.missing_skills && application.missing_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">
                        Missing Skills ({application.missing_skills.length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {application.missing_skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-orange-100 text-orange-900 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                AI-generated insights about this candidate
              </p>
              {application.recommendations && application.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {application.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-900">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    This candidate has a strong profile for this position.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
