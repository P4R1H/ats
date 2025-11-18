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
  Users
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor } from '@/lib/utils'

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

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
            <Button onClick={() => router.push('/candidate/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get job-specific weights or use defaults
  const weights = {
    skills: job?.weight_skills || 0.4,
    experience: job?.weight_experience || 0.3,
    education: job?.weight_education || 0.2,
    certifications: job?.weight_certifications || 0.05,
    leadership: job?.weight_leadership || 0.05
  }

  // Calculate weighted contributions (raw scores are 0-100, multiply by weight percentage)
  const scoreBreakdown = [
    { label: 'Skills Match', value: (application.skills_score || 0) * weights.skills, weight: weights.skills * 100, color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { label: 'Experience', value: (application.experience_score || 0) * weights.experience, weight: weights.experience * 100, color: 'text-green-600', bgColor: 'bg-green-500' },
    { label: 'Education', value: (application.education_score || 0) * weights.education, weight: weights.education * 100, color: 'text-purple-600', bgColor: 'bg-purple-500' },
    { label: 'Bonus Points', value: (application.bonus_score || 0) * (weights.certifications + weights.leadership), weight: (weights.certifications + weights.leadership) * 100, color: 'text-amber-600', bgColor: 'bg-amber-500' }
  ]

  // Skills Gap Analysis - Handle both string and array formats
  const requiredSkills = job?.required_skills
    ? Array.isArray(job.required_skills)
      ? job.required_skills
      : typeof job.required_skills === 'string'
        ? job.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []
    : []
  const preferredSkills = job?.preferred_skills
    ? Array.isArray(job.preferred_skills)
      ? job.preferred_skills
      : typeof job.preferred_skills === 'string'
        ? job.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []
    : []
  const candidateSkills = application.extracted_skills || []

  const missingRequired = requiredSkills.filter((skill: string) =>
    !candidateSkills.some((cs: string) => cs.toLowerCase() === skill.toLowerCase())
  )
  const missingPreferred = preferredSkills.filter((skill: string) =>
    !candidateSkills.some((cs: string) => cs.toLowerCase() === skill.toLowerCase())
  )

  // Calculate potential score improvement
  const currentSkillsScore = application.skills_score || 0
  const totalRequiredSkills = requiredSkills.length
  const matchedRequired = totalRequiredSkills - missingRequired.length
  const potentialRequiredImprovement = totalRequiredSkills > 0
    ? (missingRequired.length / totalRequiredSkills) * 70 // 70 points max for required
    : 0

  const totalPreferredSkills = preferredSkills.length
  const potentialPreferredImprovement = totalPreferredSkills > 0
    ? (missingPreferred.length / totalPreferredSkills) * 20 // 20 points max for preferred
    : 0

  const potentialSkillsScoreImprovement = potentialRequiredImprovement + potentialPreferredImprovement
  const potentialFinalScoreImprovement = potentialSkillsScoreImprovement * weights.skills

  const matchPercentage = totalRequiredSkills > 0
    ? ((matchedRequired / totalRequiredSkills) * 100).toFixed(0)
    : 100

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
          onClick={() => router.push('/candidate/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Card */}
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job?.title || `Job #${application.job_id}`}
                </h1>
                <p className="text-gray-600">
                  Applied {formatDate(application.applied_at)}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {/* Requirements Badge */}
                {application.meets_requirements === false ? (
                  <span className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full font-medium border border-red-200">
                    <XCircle className="h-5 w-5 mr-2" />
                    Did Not Meet Requirements
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium border border-green-200">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Met All Requirements
                  </span>
                )}

                {/* Status Badge */}
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
                    Not Selected
                  </span>
                )}
              </div>
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

        {/* Requirements Check (Stage 1) */}
        {application.meets_requirements === false && (
          <Card className="border border-gray-200 mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Did Not Meet Minimum Requirements
                  </h2>
                  <p className="text-gray-700 mb-1">
                    Our two-stage scoring system requires candidates to meet ALL minimum requirements
                    before being ranked. Unfortunately, your application was missing some requirements.
                  </p>
                  {application.rejection_reason && (
                    <p className="text-sm text-red-800 font-medium mt-3 p-3 bg-red-100 rounded-lg">
                      {application.rejection_reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Missing Requirements Breakdown */}
              {application.missing_requirements && application.missing_requirements.length > 0 && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Missing Requirements:</h3>
                  <ul className="space-y-3">
                    {application.missing_requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What This Means */}
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-gray-600" />
                  What This Means For You
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Stage 1 (Requirements Check):</strong> This is a pass/fail filter.
                    Your application did not meet all minimum requirements set by the employer.
                  </p>
                  <p>
                    <strong>Stage 2 (Scoring & Ranking):</strong> Your score of {application.final_score?.toFixed(1) || 0}
                    shows what you would score among qualified candidates, but you were not ranked because
                    you didn't pass Stage 1.
                  </p>
                  <p className="font-medium text-gray-900">
                    ✓ Good news: You can improve! Review the missing requirements above and work on
                    acquiring those skills/qualifications. Then apply to similar positions where you meet
                    all requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {application.meets_requirements !== false && (
          <Card className="border border-gray-200 mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    You Met All Minimum Requirements!
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Congratulations! Your application passed Stage 1 (Requirements Check).
                    You now compete with other qualified candidates in Stage 2 (Scoring & Ranking).
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-semibold text-gray-900 mb-2">✓ Stage 1: Requirements</div>
                      <p className="text-gray-600">
                        You meet all minimum education, experience, skills, and qualifications.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-semibold text-gray-900 mb-2">→ Stage 2: Ranking</div>
                      <p className="text-gray-600">
                        Your score of {application.final_score?.toFixed(1) || 0}/100 ranks you at the{' '}
                        {formatPercentile(application.overall_percentile || 50)} among qualified candidates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Gap Analysis - Full Width */}
        {(missingRequired.length > 0 || missingPreferred.length > 0) && (
          <Card className="border border-gray-200 mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Skills Gap Analysis</h2>
                  </div>
                  <p className="text-gray-700">
                    Personalized insights to help you improve your candidacy for this role
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    +{potentialFinalScoreImprovement.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Potential Score Gain</div>
                </div>
              </div>

              {/* Match Progress */}
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Required Skills Match</h3>
                    <p className="text-sm text-gray-600">
                      You have {matchedRequired} out of {totalRequiredSkills} required skills
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{matchPercentage}%</div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${matchPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Missing Required Skills */}
                {missingRequired.length > 0 && (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Missing Required Skills</h3>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Adding these skills could increase your score by up to{' '}
                      <strong className="text-gray-900">+{potentialRequiredImprovement.toFixed(1)} points</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingRequired.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-md text-sm font-medium border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Preferred Skills */}
                {missingPreferred.length > 0 && (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Missing Preferred Skills</h3>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        Nice to Have
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Adding these skills could increase your score by up to{' '}
                      <strong className="text-gray-900">+{potentialPreferredImprovement.toFixed(1)} points</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingPreferred.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-md text-sm font-medium border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Recommended Actions */}
              <div className="mt-6 space-y-4">
                {/* Learning Path */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <Lightbulb className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Personalized Learning Path</h3>
                      <p className="text-sm text-gray-600">
                        Based on your current skill set and this role's requirements
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {missingRequired.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border-l-4 border-gray-900">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              🎯 High Priority ({missingRequired.length} skill{missingRequired.length > 1 ? 's' : ''})
                            </h4>
                            <p className="text-xs text-gray-600">
                              Required skills - Worth up to +{potentialRequiredImprovement.toFixed(1)} points
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                            Required
                          </span>
                        </div>
                        <div className="space-y-2">
                          {missingRequired.slice(0, 3).map((skill: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-800">{idx + 1}. {skill}</span>
                              <span className="text-xs text-gray-500">2-4 weeks</span>
                            </div>
                          ))}
                          {missingRequired.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              + {missingRequired.length - 3} more skill{missingRequired.length - 3 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {missingPreferred.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              ⭐ Medium Priority ({missingPreferred.length} skill{missingPreferred.length > 1 ? 's' : ''})
                            </h4>
                            <p className="text-xs text-gray-600">
                              Preferred skills - Worth up to +{potentialPreferredImprovement.toFixed(1)} points
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                            Preferred
                          </span>
                        </div>
                        <div className="space-y-2">
                          {missingPreferred.slice(0, 3).map((skill: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-800">{idx + 1}. {skill}</span>
                              <span className="text-xs text-gray-500">1-3 weeks</span>
                            </div>
                          ))}
                          {missingPreferred.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              + {missingPreferred.length - 3} more skill{missingPreferred.length - 3 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Steps */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Next Steps</h3>
                      <p className="text-sm text-gray-600">
                        Actionable steps to improve your candidacy
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {missingRequired.length > 0 && (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            1
                          </div>
                          <div className="text-sm text-gray-800">
                            <strong>Learn required skills:</strong> Start with {missingRequired[0]}
                            {missingRequired.length > 1 && ` and ${missingRequired[1]}`}.
                            Use free resources like freeCodeCamp, Codecademy, or YouTube tutorials.
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            2
                          </div>
                          <div className="text-sm text-gray-800">
                            <strong>Build projects:</strong> Create 1-2 small projects demonstrating each skill.
                            This proves practical knowledge beyond just listing the skill.
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {missingRequired.length > 0 ? '3' : '1'}
                      </div>
                      <div className="text-sm text-gray-800">
                        <strong>Update your resume:</strong> Add new skills to a dedicated "Skills" section.
                        Include them in project descriptions to show context and application.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {missingRequired.length > 0 ? '4' : '2'}
                      </div>
                      <div className="text-sm text-gray-800">
                        <strong>Reapply when ready:</strong> Once you've acquired {missingRequired.length > 0 ? 'the required' : 'additional'} skills,
                        submit a new application. Your score could increase by <strong className="text-gray-900">+{potentialFinalScoreImprovement.toFixed(1)} points</strong>!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Score Breakdown</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Transparent breakdown of your application score
              </p>
              <div className="space-y-5">
                {scoreBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>
                        {item.value.toFixed(1)} / {item.weight.toFixed(1)}
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

          {/* Percentile Rankings */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Percentile Rankings</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                How you compare to other candidates
              </p>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <div className="text-sm text-gray-600 mb-2">Overall Percentile</div>
                <div className="text-4xl font-bold text-gray-900 mb-3">
                  {formatPercentile(application.overall_percentile || 50)}
                </div>
                <p className="text-sm text-gray-700">
                  You scored higher than {application.overall_percentile?.toFixed(0) || 50}% of applicants
                </p>
              </div>
              <div className="space-y-4">
                {application.skills_percentile !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Skills Percentile</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatPercentile(application.skills_percentile)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${application.skills_percentile}%` }}
                      />
                    </div>
                  </div>
                )}
                {application.experience_percentile !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Experience Percentile</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatPercentile(application.experience_percentile)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${application.experience_percentile}%` }}
                      />
                    </div>
                  </div>
                )}
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
                Skills extracted from your resume and matched to job requirements
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
                <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Personalized suggestions to improve your profile
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
                    Great job! You have a strong profile for this position.
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
