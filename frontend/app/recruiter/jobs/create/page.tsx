'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Wheat, ArrowLeft, Plus, X, Briefcase, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

const SKILL_CATEGORIES = {
  'Programming Languages': ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift'],
  'Web Technologies': ['React', 'Angular', 'Vue.js', 'Node.js', 'HTML', 'CSS', 'Next.js', 'Express', 'Django', 'Flask'],
  'Data Science & ML': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis'],
  'Databases': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Git', 'Linux'],
  'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management', 'Agile', 'Scrum']
}

// Flatten all skills into a single sorted array for dropdowns
const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat().sort()

// Component-specific presets - helps users understand what each slider does
const COMPONENT_PRESETS = {
  skills: {
    'Specialist (High)': 60,
    'Balanced': 40,
    'Generalist (Low)': 25,
  },
  experience: {
    'Entry Level': 15,
    'Mid Level': 30,
    'Senior Level': 40,
  },
  education: {
    'BTech/Bachelor (Low)': 10,
    'MTech/Master (Medium)': 20,
    'PhD (High)': 30,
  },
  certifications: {
    'Not Important': 0,
    'Somewhat Important': 5,
    'Very Important': 15,
  },
  leadership: {
    'Individual Contributor': 0,
    'Team Lead': 10,
    'Manager/Director': 25,
  },
}

export default function CreateJobPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    required_skills: [] as string[],
    preferred_skills: [] as string[],
    min_experience: 0
  })

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    certifications: 5,
    leadership: 5
  })

  const [componentPresets, setComponentPresets] = useState<{[key: string]: string}>({
    skills: '',
    experience: '',
    education: '',
    certifications: '',
    leadership: '',
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComponentPresetSelect = (component: keyof typeof weights, preset: string) => {
    const value = COMPONENT_PRESETS[component][preset as keyof typeof COMPONENT_PRESETS[typeof component]]
    setWeights({ ...weights, [component]: value })
    setComponentPresets({ ...componentPresets, [component]: preset })
  }

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value })
    setComponentPresets({ ...componentPresets, [key]: '' }) // Clear component preset when manually changing
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
        min_experience: formData.min_experience,
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

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Full-Stack Developer"
                    required
                    className="mt-1.5 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Job Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="mt-1.5 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-amber-500 focus:ring-amber-500 focus:ring-1"
                  >
                    <option value="">Select a category</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="QA/Testing">QA/Testing</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="min_experience">Minimum Years of Experience *</Label>
                  <Input
                    id="min_experience"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.min_experience}
                    onChange={(e) => setFormData({ ...formData, min_experience: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    required
                    className="mt-1.5 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is used for job-relative experience scoring. Candidates with experience close to this requirement will score highest.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    placeholder="Describe the role, responsibilities, and what makes your company great..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={8}
                    className="mt-1.5 border-gray-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Supports markdown formatting (headings, lists, bold, italic, etc.)
                  </p>
                </div>
              </div>

              {/* Component-Specific Presets & Scoring Weights */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Scoring Weights Configuration</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Choose presets for each component or use sliders for granular control. Must sum to 100%.
                </p>

                <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-900">Total Weight</span>
                  <span className={`text-xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'skills' as const, label: 'Skills Match', description: '70% required + 20% preferred + 10% diversity' },
                    { key: 'experience' as const, label: 'Experience', description: 'Job-relative scoring (perfect fit at min +0-2 years)' },
                    { key: 'education' as const, label: 'Education', description: 'PhD (100) > Masters (85) > Bachelors (70)' },
                    { key: 'certifications' as const, label: 'Certifications', description: 'Binary bonus for having certifications' },
                    { key: 'leadership' as const, label: 'Leadership', description: 'Binary bonus for leadership experience' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{label}</span>
                          <p className="text-xs text-gray-600 mt-0.5">{description}</p>
                        </div>
                        <span className="text-lg font-bold text-purple-600 min-w-[50px] text-right">
                          {weights[key]}%
                        </span>
                      </div>

                      {/* Preset Buttons */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {Object.entries(COMPONENT_PRESETS[key]).map(([presetName, presetValue]) => (
                          <button
                            key={presetName}
                            type="button"
                            onClick={() => handleComponentPresetSelect(key, presetName)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                              componentPresets[key] === presetName
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {presetName}
                          </button>
                        ))}
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={weights[key]}
                        onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section - Simplified */}
              <div className="space-y-6">
                {/* Required Skills */}
                <div>
                  <Label className="text-base">Required Skills</Label>
                  <p className="text-xs text-gray-500 mb-3">Critical skills needed for this role</p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill('required')
                        }
                      }}
                      placeholder="Type a skill and press Enter"
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                    <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      {formData.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 text-blue-900 rounded-md text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'required')}
                            className="hover:text-blue-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preferred Skills */}
                <div>
                  <Label className="text-base">Preferred Skills (Optional)</Label>
                  <p className="text-xs text-gray-500 mb-3">Nice-to-have skills that add value</p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={currentPreferredSkill}
                      onChange={(e) => setCurrentPreferredSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill('preferred')
                        }
                      }}
                      placeholder="Type a skill and press Enter"
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                    <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      {formData.preferred_skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-purple-300 text-purple-900 rounded-md text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill, 'preferred')}
                            className="hover:text-purple-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Add Skills - Single Collapsible Section */}
                <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-gray-700">
                    Browse common skills by category
                  </summary>
                  <div className="mt-4 space-y-4">
                    {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                      <div key={category}>
                        <p className="text-xs font-semibold text-gray-700 mb-2">{category}</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => {
                            const isRequired = formData.required_skills.includes(skill)
                            const isPreferred = formData.preferred_skills.includes(skill)
                            const isAdded = isRequired || isPreferred

                            return (
                              <div key={skill} className="inline-flex items-center shadow-sm rounded overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddSkill(skill, 'required')}
                                  disabled={isRequired}
                                  className={`px-3 py-1.5 text-xs font-medium transition-all border-r border-gray-300 ${
                                    isRequired
                                      ? 'bg-blue-600 text-white shadow-inner'
                                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title="Add as required skill"
                                >
                                  {skill}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddSkill(skill, 'preferred')}
                                  disabled={isPreferred}
                                  className={`px-2 py-1.5 text-xs font-medium transition-all ${
                                    isPreferred
                                      ? 'bg-purple-600 text-white shadow-inner'
                                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title="Add as preferred skill"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              <Button
                type="submit"
                disabled={loading || totalWeight !== 100}
                className="w-full gradient-bg text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Job...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Create Job Posting
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
