'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Wheat,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Target
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading applications...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Bread</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.full_name}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Job Header */}
        <Card className="mb-8 shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{job?.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {job?.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Applications</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                {stats.total}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Pending</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                {stats.pending}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Shortlisted</CardDescription>
              <CardTitle className="text-2xl flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                {stats.shortlisted}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Rejected</CardDescription>
              <CardTitle className="text-2xl flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-2" />
                {stats.rejected}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Avg Score</CardDescription>
              <CardTitle className={`text-2xl ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore.toFixed(1)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search & Sort */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate name or cluster..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-amber-400"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                  variant={sortBy === 'score' ? 'default' : 'outline'}
                  onClick={() => setSortBy('score')}
                  className={sortBy === 'score' ? 'gradient-bg text-white' : ''}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Score
                </Button>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  onClick={() => setSortBy('date')}
                  className={sortBy === 'date' ? 'gradient-bg text-white' : ''}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No applications match your search' : 'No applications yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card
                key={app.id}
                className="hover-lift border-2 hover:border-amber-300 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    {/* Score */}
                    <div className="md:col-span-2 text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(app.final_score || 0)}`}>
                        {app.final_score?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Score</div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          Application #{app.id}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(app.applied_at)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Award className="h-4 w-4 mr-1 text-blue-600" />
                          {formatPercentile(app.overall_percentile || 50)}
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1 text-green-600" />
                          {app.num_skills || 0} skills matched
                        </span>
                        {app.cluster_name && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {app.cluster_name}
                          </span>
                        )}
                      </div>

                      {app.matched_skills && app.matched_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    <div className="md:col-span-4 flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-2">
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                        {app.status === 'shortlisted' && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Shortlisted
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {app.status !== 'shortlisted' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                            className="bg-green-600 hover:bg-green-700 text-white"
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
                            className="border-red-300 text-red-600 hover:bg-red-50"
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
