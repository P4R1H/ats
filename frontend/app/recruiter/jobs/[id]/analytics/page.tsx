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
  Award,
  Activity
} from 'lucide-react'
import { api } from '@/lib/api'
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

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

  // Score distribution for bar chart
  const scoreBuckets = [
    { range: '0-20', count: 0, min: 0, max: 20 },
    { range: '20-40', count: 0, min: 20, max: 40 },
    { range: '40-60', count: 0, min: 40, max: 60 },
    { range: '60-80', count: 0, min: 60, max: 80 },
    { range: '80-100', count: 0, min: 80, max: 100 }
  ]
  applications.forEach(app => {
    const score = app.final_score || 0
    if (score < 20) scoreBuckets[0].count++
    else if (score < 40) scoreBuckets[1].count++
    else if (score < 60) scoreBuckets[2].count++
    else if (score < 80) scoreBuckets[3].count++
    else scoreBuckets[4].count++
  })

  // Cluster distribution for pie chart
  const clusterCounts: Record<string, number> = {}
  applications.forEach(app => {
    if (app.cluster_name) {
      clusterCounts[app.cluster_name] = (clusterCounts[app.cluster_name] || 0) + 1
    }
  })
  const clusterData = Object.entries(clusterCounts).map(([name, value]) => ({ name, value }))
  const CLUSTER_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

  // Status distribution
  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  // Experience vs Score scatter data
  const scatterData = applications.map(app => ({
    experience: app.experience_years || 0,
    score: app.final_score || 0,
    cluster: app.cluster_name || 'Unknown'
  }))

  // Skills frequency
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
    .map(([skill, count]) => ({ skill, count }))

  // Component breakdown - average scores
  const avgSkillsScore = applications.length > 0
    ? applications.reduce((sum, app) => sum + (app.skills_score || 0), 0) / applications.length
    : 0
  const avgExpScore = applications.length > 0
    ? applications.reduce((sum, app) => sum + (app.experience_score || 0), 0) / applications.length
    : 0
  const avgEduScore = applications.length > 0
    ? applications.reduce((sum, app) => sum + (app.education_score || 0), 0) / applications.length
    : 0
  const avgBonusScore = applications.length > 0
    ? applications.reduce((sum, app) => sum + (app.bonus_score || 0), 0) / applications.length
    : 0

  const componentData = [
    { component: 'Skills', score: Number(avgSkillsScore.toFixed(1)) },
    { component: 'Experience', score: Number(avgExpScore.toFixed(1)) },
    { component: 'Education', score: Number(avgEduScore.toFixed(1)) },
    { component: 'Bonus', score: Number(avgBonusScore.toFixed(1)) }
  ]

  // Correlation calculation (simplified)
  const calculateCorrelation = (arr1: number[], arr2: number[]) => {
    const n = arr1.length
    const sum1 = arr1.reduce((a, b) => a + b, 0)
    const sum2 = arr2.reduce((a, b) => a + b, 0)
    const sum1Sq = arr1.reduce((a, b) => a + b * b, 0)
    const sum2Sq = arr2.reduce((a, b) => a + b * b, 0)
    const pSum = arr1.map((_, i) => arr1[i] * arr2[i]).reduce((a, b) => a + b, 0)

    const num = pSum - (sum1 * sum2 / n)
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))

    return den === 0 ? 0 : num / den
  }

  const skillsScores = applications.map(a => a.skills_score || 0)
  const expScores = applications.map(a => a.experience_score || 0)
  const eduScores = applications.map(a => a.education_score || 0)
  const finalScores = applications.map(a => a.final_score || 0)

  const correlations = {
    'Skills-Final': calculateCorrelation(skillsScores, finalScores),
    'Experience-Final': calculateCorrelation(expScores, finalScores),
    'Education-Final': calculateCorrelation(eduScores, finalScores),
    'Skills-Experience': calculateCorrelation(skillsScores, expScores)
  }

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
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-600">Applications</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{totalApplications}</span>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">Avg Score</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{avgScore}</span>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-gray-600">Shortlisted</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{statusCounts.shortlisted}</span>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-gray-600">Clusters</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{Object.keys(clusterCounts).length}</span>
                </CardContent>
              </Card>
            </div>

            {/* Experience vs Score Scatter Plot */}
            <Card className="border border-gray-200 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Experience vs ML Score</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Visualizing our job-relative scoring curve • Candidates near min_experience ({job?.min_experience || 0} years) score highest
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      dataKey="experience"
                      name="Experience (years)"
                      label={{ value: 'Years of Experience', position: 'insideBottom', offset: -10 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      type="number"
                      dataKey="score"
                      name="ML Score"
                      label={{ value: 'ML Score', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                              <p className="text-xs font-medium text-gray-900">{payload[0].payload.cluster}</p>
                              <p className="text-xs text-gray-600">Experience: {payload[0].payload.experience} years</p>
                              <p className="text-xs text-gray-600">Score: {payload[0].payload.score.toFixed(1)}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter data={scatterData} fill="#3b82f6" opacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Score Distribution */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Score Distribution</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={scoreBuckets}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="range" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const pct = ((payload[0].value as number / totalApplications) * 100).toFixed(0)
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                <p className="text-xs font-medium text-gray-900">{payload[0].payload.range}</p>
                                <p className="text-xs text-blue-600">{payload[0].value} candidates ({pct}%)</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Talent Clusters Pie Chart */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Talent Clusters</h2>
                  </div>
                  {clusterData.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No cluster data available</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie>
                        <Pie
                          data={clusterData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {clusterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[index % CLUSTER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Component Breakdown */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Avg Component Scores</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={componentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                      <YAxis dataKey="component" type="category" stroke="#6b7280" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                <p className="text-xs font-medium text-gray-900">{payload[0].payload.component}</p>
                                <p className="text-xs text-green-600">Average: {payload[0].value}/100</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Skills */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Top Skills</h2>
                  </div>
                  {topSkills.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No skill data available</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={topSkills} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis dataKey="skill" type="category" width={100} stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Statistical Insights */}
            <Card className="border border-gray-200 bg-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Statistical Insights</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Correlation analysis showing relationships between score components and final scores
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(correlations).map(([key, value]) => {
                    const absValue = Math.abs(value)
                    const strength = absValue > 0.7 ? 'Strong' : absValue > 0.4 ? 'Moderate' : 'Weak'
                    const color = absValue > 0.7 ? 'text-green-600' : absValue > 0.4 ? 'text-amber-600' : 'text-gray-600'
                    return (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">{key}</p>
                        <p className={`text-2xl font-bold ${color}`}>{value.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">{strength} correlation</p>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Interpretation:</strong> Correlation values range from -1 to 1. Values closer to 1 or -1 indicate stronger relationships.
                    Our job-relative scoring system ensures skills match (not just total experience) drives final scores.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
                </div>
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
