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
    company_name: '',
    company_logo: '',
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
        full_name: formData.role === 'recruiter' ? formData.company_name : formData.full_name,
        company_name: formData.role === 'recruiter' ? formData.company_name : undefined,
        company_logo: formData.role === 'recruiter' ? formData.company_logo : undefined,
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
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Bread</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader className="pb-4 pt-5">
            <CardTitle className="text-xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-xs">
              Start your journey with Bread today
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-2 rounded-xl text-xs animate-slide-in">
                  {error}
                </div>
              )}

              <div className="space-y-0.5">
                <Label htmlFor={formData.role === 'recruiter' ? 'company_name' : 'full_name'} className="text-xs font-medium">
                  {formData.role === 'recruiter' ? 'Company Name' : 'Full Name'}
                </Label>
                <Input
                  id={formData.role === 'recruiter' ? 'company_name' : 'full_name'}
                  type="text"
                  placeholder={formData.role === 'recruiter' ? 'Acme Corporation' : 'John Doe'}
                  value={formData.role === 'recruiter' ? formData.company_name : formData.full_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    [formData.role === 'recruiter' ? 'company_name' : 'full_name']: e.target.value
                  })}
                  required
                  className="h-9 text-sm border-2 focus:border-amber-400"
                />
              </div>

              {formData.role === 'recruiter' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-9 text-sm border-2 focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="company_logo" className="text-xs font-medium">
                      Logo URL (optional)
                    </Label>
                    <Input
                      id="company_logo"
                      type="url"
                      placeholder="https://logo.png"
                      value={formData.company_logo}
                      onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                      className="h-9 text-sm border-2 focus:border-amber-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-9 text-sm border-2 focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-0.5">
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-9 text-sm border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="h-9 text-sm border-2 focus:border-amber-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-9 gradient-bg text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all mt-2"
                disabled={loading}
              >
                {loading ? 'Creating account...' : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-3">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
