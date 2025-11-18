'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Wheat,
  ArrowLeft,
  Users,
  Search,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  BarChart3,
  Star,
  Briefcase
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor } from '@/lib/utils'

export default function JobApplicationsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApps, setFilteredApps] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [generateCount, setGenerateCount] = useState(5)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...applications]

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cluster_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'score') {
      filtered.sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
    } else {
      filtered.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    }

    setFilteredApps(filtered)
  }, [searchTerm, sortBy, applications])

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
      setFilteredApps(jobApps)
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

  const handleUpdateStatus = async (applicationId: number, newStatus: string) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus)
      // Reload data
      const jobApps = await api.getApplicationsForJob(jobId)
      setApplications(jobApps)
    } catch (error: any) {
      alert('Failed to update status: ' + error.message)
    }
  }

  const handleGenerateRandom = async () => {
    if (generateCount < 1 || generateCount > 50) {
      alert('Please enter a number between 1 and 50')
      return
    }

    setShowGenerateDialog(false)
    setGenerating(true)
    try {
      const result = await api.generateRandomApplication(parseInt(jobId), generateCount)
      // Reload data
      const jobApps = await api.getApplicationsForJob(jobId)
      setApplications(jobApps)
      alert(result.message || `Generated ${generateCount} test application(s) successfully!`)
    } catch (error: any) {
      alert('Failed to generate applications: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-gray-700">Loading applications...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    avgScore: applications.length > 0
      ? applications.reduce((sum, a) => sum + (a.final_score || 0), 0) / applications.length
      : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
      {/* Header */}
      <header className="border-b border-amber-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-lg transition-all">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Bread
            </span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm border-gray-300 hover:border-amber-400 hover:text-amber-600">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Job Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">{job?.title}</h1>
              </div>
              <p className="text-lg text-gray-600 line-clamp-2 ml-14">{job?.description}</p>
            </div>
            <Button
              onClick={() => router.push(`/recruiter/jobs/${jobId}/analytics`)}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              ML Analytics Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Total</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">Applications</div>
              <div className="text-xs text-gray-500">
                {stats.pending} pending · {stats.shortlisted} shortlisted
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>
                    {stats.avgScore.toFixed(1)}
                  </div>
                  <div className="text-xs font-medium text-gray-500 mt-1">/ 100</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">Average Score</div>
              <div className="text-xs text-gray-500">
                Across all candidates
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{stats.shortlisted}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Success</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">Shortlisted</div>
              {stats.total > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  {((stats.shortlisted / stats.total) * 100).toFixed(0)}% success rate
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Pending</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">Awaiting Review</div>
              {stats.total > 0 && (
                <div className="text-xs text-gray-500">
                  {((stats.pending / stats.total) * 100).toFixed(0)}% unreviewed
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex-1 relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border-2 border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'date')}
              className="flex-1 md:flex-none px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-amber-500 focus:ring-amber-500"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
            </select>
            <Button
              size="lg"
              onClick={() => setShowGenerateDialog(true)}
              disabled={generating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Test Data
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardContent className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No applications found</h3>
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'Try adjusting your search terms' : 'No candidates have applied yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card
                key={app.id}
                className="border-2 border-gray-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
                onClick={() => router.push(`/recruiter/jobs/${jobId}/applications/${app.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Score Display */}
                    <div className="flex flex-col items-center justify-center min-w-[90px]">
                      <div className={`text-4xl font-bold ${getScoreColor(app.final_score || 0)} mb-1`}>
                        {app.final_score?.toFixed(0) || 'N/A'}
                      </div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${app.final_score || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-20 w-px bg-gray-200"></div>

                    {/* Application Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-lg transition-shadow">
                            <Briefcase className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            Application #{app.id}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(app.applied_at)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {app.cluster_name && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                            <Star className="h-3.5 w-3.5 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700">{app.cluster_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                          <Award className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">{app.num_skills || 0} skills</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                          <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">{formatPercentile(app.overall_percentile || 50)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-20 w-px bg-gray-200"></div>

                    {/* Status */}
                    <div className="flex flex-col items-center gap-2 min-w-[140px]">
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold border-2 border-amber-200">
                          <Clock className="h-4 w-4 mr-2" />
                          Pending
                        </span>
                      )}
                      {app.status === 'shortlisted' && (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold border-2 border-green-200">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Shortlisted
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold border-2 border-gray-200">
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejected
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/recruiter/jobs/${jobId}/applications/${app.id}`)
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Generate Applications Dialog */}
      {showGenerateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-2 border-amber-200 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Generate Test Applications</h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                How many test applications would you like to generate? (1-50)
              </p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-3">
                    Number of Applications
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                    className="h-14 text-xl border-2 border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl text-center font-bold"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateDialog(false)}
                    className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50"
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateRandom}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate {generateCount}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
