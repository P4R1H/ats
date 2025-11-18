'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wheat, Search, Briefcase, MapPin, Clock, ArrowLeft, Upload, FileText } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function JobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredJobs(filtered)
    } else {
      setFilteredJobs(jobs)
    }
  }, [searchTerm, jobs])

  const loadData = async () => {
    try {
      const [currentUser, availableJobs] = await Promise.all([
        api.getCurrentUser(),
        api.getJobs()
      ])

      setUser(currentUser)
      setJobs(availableJobs)
      setFilteredJobs(availableJobs)
    } catch (error: any) {
      if (error.message.includes('401')) {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
      setApplyError('')
    }
  }

  const handleApply = async () => {
    if (!selectedJob) return
    if (!resumeFile) {
      setApplyError('Please select a resume file')
      return
    }

    setApplying(true)
    setApplyError('')

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)

      await api.applyToJob(selectedJob.id, formData)

      // Success! Go to dashboard
      router.push('/candidate/dashboard')
    } catch (err: any) {
      setApplyError(err.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    )
  }

  // Apply modal
  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
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

        <main className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedJob(null)
              setResumeFile(null)
              setApplyError('')
            }}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>

          <div className="max-w-3xl mx-auto">
            <Card className="shadow-2xl border-2 border-amber-200/50 warm-glow">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-3xl font-bold">{selectedJob.title}</CardTitle>
                <CardDescription className="text-base">
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {selectedJob.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {formatDate(selectedJob.created_at)}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedJob.description}</p>
                </div>

                {selectedJob.required_skills && selectedJob.required_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.required_skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.preferred_skills && selectedJob.preferred_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Preferred Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.preferred_skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Apply for this Position</h3>

                  {applyError && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm mb-4 animate-slide-in">
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-base font-medium">
                        Upload Resume (PDF or DOCX)
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className="h-12 text-base border-2 focus:border-amber-400"
                        />
                        {resumeFile && (
                          <FileText className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      {resumeFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {resumeFile.name}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleApply}
                      disabled={applying || !resumeFile}
                      className="w-full h-12 gradient-bg text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {applying ? 'Submitting...' : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Job listing
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
            <p className="text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/candidate/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-amber-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No jobs match your search' : 'No jobs available at the moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover-lift border-2 hover:border-amber-300 transition-all cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.category}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      Posted {formatDate(job.created_at)}
                    </div>
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.required_skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.required_skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              +{job.required_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4 gradient-bg text-white">
                    View & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
