'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, TrendingUp, Target, Users, BarChart3, Award, Sparkles, Shield, Zap, Layers } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Floating Island Navbar */}
      <header className="sticky top-0 z-50 py-2">
        <div className="container mx-auto px-4">
          <div className="floating-island bg-white/90 backdrop-blur-md border border-amber-100">
            <div className="px-6 py-2 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Wheat className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">Bread</span>
              </div>
              <div className="space-x-3">
                <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                  Sign In
                </Button>
                <Button
                  className="gradient-bg text-white shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => router.push('/auth/register')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Background */}
      <section className="hero-bg relative min-h-[calc(100vh-4rem)] flex items-start pt-16">
        <div className="container mx-auto px-4 text-center relative z-10 w-full">
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-orange-700 shadow-sm border border-orange-200">
              <Sparkles className="h-4 w-4" />
              <span>Fresh from the oven: ML-Powered Hiring</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Rise to the{' '}
              <span className="gradient-text">Top</span>
              <br />
              with Data-Driven Hiring
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Bread turns hiring from guesswork into a science. Get transparent scores, percentile rankings,
              and actionable insights powered by machine learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="gradient-bg text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover-lift"
                onClick={() => router.push('/auth/register?role=candidate')}
              >
                <Users className="mr-2 h-5 w-5" />
                I'm Looking for Work
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-orange-400 hover:bg-orange-50 bg-white/80 backdrop-blur-sm"
                onClick={() => router.push('/auth/register?role=recruiter')}
              >
                <Wheat className="mr-2 h-5 w-5" />
                I'm Hiring Talent
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                <Zap className="h-4 w-4 text-orange-600" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                <Award className="h-4 w-4 text-blue-600" />
                <span>Data-Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bread */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Bread?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're not just another ATS. We're the fresh approach hiring needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 w-fit rounded-xl mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Percentile Rankings</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                No more "we'll keep you on file." Get real feedback like <strong>"Top 25% of candidates"</strong>
                instead of generic rejections.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 w-fit rounded-xl mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Skill Gap Analysis</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Know exactly what skills you're missing and get personalized recommendations
                to level up your career.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 w-fit rounded-xl mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Crystal Clear Scores</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Complete transparency: Skills (40%), Experience (30%), Education (20%),
                Bonuses (10%). No black boxes here.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 w-fit rounded-xl mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Smart Clustering</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                ML-powered grouping helps recruiters identify talent pools faster.
                Find your tribe, get discovered easier.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 w-fit rounded-xl mb-4">
                <Wheat className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">150+ Skills Tracked</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Our AI extracts skills automatically from resumes across 9 categories.
                From Python to leadership - we see it all.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-2 hover:border-orange-300 transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 w-fit rounded-xl mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Fair & Objective</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                No bias, no favoritism. Just pure data-driven evaluation that gives
                everyone a fair shot at success.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section - Card Based */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover-lift">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
                  <Layers className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-6xl font-bold gradient-text mb-2">150+</div>
              <CardTitle className="text-xl mb-1">Skills We Track</CardTitle>
              <CardDescription>Across 9 categories</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover-lift">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-6xl font-bold gradient-text mb-2">8</div>
              <CardTitle className="text-xl mb-1">Smart Clusters</CardTitle>
              <CardDescription>ML-powered grouping</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover-lift">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-6xl font-bold gradient-text mb-2">100%</div>
              <CardTitle className="text-xl mb-1">Transparency</CardTitle>
              <CardDescription>Every score explained</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 bg-white/60 backdrop-blur-sm rounded-3xl p-12 border-2 border-orange-200">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Rise?
          </h2>
          <p className="text-xl text-gray-700">
            Join Bread and experience hiring that's fresh, fair, and actually helpful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="gradient-bg text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push('/auth/register')}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-orange-400 bg-white hover:bg-orange-50"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-orange-200 bg-gradient-to-b from-white via-orange-50/20 to-amber-50/40 mt-20 overflow-hidden">
        {/* Giant BREAD text background */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none">
          <div className="text-[20rem] md:text-[28rem] font-black text-center leading-none tracking-tighter opacity-[0.03] select-none">
            BREAD
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand section */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <Wheat className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold gradient-text">Bread</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Rise to the top with intelligent, data-driven hiring powered by machine learning and statistical analysis.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-700 rounded-lg text-sm font-medium border border-orange-200/50">
                  🤖 ML-Powered
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-700 rounded-lg text-sm font-medium border border-orange-200/50">
                  📊 Data-Driven
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-bold text-lg text-foreground">Key Features</h3>
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer">
                  → Percentile Rankings
                </li>
                <li className="text-sm text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer">
                  → Skill Gap Analysis
                </li>
                <li className="text-sm text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer">
                  → ML Clustering
                </li>
                <li className="text-sm text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer">
                  → Transparent Scoring
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-bold text-lg text-foreground">Built With</h3>
              <div className="flex flex-col space-y-2">
                <span className="px-3 py-2 bg-white/60 rounded-lg border border-orange-200 text-sm font-medium text-foreground hover:border-orange-400 hover:shadow-md transition-all">
                  🧠 Scikit-learn & NLP
                </span>
                <span className="px-3 py-2 bg-white/60 rounded-lg border border-orange-200 text-sm font-medium text-foreground hover:border-orange-400 hover:shadow-md transition-all">
                  ⚡ FastAPI + Python
                </span>
                <span className="px-3 py-2 bg-white/60 rounded-lg border border-orange-200 text-sm font-medium text-foreground hover:border-orange-400 hover:shadow-md transition-all">
                  ⚛️ Next.js 14 + TypeScript
                </span>
              </div>
            </div>

            {/* Get Started */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-bold text-lg text-foreground">Get Started</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/auth/register')}
                  className="w-full px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full px-4 py-2 text-sm border-2 border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* Divider with decorative elements */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-b from-white to-orange-50/30 text-orange-400">
                <Wheat className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-foreground">
                Foundation of Data Science Academic Project
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Developed with ❤️ by <span className="font-semibold text-orange-600">Parth Gupta</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2024 Bread ATS
              </div>
              <div className="h-4 w-px bg-orange-200"></div>
              <div className="text-xs text-muted-foreground">
                All rights reserved
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-3 gap-6 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-orange-200/50">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">150+</div>
              <div className="text-xs text-muted-foreground mt-1">Skills Tracked</div>
            </div>
            <div className="text-center border-x border-orange-200">
              <div className="text-2xl font-bold gradient-text">8</div>
              <div className="text-xs text-muted-foreground mt-1">ML Clusters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">99%</div>
              <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
