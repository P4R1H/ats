'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
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

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    certifications: 5,
    leadership: 5
  })

  const [currentSkill, setCurrentSkill] = useState('')
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value })
  }

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0)

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

    if (totalWeight !== 100) {
      setError(`Scoring weights must sum to 100% (currently ${totalWeight}%)`)
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
        // Convert percentages to decimals (0-1)
        weight_skills: weights.skills / 100,
        weight_experience: weights.experience / 100,
        weight_education: weights.education / 100,
        weight_certifications: weights.certifications / 100,
        weight_leadership: weights.leadership / 100
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
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/recruiter/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Job Posting</h1>
          <p className="text-gray-600">
            Create a new job posting with ML-powered candidate matching
          </p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Engineering, Design, Marketing"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                  Job Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={8}
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                />
                <p className="text-xs text-gray-500">
                  Supports markdown formatting (headings, lists, bold, italic, etc.)
                </p>
              </div>

              {/* Scoring Weights */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Scoring Weights</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Customize how candidate applications are scored (must sum to 100%)
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Skills Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900">Skills Match</Label>
                      <span className="text-sm font-bold text-blue-600">{weights.skills}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.skills}
                      onChange={(e) => handleWeightChange('skills', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Experience Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900">Experience</Label>
                      <span className="text-sm font-bold text-green-600">{weights.experience}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.experience}
                      onChange={(e) => handleWeightChange('experience', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  {/* Education Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900">Education</Label>
                      <span className="text-sm font-bold text-purple-600">{weights.education}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.education}
                      onChange={(e) => handleWeightChange('education', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Certifications Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900">Certifications</Label>
                      <span className="text-sm font-bold text-amber-600">{weights.certifications}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.certifications}
                      onChange={(e) => handleWeightChange('certifications', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  {/* Leadership Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-900">Leadership</Label>
                      <span className="text-sm font-bold text-orange-600">{weights.leadership}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.leadership}
                      onChange={(e) => handleWeightChange('leadership', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Required Skills
                  </Label>
                  <div className="flex items-center gap-2 mb-4">
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
                      className="h-11 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill('required')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.required_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1.5 bg-white border border-green-200 text-green-900 rounded-md text-sm font-medium shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'required')}
                            className="ml-2 hover:text-green-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs font-medium text-gray-700 mb-3">Quick add popular skills:</div>
                  <div className="space-y-3">
                    {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                      <div key={category}>
                        <div className="text-xs font-medium text-gray-600 mb-2">{category}</div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleQuickAddSkill(skill, 'required')}
                              className="px-3 py-1 bg-gray-100 hover:bg-amber-100 text-gray-900 rounded-md text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Preferred Skills */}
                <div className="pt-6 border-t border-gray-200">
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Preferred Skills (Optional)
                  </Label>
                  <div className="flex items-center gap-2 mb-4">
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
                      className="h-11 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill('preferred')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.preferred_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.preferred_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'preferred')}
                            className="ml-2 hover:text-gray-900"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
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
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Job Posting'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
