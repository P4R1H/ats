'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat,
  ArrowLeft,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react'
import { api } from '@/lib/api'

export default function JobAnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [currentUser, jobData, jobApps] = await Promise.all([
        api.getCurrentUser(),
        api.getJob(jobId),
        api.getApplicationsForJob(jobId)
      ])

      setUser(currentUser)
      setJob(jobData)
      setApplications(jobApps)
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
          <p className="text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Calculate analytics
  const totalApplications = applications.length
  const avgScore = applications.length > 0
    ? (applications.reduce((sum, app) => sum + (app.final_score || 0), 0) / applications.length).toFixed(1)
    : 0

  // Score distribution (buckets: 0-20, 20-40, 40-60, 60-80, 80-100)
  const scoreBuckets = {
    '0-20': 0,
    '20-40': 0,
    '40-60': 0,
    '60-80': 0,
    '80-100': 0
  }
  applications.forEach(app => {
    const score = app.final_score || 0
    if (score < 20) scoreBuckets['0-20']++
    else if (score < 40) scoreBuckets['20-40']++
    else if (score < 60) scoreBuckets['40-60']++
    else if (score < 80) scoreBuckets['60-80']++
    else scoreBuckets['80-100']++
  })
  const maxBucket = Math.max(...Object.values(scoreBuckets))

  // Cluster distribution
  const clusterCounts: Record<string, number> = {}
  applications.forEach(app => {
    if (app.cluster_name) {
      clusterCounts[app.cluster_name] = (clusterCounts[app.cluster_name] || 0) + 1
    }
  })
  const totalClustered = Object.values(clusterCounts).reduce((sum, count) => sum + count, 0)

  // Status distribution
  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  // Skills analysis - most common skills
  const skillFrequency: Record<string, number> = {}
  applications.forEach(app => {
    if (app.extracted_skills && Array.isArray(app.extracted_skills)) {
      app.extracted_skills.forEach((skill: string) => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1
      })
    }
  })
  const topSkills = Object.entries(skillFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
  const maxSkillCount = topSkills.length > 0 ? topSkills[0][1] : 1

  // Experience distribution
  const experienceBuckets = {
    '0-2': 0,
    '2-5': 0,
    '5-10': 0,
    '10+': 0
  }
  applications.forEach(app => {
    const exp = app.experience_years || 0
    if (exp < 2) experienceBuckets['0-2']++
    else if (exp < 5) experienceBuckets['2-5']++
    else if (exp < 10) experienceBuckets['5-10']++
    else experienceBuckets['10+']++
  })
  const maxExpBucket = Math.max(...Object.values(experienceBuckets))

  // Education distribution
  const educationCounts: Record<string, number> = {}
  applications.forEach(app => {
    if (app.education_level) {
      educationCounts[app.education_level] = (educationCounts[app.education_level] || 0) + 1
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(`/recruiter/jobs/${jobId}/applications`)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ML Analytics Dashboard</h1>
            <p className="text-lg text-gray-600">
              {job?.title} • Data Science-Powered Insights
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
              <p className="text-gray-600">
                Analytics will appear once candidates apply to this job.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{totalApplications}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">{avgScore}</span>
                  </div>
                  <p className="text-sm text-gray-600">Average ML Score</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    <span className="text-2xl font-bold text-gray-900">{statusCounts.shortlisted}</span>
                  </div>
                  <p className="text-sm text-gray-600">Shortlisted</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-900">{Object.keys(clusterCounts).length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Talent Clusters</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Score Distribution */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">ML Score Distribution</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Distribution of final ML-generated scores across all applicants
                  </p>
                  <div className="space-y-4">
                    {Object.entries(scoreBuckets).map(([range, count]) => (
                      <div key={range}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{range}</span>
                          <span className="text-sm font-bold text-blue-600">{count} ({((count / totalApplications) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${maxBucket > 0 ? (count / maxBucket) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cluster Distribution */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Talent Cluster Analysis</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    ML-based clustering of candidates by skills and experience
                  </p>
                  {Object.keys(clusterCounts).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No cluster data available</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(clusterCounts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([cluster, count]) => {
                          const percentage = ((count / totalClustered) * 100).toFixed(1)
                          const colors: Record<string, string> = {
                            'Highly Skilled Early Career': 'from-purple-500 to-pink-500',
                            'Mid-Level Professional': 'from-blue-500 to-cyan-500',
                            'Senior Expert': 'from-amber-500 to-orange-500',
                            'Entry Level': 'from-green-500 to-emerald-500',
                            'Specialized Professional': 'from-red-500 to-rose-500'
                          }
                          const gradient = colors[cluster] || 'from-gray-500 to-gray-600'

                          return (
                            <div key={cluster}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{cluster}</span>
                                <span className="text-sm font-bold text-purple-600">{count} ({percentage}%)</span>
                              </div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Experience Distribution */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Experience Distribution</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Years of experience across applicant pool
                  </p>
                  <div className="space-y-4">
                    {Object.entries(experienceBuckets).map(([range, count]) => (
                      <div key={range}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{range} years</span>
                          <span className="text-sm font-bold text-green-600">{count} ({((count / totalApplications) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${maxExpBucket > 0 ? (count / maxExpBucket) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Top Skills in Pool</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Most frequently appearing skills across all resumes
                  </p>
                  {topSkills.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No skill data available</p>
                  ) : (
                    <div className="space-y-4">
                      {topSkills.map(([skill, count]) => (
                        <div key={skill}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                            <span className="text-sm font-bold text-amber-600">{count} candidates</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                              style={{ width: `${(count / maxSkillCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Application Status */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Application Status Breakdown</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Current status of all applications in the pipeline
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-4xl font-bold text-amber-600 mb-2">{statusCounts.pending}</div>
                    <div className="text-sm text-gray-600">Pending Review</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((statusCounts.pending / totalApplications) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-4xl font-bold text-green-600 mb-2">{statusCounts.shortlisted}</div>
                    <div className="text-sm text-gray-600">Shortlisted</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((statusCounts.shortlisted / totalApplications) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-4xl font-bold text-gray-600 mb-2">{statusCounts.rejected}</div>
                    <div className="text-sm text-gray-600">Rejected</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((statusCounts.rejected / totalApplications) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
