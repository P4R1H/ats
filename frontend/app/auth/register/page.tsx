'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, ArrowRight, Sparkles, Users, Briefcase } from 'lucide-react'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: searchParams.get('role') || 'candidate'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role
      })

      // Redirect based on role
      if (response.user.role === 'candidate') {
        router.push('/candidate/dashboard')
      } else {
        router.push('/recruiter/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 bread-pattern">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">Bread</span>
          </Link>
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-full text-sm font-medium text-amber-900">
              <Sparkles className="h-4 w-4" />
              <span>Join the freshest hiring platform!</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-base">
              Start your journey with Bread today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm animate-slide-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-base font-medium">I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={`h-14 text-base border-2 transition-all ${
                      formData.role === 'candidate'
                        ? 'gradient-bg text-white border-transparent shadow-lg'
                        : 'hover:border-amber-400'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'candidate' })}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Job Seeker
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`h-14 text-base border-2 transition-all ${
                      formData.role === 'recruiter'
                        ? 'gradient-bg text-white border-transparent shadow-lg'
                        : 'hover:border-amber-400'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Recruiter
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-base font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-bg text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? 'Creating account...' : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
