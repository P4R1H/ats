'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, Briefcase, Users, TrendingUp, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, getScoreColor } from '@/lib/utils'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const totalApplications = jobs.reduce((sum, job) => sum + (job.application_count || 0), 0)
  const activeJobs = jobs.filter(j => j.status === 'active').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Button className="gradient-bg text-white" onClick={() => router.push('/recruiter/jobs/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Jobs</CardDescription>
              <CardTitle className="text-3xl">{activeJobs}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Jobs</CardDescription>
              <CardTitle className="text-3xl">{jobs.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{totalApplications}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Applications/Job</CardDescription>
              <CardTitle className="text-3xl">
                {jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Job Postings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>Manage your active and closed positions</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No job postings yet</p>
                <Button className="gradient-bg text-white" onClick={() => router.push('/recruiter/jobs/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted {formatDate(job.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.application_count || 0} applications
                        </span>
                        <span className="text-primary font-medium">
                          {job.category}
                        </span>
                      </div>

                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/recruiter/jobs/${job.id}/applications`)}
                        >
                          View Applications
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
