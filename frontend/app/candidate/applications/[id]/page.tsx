'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Wheat,
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Briefcase,
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatPercentile, getScoreColor } from '@/lib/utils'

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [currentUser, app] = await Promise.all([
        api.getCurrentUser(),
        api.getApplication(applicationId)
      ])

      setUser(currentUser)
      setApplication(app)

      // Load job details
      const jobData = await api.getJob(app.job_id)
      setJob(jobData)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Application not found</p>
            <Button onClick={() => router.push('/candidate/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const scoreBreakdown = [
    { label: 'Skills Match', value: application.skills_score || 0, weight: 40, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Experience', value: application.experience_score || 0, weight: 30, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Education', value: application.education_score || 0, weight: 20, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Bonus Points', value: application.bonus_score || 0, weight: 10, color: 'text-amber-600', bgColor: 'bg-amber-100' }
  ]

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
          onClick={() => router.push('/candidate/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Card */}
        <Card className="mb-8 shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {job?.title || `Job #${application.job_id}`}
                </CardTitle>
                <CardDescription className="text-base">
                  Applied {formatDate(application.applied_at)}
                </CardDescription>
              </div>
              <div className="text-right">
                {application.status === 'pending' && (
                  <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Review
                  </span>
                )}
                {application.status === 'shortlisted' && (
                  <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Shortlisted
                  </span>
                )}
                {application.status === 'rejected' && (
                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full font-medium">
                    <XCircle className="h-4 w-4 mr-2" />
                    Not Selected
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(application.final_score || 0)}`}>
                  {application.final_score?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Final Score (out of 100)</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-5xl font-bold mb-2 text-blue-600">
                  {formatPercentile(application.overall_percentile || 50)}
                </div>
                <div className="text-sm text-muted-foreground">Overall Percentile</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-5xl font-bold mb-2 text-purple-600">
                  {application.cluster_name || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Talent Cluster</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <CardTitle>Score Breakdown</CardTitle>
              </div>
              <CardDescription>
                Transparent breakdown of your application score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scoreBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className={`${item.color} font-bold`}>
                      {item.value.toFixed(1)} / {item.weight}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${item.bgColor} transition-all duration-500`}
                      style={{ width: `${(item.value / item.weight) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Score</span>
                  <span className={getScoreColor(application.final_score || 0)}>
                    {application.final_score?.toFixed(1) || 0} / 100
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Percentile Rankings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-600" />
                <CardTitle>Percentile Rankings</CardTitle>
              </div>
              <CardDescription>
                How you compare to other candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Overall Percentile</div>
                <div className="text-3xl font-bold text-green-600">
                  {formatPercentile(application.overall_percentile || 50)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You scored higher than {application.overall_percentile?.toFixed(0) || 50}% of applicants
                </p>
              </div>

              {application.skills_percentile !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Skills Percentile</span>
                    <span className="font-bold text-blue-600">
                      {formatPercentile(application.skills_percentile)}
                    </span>
                  </div>
                  <Progress value={application.skills_percentile} className="h-2" />
                </div>
              )}

              {application.experience_percentile !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Experience Percentile</span>
                    <span className="font-bold text-green-600">
                      {formatPercentile(application.experience_percentile)}
                    </span>
                  </div>
                  <Progress value={application.experience_percentile} className="h-2" />
                </div>
              )}

              {application.education_percentile !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Education Percentile</span>
                    <span className="font-bold text-purple-600">
                      {formatPercentile(application.education_percentile)}
                    </span>
                  </div>
                  <Progress value={application.education_percentile} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-amber-600" />
                <CardTitle>Skills Analysis</CardTitle>
              </div>
              <CardDescription>
                Skills extracted from your resume and matched to job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {application.matched_skills && application.matched_skills.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Matched Skills ({application.matched_skills.length})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.matched_skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {application.extracted_skills && application.extracted_skills.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">All Extracted Skills ({application.extracted_skills.length})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.extracted_skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {application.missing_skills && application.missing_skills.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <XCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Missing Skills ({application.missing_skills.length})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.missing_skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <CardTitle>Recommendations</CardTitle>
              </div>
              <CardDescription>
                Personalized suggestions to improve your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {application.recommendations && application.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {application.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Great job! You have a strong profile for this position.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
