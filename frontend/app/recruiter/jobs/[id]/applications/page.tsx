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
  TrendingUp
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
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{job?.title}</h1>
          <p className="text-gray-600 line-clamp-2">{job?.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="text-xs font-medium text-gray-600">Total Applications</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <div className="text-xs font-medium text-gray-600">Pending</div>
              </div>
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="text-xs font-medium text-gray-600">Shortlisted</div>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.shortlisted}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-gray-600" />
                <div className="text-xs font-medium text-gray-600">Rejected</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.rejected}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div className="text-xs font-medium text-gray-600">Avg Score</div>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by candidate name or cluster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Button
              size="sm"
              variant={sortBy === 'score' ? 'default' : 'outline'}
              onClick={() => setSortBy('score')}
              className={sortBy === 'score' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' : ''}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Score
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'date' ? 'default' : 'outline'}
              onClick={() => setSortBy('date')}
              className={sortBy === 'date' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' : ''}
            >
              <Clock className="h-4 w-4 mr-2" />
              Date
            </Button>
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
                className="border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Score */}
                    <div className="text-center min-w-[80px]">
                      <div className={`text-4xl font-bold mb-1 ${getScoreColor(app.final_score || 0)}`}>
                        {app.final_score?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">out of 100</div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Application #{app.id}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(app.applied_at)}
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-700">{formatPercentile(app.overall_percentile || 50)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{app.num_skills || 0} skills matched</span>
                        </div>
                        {app.cluster_name && (
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {app.cluster_name}
                          </span>
                        )}
                      </div>

                      {/* Matched Skills */}
                      {app.matched_skills && app.matched_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {app.matched_skills.slice(0, 5).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-green-100 text-green-900 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {app.matched_skills.length > 5 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              +{app.matched_skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <div>
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                        {app.status === 'shortlisted' && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Shortlisted
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {app.status !== 'shortlisted' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Shortlist
                          </Button>
                        )}
                        {app.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
