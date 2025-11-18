'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, Briefcase,
  Award, Target, Sparkles, BarChart3, Star
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor, stripMarkdown } from '@/lib/utils'

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [currentUser, myApps, availableJobs] = await Promise.all([
        api.getCurrentUser(),
        api.getMyApplications(),
        api.getJobs()
      ])

      setUser(currentUser)
      setApplications(myApps)
      setJobs(availableJobs)
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
          <p className="text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingCount = applications.filter(a => a.status === 'pending').length
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length
  const rejectedCount = applications.filter(a => a.status === 'rejected').length
  const avgScore = applications.length > 0
    ? applications.reduce((sum, a) => sum + (a.final_score || 0), 0) / applications.length
    : 0

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
            <span className="text-sm text-gray-600">
              {user?.full_name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-gray-600">
              Track your applications and discover new opportunities
            </p>
          </div>
          <Button
            onClick={() => router.push('/candidate/recommendations')}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get Recommendations
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Applications</div>
              <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Under Review</div>
              <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Shortlisted</div>
              <div className="text-3xl font-bold text-amber-600">{shortlistedCount}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Open Positions</div>
              <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* My Applications Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            {applications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/candidate/jobs')}
                className="text-gray-600 hover:text-gray-900"
              >
                Browse more jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {applications.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Browse our open positions and apply to roles that match your skills.
                </p>
                <Button
                  onClick={() => router.push('/candidate/jobs')}
                  className="gradient-bg text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Open Positions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                  onClick={() => router.push(`/candidate/applications/${app.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-stretch justify-between gap-6">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {app.job_title || `Job #${app.job_id}`}
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
                                Not Selected
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
                            router.push(`/candidate/applications/${app.id}`)
                          }}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Browse Jobs */}
        {jobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/candidate/jobs')}
                className="text-gray-600 hover:text-gray-900"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <Card
                  key={job.id}
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => router.push('/candidate/jobs')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1 flex-1">
                        {job.title}
                      </h3>
                      {job.company_name && (
                        <div className="flex items-center gap-2 ml-3">
                          {job.company_logo && (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="h-8 w-8 rounded object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                            {job.company_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {stripMarkdown(job.description)}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.category}</span>
                      {applications.some(app => app.job_id === job.id) ? (
                        <Button
                          disabled
                          className="bg-amber-50 text-amber-600 cursor-not-allowed opacity-60"
                          size="sm"
                        >
                          Applied
                        </Button>
                      ) : (
                        <Button className="gradient-bg text-white shadow-lg hover:shadow-xl transition-all" size="sm">
                          View & Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
