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
import { formatDate, formatPercentile, getScoreColor } from '@/lib/utils'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-gray-700">Loading your dashboard...</p>
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
            <span className="text-sm font-medium text-gray-700">
              {user?.full_name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-sm border-gray-300 hover:border-amber-400 hover:text-amber-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-14">
            Track your progress and discover new opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Total</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Applications</div>
              {avgScore > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Avg Score: <span className={`font-semibold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Pending</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Under Review</div>
              {applications.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {((pendingCount / applications.length) * 100).toFixed(0)}% of total
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{shortlistedCount}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Success</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Shortlisted</div>
              {shortlistedCount > 0 && applications.length > 0 && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  {((shortlistedCount / applications.length) * 100).toFixed(0)}% success rate
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{jobs.length}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Available</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Open Positions</div>
              <div className="mt-2 text-xs text-gray-500">
                Ready to apply
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Applications Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>
            </div>
            {applications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/candidate/jobs')}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                Browse more jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {applications.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Browse our open positions and apply to roles that match your skills and experience.
                </p>
                <Button
                  onClick={() => router.push('/candidate/jobs')}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Browse Open Positions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="border-2 border-gray-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
                  onClick={() => router.push(`/candidate/applications/${app.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left Side - Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:shadow-lg transition-shadow">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                              Job #{app.job_id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Applied {formatDate(app.applied_at)}
                            </p>
                          </div>
                        </div>

                        {/* Status & Metrics Row */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {app.status === 'pending' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              Under Review
                            </span>
                          )}
                          {app.status === 'shortlisted' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              Shortlisted
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                              <XCircle className="w-3.5 h-3.5 mr-1.5" />
                              Not Selected
                            </span>
                          )}

                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                            <Award className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">
                              {app.num_skills || 0} skills
                            </span>
                          </div>

                          {app.cluster_name && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                              <Star className="h-3.5 w-3.5 text-purple-600" />
                              <span className="text-xs font-semibold text-purple-700">
                                {app.cluster_name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress Indicators */}
                        {app.meets_requirements !== false && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-600">Overall Ranking</span>
                              <span className="font-bold text-gray-900">{formatPercentile(app.overall_percentile || 50)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${app.overall_percentile || 50}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Score Display */}
                      <div className="flex flex-col items-end gap-2">
                        <div className={`text-5xl font-bold ${getScoreColor(app.final_score || 0)}`}>
                          {app.final_score?.toFixed(0) || 'N/A'}
                        </div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Score / 100
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400"
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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/candidate/jobs')}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <Card
                  key={job.id}
                  className="border-2 border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white"
                  onClick={() => router.push('/candidate/jobs')}
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                      {job.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        {job.category}
                      </span>
                      <span className="text-sm font-medium text-amber-600 group-hover:text-amber-700">
                        Apply →
                      </span>
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
