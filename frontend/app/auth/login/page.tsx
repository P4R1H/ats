'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, ArrowRight, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login(email, password)

      if (response.user.role === 'candidate') {
        router.push('/candidate/dashboard')
      } else {
        router.push('/recruiter/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 bread-pattern">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-600 rounded-2xl shadow-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">Bread</span>
          </Link>
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-full text-sm font-medium text-amber-900">
              <Sparkles className="h-4 w-4" />
              <span>Welcome back to the bakery!</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your credentials to access your dashboard
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
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-bg text-white border-2 border-transparent text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                  Create one
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
