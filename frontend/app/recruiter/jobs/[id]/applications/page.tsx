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
  Briefcase,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor, stripMarkdown } from '@/lib/utils'

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
  const [navigatingToAnalytics, setNavigatingToAnalytics] = useState(false)

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading applications...</p>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-600 rounded-lg group-hover:shadow-md transition-shadow">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Bread
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.company_logo && (
                <img
                  src={user.company_logo}
                  alt={user.company_name || 'Company'}
                  className="h-6 w-6 rounded object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <span className="text-sm text-gray-600">
                {user?.company_name || user?.full_name}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Job Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
              <p className="text-gray-600 line-clamp-2">{stripMarkdown(job?.description || '')}</p>
            </div>
            <Button
              onClick={() => {
                setNavigatingToAnalytics(true)
                router.push(`/recruiter/jobs/${jobId}/analytics`)
              }}
              disabled={navigatingToAnalytics}
              className="gradient-bg text-white border-2 border-transparent shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {navigatingToAnalytics ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Applications</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Average Score</div>
              <div className="text-3xl font-bold text-amber-600">{stats.avgScore.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Shortlisted</div>
              <div className="text-3xl font-bold text-gray-900">{stats.shortlisted}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Pending</div>
              <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
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
              className="pl-11 h-12 border border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'date')}
                className="w-full appearance-none pl-4 pr-10 h-12 border border-gray-300 rounded-lg text-sm font-medium focus:border-amber-500 focus:ring-amber-500 bg-white cursor-pointer"
              >
                <option value="score">Sort by Score</option>
                <option value="date">Sort by Date</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={() => setShowGenerateDialog(true)}
                disabled={generating}
                variant="outline"
              >
                {generating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Test Data
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No candidates have applied yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <Card
                key={app.id}
                className="border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => router.push(`/recruiter/jobs/${jobId}/applications/${app.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-stretch justify-between gap-6">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Application #{app.id}
                          </h3>
                          {app.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          )}
                          {app.status === 'shortlisted' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Shortlisted
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Rejected
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          Applied {formatDate(app.applied_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {app.num_skills || 0} skills
                        </span>
                        {app.cluster_name && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            {app.cluster_name}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          {formatPercentile(app.overall_percentile || 50)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className={`text-3xl font-bold ${getScoreColor(app.final_score || 0)}`}>
                        {app.final_score?.toFixed(0) || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Score</div>
                      <Button
                        size="sm"
                        variant="outline"
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
          <Card className="w-full max-w-md border border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Test Applications</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                How many test applications would you like to generate? (1-50)
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Number of Applications
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                    className="h-12 border border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg text-center"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateRandom}
                    className="flex-1 gradient-bg text-white border-2 border-transparent shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
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
