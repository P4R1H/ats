'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wheat, Briefcase, Users, Plus, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, stripMarkdown } from '@/lib/utils'

export default function RecruiterDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [currentUser, myJobs] = await Promise.all([
        api.getCurrentUser(),
        api.getJobs()
      ])

      setUser(currentUser)
      setJobs(myJobs)
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

  const totalApplications = jobs.reduce((sum, job) => sum + (job.application_count || 0), 0)
  const activeJobs = jobs.filter(j => j.status === 'active').length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
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
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-gray-600">
              Manage your job postings and review candidates
            </p>
          </div>
          <Button
            onClick={() => router.push('/recruiter/jobs/create')}
            className="gradient-bg text-white border-2 border-transparent shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Active Jobs</div>
              <div className="text-3xl font-bold text-gray-900">{activeJobs}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Jobs</div>
              <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Applications</div>
              <div className="text-3xl font-bold text-amber-600">{totalApplications}</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Avg Applications/Job</div>
              <div className="text-3xl font-bold text-gray-900">
                {jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Postings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          </div>

          {jobs.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first job posting to start receiving applications from talented candidates.
                </p>
                <Button
                  onClick={() => router.push('/recruiter/jobs/create')}
                  className="gradient-bg text-white border-2 border-transparent shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          {job.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Closed
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                          {stripMarkdown(job.description)}
                        </p>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">
                              {job.application_count || 0} applications
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <span className="text-gray-700">{job.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">
                              Posted {formatDate(job.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/recruiter/jobs/${job.id}/applications`)}
                          className="text-sm"
                        >
                          View Applications
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
      </main>
    </div>
  )
}
