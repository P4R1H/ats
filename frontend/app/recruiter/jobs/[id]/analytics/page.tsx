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
  Activity,
  Brain,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Gauge,
  Network,
  Calendar,
  Filter
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
  Radar,
  ComposedChart,
  Area,
  ReferenceLine
} from 'recharts'

export default function JobAnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnlyQualified, setShowOnlyQualified] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    distributions: true,
    patterns: true,
    insights: true,
    clusters: true,
    skills: true
  })

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const exportData = () => {
    const data = displayedApplications.map(app => ({
      score: app.final_score,
      percentile: app.overall_percentile,
      status: app.status,
      experience: app.experience_years,
      skills_count: app.num_skills,
      cluster: app.cluster_name,
      meets_requirements: app.meets_requirements
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_job_${jobId}.json`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Loading world-class analytics...</p>
        </div>
      </div>
    )
  }

  // TWO-STAGE SCORING: Requirements filtering
  const allApplications = applications
  const qualifiedApplications = applications.filter(app => app.meets_requirements !== false)
  const rejectedApplications = applications.filter(app => app.meets_requirements === false)

  // Filter based on toggle
  const displayedApplications = showOnlyQualified ? qualifiedApplications : allApplications

  // ==================== ANALYTICS CALCULATIONS ====================

  const totalApplications = allApplications.length
  const qualifiedCount = qualifiedApplications.length
  const rejectedCount = rejectedApplications.length
  const qualificationRate = totalApplications > 0
    ? ((qualifiedCount / totalApplications) * 100).toFixed(0)
    : 0

  const avgScore = displayedApplications.length > 0
    ? (displayedApplications.reduce((sum, app) => sum + (app.final_score || 0), 0) / displayedApplications.length).toFixed(1)
    : 0

  // Status counts
  const statusCounts = {
    pending: displayedApplications.filter(app => app.status === 'pending').length,
    shortlisted: displayedApplications.filter(app => app.status === 'shortlisted').length,
    rejected: displayedApplications.filter(app => app.status === 'rejected').length
  }

  // Quartile calculations
  const scores = displayedApplications.map(app => app.final_score || 0).sort((a, b) => a - b)
  const q1 = scores[Math.floor(scores.length * 0.25)] || 0
  const median = scores[Math.floor(scores.length * 0.50)] || 0
  const q3 = scores[Math.floor(scores.length * 0.75)] || 0
  const top25Count = displayedApplications.filter(app => (app.final_score || 0) >= q3).length

  // Score distribution with quartile markers
  const scoreDistribution = [
    { range: '0-20', count: 0, min: 0, max: 20, fill: '#ef4444' },
    { range: '20-40', count: 0, min: 20, max: 40, fill: '#f97316' },
    { range: '40-60', count: 0, min: 40, max: 60, fill: '#f59e0b' },
    { range: '60-80', count: 0, min: 60, max: 80, fill: '#84cc16' },
    { range: '80-100', count: 0, min: 80, max: 100, fill: '#10b981' }
  ]
  displayedApplications.forEach(app => {
    const score = app.final_score || 0
    if (score < 20) scoreDistribution[0].count++
    else if (score < 40) scoreDistribution[1].count++
    else if (score < 60) scoreDistribution[2].count++
    else if (score < 80) scoreDistribution[3].count++
    else scoreDistribution[4].count++
  })

  // Component percentiles distribution
  const componentPercentiles = [
    { component: 'Skills', value: 0, count: 0 },
    { component: 'Experience', value: 0, count: 0 },
    { component: 'Education', value: 0, count: 0 }
  ]
  displayedApplications.forEach(app => {
    componentPercentiles[0].value += (app.skills_percentile || 0)
    componentPercentiles[0].count++
    componentPercentiles[1].value += (app.experience_percentile || 0)
    componentPercentiles[1].count++
    componentPercentiles[2].value += (app.education_percentile || 0)
    componentPercentiles[2].count++
  })
  componentPercentiles.forEach(comp => {
    comp.value = comp.count > 0 ? Number((comp.value / comp.count).toFixed(1)) : 0
  })

  // Skills by category aggregation
  const skillsByCategoryAgg: Record<string, number> = {}
  displayedApplications.forEach(app => {
    if (app.skills_by_category && typeof app.skills_by_category === 'object') {
      Object.entries(app.skills_by_category).forEach(([category, count]) => {
        skillsByCategoryAgg[category] = (skillsByCategoryAgg[category] || 0) + (count as number)
      })
    }
  })
  const radarData = Object.entries(skillsByCategoryAgg)
    .map(([category, count]) => ({
      category,
      value: count,
      fullMark: Math.max(...Object.values(skillsByCategoryAgg)) * 1.2
    }))
    .slice(0, 8) // Top 8 categories

  // Cluster distribution with descriptions
  const clusterCounts: Record<string, { count: number; description: string; avgScore: number }> = {}
  displayedApplications.forEach(app => {
    if (app.cluster_name) {
      if (!clusterCounts[app.cluster_name]) {
        clusterCounts[app.cluster_name] = {
          count: 0,
          description: app.cluster_description || 'No description',
          avgScore: 0
        }
      }
      clusterCounts[app.cluster_name].count++
      clusterCounts[app.cluster_name].avgScore += (app.final_score || 0)
    }
  })
  Object.keys(clusterCounts).forEach(key => {
    clusterCounts[key].avgScore = clusterCounts[key].avgScore / clusterCounts[key].count
  })
  const clusterData = Object.entries(clusterCounts).map(([name, data]) => ({
    name,
    value: data.count,
    avgScore: Number(data.avgScore.toFixed(1)),
    description: data.description
  }))
  const CLUSTER_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e']

  // Experience vs Score scatter
  const scatterData = displayedApplications.map(app => ({
    experience: app.experience_years || 0,
    score: app.final_score || 0,
    cluster: app.cluster_name || 'Unknown',
    status: app.status
  }))

  // Top skills frequency
  const skillFrequency: Record<string, number> = {}
  displayedApplications.forEach(app => {
    if (app.extracted_skills && Array.isArray(app.extracted_skills)) {
      app.extracted_skills.forEach((skill: string) => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1
      })
    }
  })
  const topSkills = Object.entries(skillFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([skill, count]) => ({ skill, count }))

  // Success patterns - skills in shortlisted candidates
  const shortlistedApps = displayedApplications.filter(app => app.status === 'shortlisted')
  const shortlistedSkills: Record<string, number> = {}
  shortlistedApps.forEach(app => {
    if (app.extracted_skills && Array.isArray(app.extracted_skills)) {
      app.extracted_skills.forEach((skill: string) => {
        shortlistedSkills[skill] = (shortlistedSkills[skill] || 0) + 1
      })
    }
  })
  const topShortlistedSkills = Object.entries(shortlistedSkills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({
      skill,
      count,
      percentage: shortlistedApps.length > 0 ? ((count / shortlistedApps.length) * 100).toFixed(0) : 0
    }))

  // Experience success rate
  const experienceBuckets: Record<string, { total: number; shortlisted: number }> = {
    '0-2': { total: 0, shortlisted: 0 },
    '2-5': { total: 0, shortlisted: 0 },
    '5-8': { total: 0, shortlisted: 0 },
    '8+': { total: 0, shortlisted: 0 }
  }
  displayedApplications.forEach(app => {
    const exp = app.experience_years || 0
    const bucket = exp < 2 ? '0-2' : exp < 5 ? '2-5' : exp < 8 ? '5-8' : '8+'
    experienceBuckets[bucket].total++
    if (app.status === 'shortlisted') {
      experienceBuckets[bucket].shortlisted++
    }
  })
  const experienceSuccessData = Object.entries(experienceBuckets).map(([range, data]) => ({
    range,
    total: data.total,
    shortlisted: data.shortlisted,
    rate: data.total > 0 ? ((data.shortlisted / data.total) * 100).toFixed(0) : 0
  }))

  // Time series - applications over time
  const timeSeriesData: Record<string, number> = {}
  displayedApplications.forEach(app => {
    const date = new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    timeSeriesData[date] = (timeSeriesData[date] || 0) + 1
  })
  const timeSeriesChartData = Object.entries(timeSeriesData)
    .map(([date, count]) => ({ date, count }))
    .slice(-14) // Last 14 dates

  // Rejection reasons
  const rejectionReasonCounts: Record<string, number> = {}
  rejectedApplications.forEach(app => {
    if (app.missing_requirements && Array.isArray(app.missing_requirements)) {
      app.missing_requirements.forEach((reason: string) => {
        if (reason.toLowerCase().includes('skill')) {
          rejectionReasonCounts['Missing Required Skills'] = (rejectionReasonCounts['Missing Required Skills'] || 0) + 1
        } else if (reason.toLowerCase().includes('experience')) {
          rejectionReasonCounts['Insufficient Experience'] = (rejectionReasonCounts['Insufficient Experience'] || 0) + 1
        } else if (reason.toLowerCase().includes('education')) {
          rejectionReasonCounts['Education Below Minimum'] = (rejectionReasonCounts['Education Below Minimum'] || 0) + 1
        } else if (reason.toLowerCase().includes('certification')) {
          rejectionReasonCounts['Missing Certifications'] = (rejectionReasonCounts['Missing Certifications'] || 0) + 1
        } else if (reason.toLowerCase().includes('leadership')) {
          rejectionReasonCounts['Missing Leadership'] = (rejectionReasonCounts['Missing Leadership'] || 0) + 1
        }
      })
    }
  })
  const rejectionData = Object.entries(rejectionReasonCounts).map(([name, value]) => ({ name, value }))

  // Requirements effectiveness
  const requirementsEffectiveness = {
    tooStrict: qualificationRate < 20,
    balanced: qualificationRate >= 20 && qualificationRate <= 60,
    tooLenient: qualificationRate > 60
  }

  // Component breakdown
  const avgSkillsScore = displayedApplications.length > 0
    ? displayedApplications.reduce((sum, app) => sum + (app.skills_score || 0), 0) / displayedApplications.length
    : 0
  const avgExpScore = displayedApplications.length > 0
    ? displayedApplications.reduce((sum, app) => sum + (app.experience_score || 0), 0) / displayedApplications.length
    : 0
  const avgEduScore = displayedApplications.length > 0
    ? displayedApplications.reduce((sum, app) => sum + (app.education_score || 0), 0) / displayedApplications.length
    : 0
  const avgBonusScore = displayedApplications.length > 0
    ? displayedApplications.reduce((sum, app) => sum + (app.bonus_score || 0), 0) / displayedApplications.length
    : 0

  const componentData = [
    { component: 'Skills', score: Number(avgSkillsScore.toFixed(1)), max: 100 },
    { component: 'Experience', score: Number(avgExpScore.toFixed(1)), max: 100 },
    { component: 'Education', score: Number(avgEduScore.toFixed(1)), max: 100 },
    { component: 'Bonus', score: Number(avgBonusScore.toFixed(1)), max: 100 }
  ]

  // Correlation heatmap data
  const calculateCorrelation = (arr1: number[], arr2: number[]) => {
    const n = arr1.length
    if (n === 0) return 0
    const sum1 = arr1.reduce((a, b) => a + b, 0)
    const sum2 = arr2.reduce((a, b) => a + b, 0)
    const sum1Sq = arr1.reduce((a, b) => a + b * b, 0)
    const sum2Sq = arr2.reduce((a, b) => a + b * b, 0)
    const pSum = arr1.map((_, i) => arr1[i] * arr2[i]).reduce((a, b) => a + b, 0)

    const num = pSum - (sum1 * sum2 / n)
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))

    return den === 0 ? 0 : num / den
  }

  const skillsScores = displayedApplications.map(a => a.skills_score || 0)
  const expScores = displayedApplications.map(a => a.experience_score || 0)
  const eduScores = displayedApplications.map(a => a.education_score || 0)
  const finalScores = displayedApplications.map(a => a.final_score || 0)

  const correlations = [
    { x: 'Skills', y: 'Final Score', value: calculateCorrelation(skillsScores, finalScores) },
    { x: 'Experience', y: 'Final Score', value: calculateCorrelation(expScores, finalScores) },
    { x: 'Education', y: 'Final Score', value: calculateCorrelation(eduScores, finalScores) },
    { x: 'Skills', y: 'Experience', value: calculateCorrelation(skillsScores, expScores) },
    { x: 'Skills', y: 'Education', value: calculateCorrelation(skillsScores, eduScores) },
    { x: 'Experience', y: 'Education', value: calculateCorrelation(expScores, eduScores) }
  ]

  // Computed insights
  const insights = [
    {
      title: 'Top Quartile Threshold',
      value: `${q3.toFixed(1)}`,
      description: `Top 25% of candidates score above ${q3.toFixed(1)}`,
      icon: Award,
      color: 'amber'
    },
    {
      title: 'Median Score',
      value: median.toFixed(1),
      description: '50% of candidates score below this',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: statusCounts.shortlisted > 0 ? `${((statusCounts.shortlisted / displayedApplications.length) * 100).toFixed(0)}%` : '0%',
      description: `${statusCounts.shortlisted} candidates shortlisted`,
      icon: CheckCircle2,
      color: 'green'
    },
    {
      title: 'Avg Skill Diversity',
      value: displayedApplications.length > 0
        ? (displayedApplications.reduce((sum, app) => sum + (app.skill_diversity || 0), 0) / displayedApplications.length).toFixed(2)
        : '0',
      description: 'Breadth of candidate skill sets',
      icon: Sparkles,
      color: 'purple'
    }
  ]

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-amber-200 sticky top-0 bg-white/80 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Bread
            </span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm border-amber-200 hover:bg-amber-50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(`/recruiter/jobs/${jobId}/applications`)}
              className="mb-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                ML Analytics Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 ml-14">
              {job?.title} • Foundation of Data Science Analytics
            </p>
          </div>
          {totalApplications > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="flex items-center gap-2 p-1 bg-white rounded-xl shadow-md border border-amber-200">
                <button
                  onClick={() => setShowOnlyQualified(false)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    !showOnlyQualified
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Applications ({totalApplications})
                </button>
                <button
                  onClick={() => setShowOnlyQualified(true)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    showOnlyQualified
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Qualified Only ({qualifiedCount})
                </button>
              </div>
            </div>
          )}
        </div>

        {applications.length === 0 ? (
          <Card className="border-2 border-amber-200 shadow-xl bg-white">
            <CardContent className="py-20 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Data Yet</h3>
              <p className="text-gray-600 text-lg">
                Analytics will appear once candidates apply to this job.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* ==================== KEY METRICS ==================== */}
            <section>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Apps</span>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      {totalApplications}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Qualified</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-700">{qualifiedCount}</span>
                      <span className="text-sm font-medium text-green-600">({qualificationRate}%)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Score</span>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                      {avgScore}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Shortlisted</span>
                    </div>
                    <span className="text-4xl font-bold text-purple-700">{statusCounts.shortlisted}</span>
                  </CardContent>
                </Card>

                <Card className="border-2 border-pink-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-pink-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-5 w-5 text-pink-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Clusters</span>
                    </div>
                    <span className="text-4xl font-bold text-pink-700">{Object.keys(clusterCounts).length}</span>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ==================== FDS INSIGHTS ==================== */}
            <section>
              <button
                onClick={() => toggleSection('insights')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Data Science Insights</h2>
                </div>
                {expandedSections.insights ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.insights && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {insights.map((insight, idx) => {
                    const Icon = insight.icon
                    const colorClasses = {
                      amber: 'from-amber-500 to-orange-500 border-amber-200',
                      blue: 'from-blue-500 to-cyan-500 border-blue-200',
                      green: 'from-green-500 to-emerald-500 border-green-200',
                      purple: 'from-purple-500 to-pink-500 border-purple-200'
                    }[insight.color]
                    return (
                      <Card key={idx} className={`border-2 ${colorClasses.split(' ')[1]} shadow-lg hover:shadow-xl transition-all duration-300 bg-white`}>
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.split(' ')[0]} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">{insight.title}</h3>
                          <p className="text-3xl font-bold text-gray-900 mb-2">{insight.value}</p>
                          <p className="text-xs text-gray-500">{insight.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </section>

            {/* ==================== OVERVIEW SECTION ==================== */}
            <section>
              <button
                onClick={() => toggleSection('overview')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Two-Stage Filter Overview</h2>
                </div>
                {expandedSections.overview ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.overview && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Requirements Effectiveness */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Gauge className="h-6 w-6 text-amber-600" />
                        <h3 className="text-xl font-bold text-gray-900">Requirements Effectiveness</h3>
                      </div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-48 h-48">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="96"
                              cy="96"
                              r="80"
                              stroke="#f3f4f6"
                              strokeWidth="16"
                              fill="none"
                            />
                            <circle
                              cx="96"
                              cy="96"
                              r="80"
                              stroke={requirementsEffectiveness.tooStrict ? '#ef4444' : requirementsEffectiveness.balanced ? '#10b981' : '#f59e0b'}
                              strokeWidth="16"
                              fill="none"
                              strokeDasharray={`${(Number(qualificationRate) / 100) * 502.4} 502.4`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-gray-900">{qualificationRate}%</span>
                            <span className="text-sm text-gray-600">Qualify</span>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl border-2 ${
                        requirementsEffectiveness.tooStrict
                          ? 'bg-red-50 border-red-200'
                          : requirementsEffectiveness.balanced
                          ? 'bg-green-50 border-green-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          {requirementsEffectiveness.tooStrict ? (
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          ) : requirementsEffectiveness.balanced ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-semibold text-sm ${
                              requirementsEffectiveness.tooStrict
                                ? 'text-red-900'
                                : requirementsEffectiveness.balanced
                                ? 'text-green-900'
                                : 'text-amber-900'
                            }`}>
                              {requirementsEffectiveness.tooStrict
                                ? 'Requirements May Be Too Strict'
                                : requirementsEffectiveness.balanced
                                ? 'Well-Balanced Requirements'
                                : 'Requirements May Be Too Lenient'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {requirementsEffectiveness.tooStrict
                                ? 'Consider relaxing some requirements to expand talent pool'
                                : requirementsEffectiveness.balanced
                                ? 'Good balance between quality and quantity of candidates'
                                : 'Consider tightening requirements for better candidate quality'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rejection Reasons */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Filter className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-bold text-gray-900">Stage 1 Rejection Reasons</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Why {rejectedCount} candidates failed requirements check
                      </p>
                      {rejectionData.length === 0 ? (
                        <div className="flex items-center justify-center h-80">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="text-lg text-gray-700 font-semibold">All candidates met requirements!</p>
                            <p className="text-sm text-gray-500 mt-2">No rejections to analyze</p>
                          </div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={350}>
                          <RechartsPie>
                            <Pie
                              data={rejectionData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name.split(' ').slice(-1)[0]}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {rejectionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16'][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPie>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            {/* ==================== DISTRIBUTIONS ==================== */}
            <section>
              <button
                onClick={() => toggleSection('distributions')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Score Distributions</h2>
                </div>
                {expandedSections.distributions ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.distributions && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Talent Pool Quality */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Talent Pool Quality</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Distribution with quartile markers</p>
                      <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={scoreDistribution}>
                          <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="range" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '2px solid #fbbf24', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <ReferenceLine y={q1} label={`Q1: ${q1.toFixed(1)}`} stroke="#3b82f6" strokeDasharray="3 3" />
                          <ReferenceLine y={median} label={`Median: ${median.toFixed(1)}`} stroke="#10b981" strokeDasharray="3 3" />
                          <ReferenceLine y={q3} label={`Q3: ${q3.toFixed(1)}`} stroke="#8b5cf6" strokeDasharray="3 3" />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Component Percentiles */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Gauge className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">Component Percentiles</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Average candidate performance by component</p>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={componentPercentiles} layout="horizontal">
                          <defs>
                            <linearGradient id="percentileGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="component" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <YAxis domain={[0, 100]} stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '2px solid #a855f7', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="value" fill="url(#percentileGradient)" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#6b7280', fontWeight: 600 }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Experience vs Score Scatter */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white lg:col-span-2">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Experience vs ML Score Analysis</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Job-relative scoring: Candidates near min_experience ({job?.min_experience || 0} years) score highest
                      </p>
                      <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            type="number"
                            dataKey="experience"
                            name="Experience"
                            label={{ value: 'Years of Experience', position: 'insideBottom', offset: -20, style: { fontWeight: 600, fill: '#6b7280' } }}
                            stroke="#6b7280"
                          />
                          <YAxis
                            type="number"
                            dataKey="score"
                            name="Score"
                            label={{ value: 'ML Score', angle: -90, position: 'insideLeft', style: { fontWeight: 600, fill: '#6b7280' } }}
                            stroke="#6b7280"
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <Scatter data={scatterData} fill="#3b82f6" opacity={0.7} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            {/* ==================== SUCCESS PATTERNS ==================== */}
            <section>
              <button
                onClick={() => toggleSection('patterns')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Success Patterns</h2>
                </div>
                {expandedSections.patterns ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.patterns && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Skills in Shortlisted Candidates */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Award className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">Top Skills in Shortlisted</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Skills appearing most in shortlisted candidates ({shortlistedApps.length} total)
                      </p>
                      {topShortlistedSkills.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No shortlisted candidates yet</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={topShortlistedSkills} layout="vertical">
                            <defs>
                              <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                            <YAxis dataKey="skill" type="category" width={120} stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'white', border: '2px solid #10b981', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="count" fill="url(#successGradient)" radius={[0, 8, 8, 0]} label={{ position: 'right', fill: '#6b7280', fontWeight: 600 }} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  {/* Experience Success Rate */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-6 w-6 text-amber-600" />
                        <h3 className="text-xl font-bold text-gray-900">Success Rate by Experience</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Shortlist rate across experience ranges
                      </p>
                      <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={experienceSuccessData}>
                          <defs>
                            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="range" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#10b981" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '2px solid #f59e0b', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="total" fill="url(#totalGradient)" radius={[8, 8, 0, 0]} name="Total Candidates" />
                          <Bar yAxisId="left" dataKey="shortlisted" fill="#10b981" radius={[8, 8, 0, 0]} name="Shortlisted" />
                          <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={3} name="Success Rate %" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Time Series */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white lg:col-span-2">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Calendar className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">Applications Over Time</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Daily application trends (last 14 periods)
                      </p>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={timeSeriesChartData}>
                          <defs>
                            <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '2px solid #8b5cf6', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fill="url(#timeGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            {/* ==================== SKILLS & CLUSTERS ==================== */}
            <section>
              <button
                onClick={() => toggleSection('skills')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Skills & Talent Analysis</h2>
                </div>
                {expandedSections.skills ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.skills && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Skills by Category Radar */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Network className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Skills by Category</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Distribution of candidate skills across categories
                      </p>
                      {radarData.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No skill category data available</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="category" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                            <PolarRadiusAxis stroke="#6b7280" />
                            <Radar
                              name="Skills"
                              dataKey="value"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.6}
                              strokeWidth={2}
                            />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Skills Bar */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-6 w-6 text-amber-600" />
                        <h3 className="text-xl font-bold text-gray-900">Most Common Skills</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Top skills across all candidates
                      </p>
                      {topSkills.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No skill data available</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={topSkills} layout="vertical">
                            <defs>
                              <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#f97316" stopOpacity={0.8} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                            <YAxis dataKey="skill" type="category" width={100} stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'white', border: '2px solid #f59e0b', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="count" fill="url(#skillGradient)" radius={[0, 8, 8, 0]} label={{ position: 'right', fill: '#6b7280', fontWeight: 600 }} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            {/* ==================== TALENT CLUSTERS ==================== */}
            <section>
              <button
                onClick={() => toggleSection('clusters')}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <Network className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Talent Clusters</h2>
                </div>
                {expandedSections.clusters ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.clusters && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Cluster Distribution Pie */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <PieChart className="h-6 w-6 text-pink-600" />
                        <h3 className="text-xl font-bold text-gray-900">Cluster Distribution</h3>
                      </div>
                      {clusterData.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No cluster data</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPie>
                            <Pie
                              data={clusterData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={90}
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

                  {/* Cluster Details */}
                  <Card className="border-2 border-amber-200 shadow-lg bg-white lg:col-span-2">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Award className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">Cluster Insights</h3>
                      </div>
                      {clusterData.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No cluster data available</p>
                      ) : (
                        <div className="space-y-4">
                          {clusterData.map((cluster, idx) => (
                            <div
                              key={idx}
                              className="p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                              style={{ borderColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] + '40', backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] + '08' }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}
                                  />
                                  <h4 className="font-bold text-gray-900 text-lg">{cluster.name}</h4>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-xs text-gray-600">Count</p>
                                    <p className="text-lg font-bold text-gray-900">{cluster.value}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-600">Avg Score</p>
                                    <p className="text-lg font-bold" style={{ color: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}>
                                      {cluster.avgScore}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{cluster.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            {/* ==================== STATISTICAL ANALYSIS ==================== */}
            <section>
              <Card className="border-2 border-amber-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Correlation Analysis</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-8">
                    Statistical relationships between score components (qualified candidates only)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {correlations.map((corr, idx) => {
                      const absValue = Math.abs(corr.value)
                      const strength = absValue > 0.7 ? 'Strong' : absValue > 0.4 ? 'Moderate' : 'Weak'
                      const colorClass = absValue > 0.7 ? 'from-green-500 to-emerald-600' : absValue > 0.4 ? 'from-amber-500 to-orange-500' : 'from-gray-400 to-gray-500'
                      return (
                        <div key={idx} className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                          <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">{corr.x} × {corr.y}</p>
                          <p className={`text-3xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent mb-1`}>
                            {corr.value.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{strength}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong className="font-bold">Two-Stage System:</strong> Correlation analysis includes only candidates who passed Stage 1 (requirements check).
                      Our job-relative scoring in Stage 2 ensures skills match and role fit drive rankings, not just raw experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ==================== APPLICATION STATUS ==================== */}
            <section>
              <Card className="border-2 border-amber-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Application Status Overview</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-bold text-amber-600 mb-3">{statusCounts.pending}</div>
                      <div className="text-base font-semibold text-gray-700 mb-2">Pending Review</div>
                      <div className="text-sm text-gray-600">
                        {((statusCounts.pending / displayedApplications.length) * 100).toFixed(0)}% of pool
                      </div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-bold text-green-600 mb-3">{statusCounts.shortlisted}</div>
                      <div className="text-base font-semibold text-gray-700 mb-2">Shortlisted</div>
                      <div className="text-sm text-gray-600">
                        {((statusCounts.shortlisted / displayedApplications.length) * 100).toFixed(0)}% of pool
                      </div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-300 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl font-bold text-gray-600 mb-3">{statusCounts.rejected}</div>
                      <div className="text-base font-semibold text-gray-700 mb-2">Rejected</div>
                      <div className="text-sm text-gray-600">
                        {((statusCounts.rejected / displayedApplications.length) * 100).toFixed(0)}% of pool
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
