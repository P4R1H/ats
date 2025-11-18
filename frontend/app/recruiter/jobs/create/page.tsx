'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wheat, ArrowLeft, Plus, X, Briefcase } from 'lucide-react'
import { api } from '@/lib/api'

const SKILL_CATEGORIES = {
  'Programming Languages': ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift'],
  'Web Technologies': ['React', 'Angular', 'Vue.js', 'Node.js', 'HTML', 'CSS', 'Next.js', 'Express', 'Django', 'Flask'],
  'Data Science & ML': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis'],
  'Databases': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Git', 'Linux'],
  'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management', 'Agile', 'Scrum']
}

export default function CreateJobPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    required_skills: [] as string[],
    preferred_skills: [] as string[]
  })

  const [currentSkill, setCurrentSkill] = useState('')
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddSkill = (type: 'required' | 'preferred') => {
    const skill = type === 'required' ? currentSkill : currentPreferredSkill
    if (!skill.trim()) return

    if (type === 'required') {
      if (!formData.required_skills.includes(skill)) {
        setFormData({ ...formData, required_skills: [...formData.required_skills, skill] })
      }
      setCurrentSkill('')
    } else {
      if (!formData.preferred_skills.includes(skill)) {
        setFormData({ ...formData, preferred_skills: [...formData.preferred_skills, skill] })
      }
      setCurrentPreferredSkill('')
    }
  }

  const handleRemoveSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      setFormData({
        ...formData,
        required_skills: formData.required_skills.filter(s => s !== skill)
      })
    } else {
      setFormData({
        ...formData,
        preferred_skills: formData.preferred_skills.filter(s => s !== skill)
      })
    }
  }

  const handleQuickAddSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      if (!formData.required_skills.includes(skill)) {
        setFormData({ ...formData, required_skills: [...formData.required_skills, skill] })
      }
    } else {
      if (!formData.preferred_skills.includes(skill)) {
        setFormData({ ...formData, preferred_skills: [...formData.preferred_skills, skill] })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      await api.createJob({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        required_skills: formData.required_skills,
        preferred_skills: formData.preferred_skills,
        min_experience: 0,
        education_level: null,
        // Default weight values (must sum to 1.0)
        weight_skills: 0.40,
        weight_experience: 0.30,
        weight_education: 0.20,
        weight_certifications: 0.05,
        weight_leadership: 0.05
      })

      router.push('/recruiter/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    router.push('/')
  }

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
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-2xl border-2 border-amber-200/50 warm-glow">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="h-6 w-6 text-amber-600" />
              <CardTitle className="text-3xl font-bold">Create Job Posting</CardTitle>
            </div>
            <CardDescription className="text-base">
              Fill in the details to create a new job posting with ML-powered candidate matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm animate-slide-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Engineering, Design, Marketing"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="h-12 text-base border-2 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Job Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="text-base border-2 focus:border-amber-400 resize-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Required Skills</Label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Input
                      placeholder="Add a required skill..."
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill('required')
                        }
                      }}
                      className="h-10 border-2 focus:border-amber-400"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill('required')}
                      className="gradient-bg text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.required_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'required')}
                            className="ml-2 hover:text-green-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground mb-2">Quick add popular skills:</div>
                  <div className="space-y-2">
                    {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                      <div key={category}>
                        <div className="text-xs font-medium text-muted-foreground mb-1">{category}</div>
                        <div className="flex flex-wrap gap-1">
                          {skills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleQuickAddSkill(skill, 'required')}
                              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-xs transition-colors"
                              disabled={formData.required_skills.includes(skill)}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Preferred Skills (Optional)</Label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Input
                      placeholder="Add a preferred skill..."
                      value={currentPreferredSkill}
                      onChange={(e) => setCurrentPreferredSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill('preferred')
                        }
                      }}
                      className="h-10 border-2 focus:border-amber-400"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill('preferred')}
                      className="gradient-bg text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.preferred_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.preferred_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'preferred')}
                            className="ml-2 hover:text-orange-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/recruiter/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="gradient-bg text-white text-base px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? 'Creating...' : 'Create Job Posting'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
