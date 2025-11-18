'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wheat,
  ArrowLeft,
  Plus,
  X,
  AlertCircle
} from 'lucide-react'
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
  })

  const [requirements, setRequirements] = useState({
    min_education: 'none' as 'none' | 'bachelors' | 'masters' | 'phd',
    min_experience: 0,
    required_skills: [] as string[],
    preferred_skills: [] as string[],
    certifications_required: false,
    leadership_required: false,
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

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0)

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value })
  }

  const handleAddSkill = (type: 'required' | 'preferred') => {
    const skill = type === 'required' ? currentSkill : currentPreferredSkill
    if (!skill.trim()) return

    if (type === 'required') {
      if (!requirements.required_skills.includes(skill)) {
        setRequirements({ ...requirements, required_skills: [...requirements.required_skills, skill] })
      }
      setCurrentSkill('')
    } else {
      if (!requirements.preferred_skills.includes(skill)) {
        setRequirements({ ...requirements, preferred_skills: [...requirements.preferred_skills, skill] })
      }
      setCurrentPreferredSkill('')
    }
  }

  const handleRemoveSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      setRequirements({
        ...requirements,
        required_skills: requirements.required_skills.filter(s => s !== skill)
      })
    } else {
      setRequirements({
        ...requirements,
        preferred_skills: requirements.preferred_skills.filter(s => s !== skill)
      })
    }
  }

  const handleQuickAddSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      if (!requirements.required_skills.includes(skill)) {
        setRequirements({ ...requirements, required_skills: [...requirements.required_skills, skill] })
      }
    } else {
      if (!requirements.preferred_skills.includes(skill)) {
        setRequirements({ ...requirements, preferred_skills: [...requirements.preferred_skills, skill] })
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
      setError(`Weights must sum to 100% (current: ${totalWeight}%)`)
      return
    }

    setLoading(true)

    try {
      await api.createJob({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        required_skills: requirements.required_skills,
        preferred_skills: requirements.preferred_skills,
        min_experience: requirements.min_experience,
        education_level: requirements.min_education !== 'none' ? requirements.min_education : null,
        requirements: JSON.stringify({
          min_education: requirements.min_education,
          certifications_required: requirements.certifications_required,
          leadership_required: requirements.leadership_required,
        }),
        weight_skills: weights.skills / 100,
        weight_experience: weights.experience / 100,
        weight_education: weights.education / 100,
        weight_certifications: weights.certifications / 100,
        weight_leadership: weights.leadership / 100
      })

      router.push('/recruiter/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create job posting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Bread
            </span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/recruiter/dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Job Posting</h1>
          <p className="text-gray-600 mt-2">Set requirements and weights for AI-powered candidate ranking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Full-Stack Engineer"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select category...</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and team..."
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements (Stage 1) */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Requirements (Pass/Fail Filter)</h2>
                <p className="text-sm text-gray-600 mt-1">Candidates must meet ALL requirements to be considered</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="min_experience">Minimum Experience (years)</Label>
                  <Input
                    id="min_experience"
                    type="number"
                    min="0"
                    value={requirements.min_experience}
                    onChange={(e) => setRequirements({ ...requirements, min_experience: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="min_education">Minimum Education</Label>
                  <select
                    id="min_education"
                    value={requirements.min_education}
                    onChange={(e) => setRequirements({ ...requirements, min_education: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="none">No requirement</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirements.certifications_required}
                    onChange={(e) => setRequirements({ ...requirements, certifications_required: e.target.checked })}
                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Certifications required</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirements.leadership_required}
                    onChange={(e) => setRequirements({ ...requirements, leadership_required: e.target.checked })}
                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Leadership experience required</span>
                </label>
              </div>

              {/* Required Skills */}
              <div>
                <Label htmlFor="required_skills">Required Skills (must have ALL)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="required_skills"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('required'))}
                    placeholder="Type and press Enter"
                  />
                  <Button type="button" onClick={() => handleAddSkill('required')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {requirements.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {requirements.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-900 rounded-md text-sm border border-red-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill, 'required')}
                          className="hover:bg-red-100 rounded"
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
                <Label htmlFor="preferred_skills">Preferred Skills (nice to have)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="preferred_skills"
                    value={currentPreferredSkill}
                    onChange={(e) => setCurrentPreferredSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('preferred'))}
                    placeholder="Type and press Enter"
                  />
                  <Button type="button" onClick={() => handleAddSkill('preferred')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {requirements.preferred_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {requirements.preferred_skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-900 rounded-md text-sm border border-amber-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill, 'preferred')}
                          className="hover:bg-amber-100 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Browse Skills */}
              <div>
                <Label>Browse Skills by Category</Label>
                <div className="mt-3 space-y-4">
                  {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => {
                          const isRequired = requirements.required_skills.includes(skill)
                          const isPreferred = requirements.preferred_skills.includes(skill)
                          return (
                            <div key={skill} className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() => !isRequired && handleQuickAddSkill(skill, 'required')}
                                disabled={isRequired}
                                className={`px-3 py-1.5 text-xs transition-colors ${
                                  isRequired
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-red-50'
                                }`}
                                title="Add as required"
                              >
                                {skill}
                              </button>
                              <button
                                type="button"
                                onClick={() => !isPreferred && handleQuickAddSkill(skill, 'preferred')}
                                disabled={isPreferred}
                                className={`p-2 border-l border-gray-200 flex items-center justify-center transition-colors ${
                                  isPreferred
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-amber-50'
                                }`}
                                title="Add as preferred"
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
              </div>
            </CardContent>
          </Card>

          {/* Weights (Stage 2) */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ranking Weights (Stage 2)</h2>
                <p className="text-sm text-gray-600 mt-1">How to rank candidates who pass requirements (must total 100%)</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'skills' as const, label: 'Skills Match', description: 'Preferred skills + diversity' },
                  { key: 'experience' as const, label: 'Experience', description: 'Years beyond minimum' },
                  { key: 'education' as const, label: 'Education', description: 'Degrees above minimum' },
                  { key: 'certifications' as const, label: 'Certifications', description: 'Bonus if not required' },
                  { key: 'leadership' as const, label: 'Leadership', description: 'Bonus if not required' }
                ].map(({ key, label, description }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label htmlFor={`weight_${key}`} className="font-medium">{label}</Label>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{weights[key]}%</span>
                    </div>
                    <input
                      id={`weight_${key}`}
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={weights[key]}
                      onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-md ${totalWeight === 100 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-5 w-5 ${totalWeight === 100 ? 'text-green-600' : 'text-amber-600'}`} />
                  <span className={`font-medium ${totalWeight === 100 ? 'text-green-900' : 'text-amber-900'}`}>
                    Total: {totalWeight}% {totalWeight === 100 ? '✓' : `(needs to be 100%)`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-900">{error}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/recruiter/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || totalWeight !== 100}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              {loading ? 'Creating...' : 'Create Job Posting'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
