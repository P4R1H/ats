'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, TrendingUp, Target, Users, BarChart3, Award, Sparkles, Shield, Zap, Layers, Check, X } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
      {/* Floating Island Navbar */}
      <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
        <div className="rounded-full border border-amber-200/50 bg-white/80 backdrop-blur-md shadow-lg shadow-amber-100/50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-6 w-6 text-amber-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Bread
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
              onClick={() => router.push('/auth/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Background */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              Fresh from the oven: ML-Powered Hiring
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Rise to the{' '}
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
              Top
            </span>
            <br />
            with Data-Driven Hiring
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Bread turns hiring from guesswork into a science. Get transparent scores, 
            percentile rankings, and actionable insights powered by machine learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 text-lg px-8"
              onClick={() => router.push('/auth/register?role=candidate')}
            >
              <Users className="mr-2 h-5 w-5" />
              I'm Looking for Work
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-amber-300 hover:bg-amber-50 text-amber-700 text-lg px-8"
              onClick={() => router.push('/auth/register?role=recruiter')}
            >
              <Target className="mr-2 h-5 w-5" />
              I'm Hiring Talent
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="font-medium">100% Transparent</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="h-5 w-5 text-amber-600" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              <span className="font-medium">Data-Driven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Elegant List Style */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Bread?
            </h2>
            <p className="text-xl text-gray-600">
              We're not just another ATS. We're the fresh approach hiring needs.
            </p>
          </div>

          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Percentile Rankings</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  No more "we'll keep you on file." Get real feedback like "Top 25% of candidates" 
                  instead of generic rejections. Know exactly where you stand.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Target className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Skill Gap Analysis</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Know exactly what skills you're missing and get personalized recommendations 
                  to level up your career. Close the gap, get the job.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Crystal Clear Scores</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Complete transparency: Skills (40%), Experience (30%), Education (20%), Bonuses (10%). 
                  No black boxes here. You know exactly how you're evaluated.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Layers className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Smart Clustering</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  ML-powered grouping helps recruiters identify talent pools faster. 
                  Find your tribe, get discovered easier. It's that simple.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">150+ Skills Tracked</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our AI extracts skills automatically from resumes across 9 categories. 
                  From Python to leadership - we see it all, you miss nothing.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Fair & Objective</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  No bias, no favoritism. Just pure data-driven evaluation that gives 
                  everyone a fair shot at success. Merit wins here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Beautiful and Elegant */}
      <section className="px-4 py-24 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-4">
              <Award className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">How We Compare</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Fresh Alternative
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how Bread stacks up against traditional applicant tracking systems
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-amber-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-6 px-8 font-semibold text-gray-900 bg-gradient-to-r from-amber-50 to-orange-50">
                      Feature
                    </th>
                    <th className="text-center py-6 px-6 font-semibold">
                      <div className="flex flex-col items-center">
                        <Wheat className="h-8 w-8 text-amber-600 mb-2" />
                        <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent font-bold">
                          Bread
                        </span>
                      </div>
                    </th>
                    <th className="text-center py-6 px-6 text-gray-600 font-medium">
                      Rippling
                    </th>
                    <th className="text-center py-6 px-6 text-gray-600 font-medium">
                      Ashby
                    </th>
                    <th className="text-center py-6 px-6 text-gray-600 font-medium">
                      Greenhouse
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Transparent Scoring
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Percentile Rankings
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      ML-Powered Clustering
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="text-sm text-gray-500">Limited</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Skill Gap Analysis
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Candidate Feedback
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="text-sm text-gray-500">Basic</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="text-sm text-gray-500">Basic</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="text-sm text-gray-500">Basic</span>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Automated Skill Extraction
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="text-sm text-gray-500">Limited</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-amber-50/30 transition">
                    <td className="py-5 px-8 font-medium text-gray-900">
                      Free Tier Available
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            * Comparison based on publicly available information as of 2024
          </p>
        </div>
      </section>

      {/* CTA Section - Elegant and Subtle */}
      <section className="relative px-4 py-24 overflow-hidden bg-gradient-to-b from-white to-amber-50">
        {/* Subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            Ready to Rise?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join Bread and experience hiring that's fresh, fair, and actually helpful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 text-lg px-8"
              onClick={() => router.push('/auth/register')}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-300 hover:bg-amber-50 text-amber-700 text-lg px-8"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Wheat className="h-8 w-8 text-amber-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  Bread
                </span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                The fresh approach to hiring. Transparent, data-driven, and fair recruitment powered by machine learning.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  ML-Powered
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  100% Transparent
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  Fair & Objective
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => router.push('/auth/register?role=candidate')}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-left"
                  >
                    For Candidates
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/auth/register?role=recruiter')}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-left"
                  >
                    For Recruiters
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/auth/login')}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-left"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => router.push('/methodology')}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-left"
                  >
                    ML Methodology
                  </button>
                </li>
                <li className="text-gray-600">Documentation</li>
                <li className="text-gray-600">API Reference</li>
                <li className="text-gray-600">Support</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-amber-200/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 text-center md:text-left">
                <p className="mb-1">
                  Built with <span className="text-amber-600">FastAPI</span>, <span className="text-amber-600">Next.js</span>, and <span className="text-amber-600">Scikit-learn</span>
                </p>
                <p className="text-gray-500">
                  Foundation of Data Science Academic Project • Developed by Parth Gupta
                </p>
              </div>
              <div className="text-sm text-gray-500">
                © 2024 Bread ATS. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
          <Wheat className="h-64 w-64 text-amber-600" />
        </div>
      </footer>
    </div>
  )
}