'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wheat, Search, Briefcase, Clock, ArrowLeft, Upload, FileText, X, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, stripMarkdown } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function JobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
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
      const [currentUser, availableJobs, myApps] = await Promise.all([
        api.getCurrentUser(),
        api.getJobs(),
        api.getMyApplications()
      ])

      setUser(currentUser)
      setJobs(availableJobs)
      setApplications(myApps)
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
      formData.append('resume_file', resumeFile)

      await api.applyToJob(selectedJob.id, formData)

      // Success! Go to dashboard
      router.push('/candidate/dashboard')
    } catch (err: any) {
      console.error('Application error:', err)
      // Handle different error formats
      const errorMessage = err?.response?.data?.detail || err?.message || (typeof err === 'string' ? err : 'Failed to submit application. Please try again.')
      setApplyError(errorMessage)
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  // Apply modal view
  if (selectedJob) {
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

        <main className="max-w-4xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedJob(null)
              setResumeFile(null)
              setApplyError('')
            }}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              {/* Job Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{selectedJob.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{selectedJob.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDate(selectedJob.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About this role</h2>
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedJob.description}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Required Skills */}
              {selectedJob.required_skills && selectedJob.required_skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-md text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {selectedJob.preferred_skills && selectedJob.preferred_skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Preferred Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.preferred_skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Form */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Apply for this position</h2>

                {applyError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{applyError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume" className="text-sm font-medium text-gray-700 mb-2 block">
                      Upload Resume (PDF or DOCX)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {resumeFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(resumeFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setResumeFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="resume" className="flex flex-col items-center cursor-pointer">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload resume
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF or DOCX up to 10MB
                          </p>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(null)
                        setResumeFile(null)
                        setApplyError('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApply}
                      disabled={applying || !resumeFile}
                      className="gradient-bg text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {applying ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Job listing view
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/candidate/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <span className="text-sm text-gray-600">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No positions available at the moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {stripMarkdown(job.description)}
                  </p>

                  {/* Meta info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.required_skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{job.required_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply button */}
                  {applications.some(app => app.job_id === job.id) ? (
                    <Button
                      disabled
                      className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                      Applied
                    </Button>
                  ) : (
                    <Button className="w-full gradient-bg text-white shadow-lg hover:shadow-xl transition-all">
                      View & Apply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
