'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, TrendingUp, Target, Users, BarChart3, Award } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Intelligent ATS</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => router.push('/auth/login')}>
              Login
            </Button>
            <Button onClick={() => router.push('/auth/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Intelligent Hiring,{' '}
            <span className="gradient-text">Powered by ML</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent, data-driven recruitment for the modern workforce.
            Get objective scores, percentile rankings, and actionable feedback.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => router.push('/auth/register?role=candidate')}
            >
              I'm a Candidate
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => router.push('/auth/register?role=recruiter')}
            >
              I'm a Recruiter
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Intelligent ATS?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Percentile Ranking</CardTitle>
              <CardDescription>
                Know exactly where you stand. Get transparent feedback like
                "Top 25% of all candidates" instead of generic rejections.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Identify missing skills and get personalized recommendations
                to improve your profile and land your dream job.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Transparent Scoring</CardTitle>
              <CardDescription>
                See complete score breakdown: Skills (40%), Experience (30%),
                Education (20%), and Bonuses (10%). Full transparency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Clustering</CardTitle>
              <CardDescription>
                ML-powered candidate grouping helps recruiters quickly identify
                talent pools and make data-driven decisions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>NLP Skill Extraction</CardTitle>
              <CardDescription>
                Advanced NLP analyzes resumes to extract 150+ skills across
                9 categories automatically and accurately.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fair & Objective</CardTitle>
              <CardDescription>
                Data-driven evaluation removes bias and ensures every candidate
                is assessed on objective, quantifiable criteria.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">150+</div>
              <div className="text-lg opacity-90">Skills Tracked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">8</div>
              <div className="text-lg opacity-90">Intelligent Clusters</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground">
            Join the future of transparent, data-driven hiring.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => router.push('/auth/register')}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Intelligent ATS. Built with ❤️ using ML, FastAPI, and Next.js.</p>
          <p className="text-sm mt-2">Academic Project - Foundations of Data Science</p>
        </div>
      </footer>
    </div>
  )
}
