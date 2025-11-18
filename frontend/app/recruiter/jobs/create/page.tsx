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
  Briefcase,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Info
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

// Quick weight presets for entire system
const WEIGHT_PRESETS = {
  'Skills-Focused': { skills: 50, experience: 25, education: 15, certifications: 5, leadership: 5 },
  'Balanced': { skills: 40, experience: 30, education: 20, certifications: 5, leadership: 5 },
  'Experience-Heavy': { skills: 30, experience: 40, education: 15, certifications: 5, leadership: 10 },
}

export default function CreateJobPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })

  // REQUIREMENTS (Hard Filters - Pass/Fail)
  const [requirements, setRequirements] = useState({
    min_education: 'none' as 'none' | 'bachelors' | 'masters' | 'phd',
    min_experience: 0,
    required_skills: [] as string[],
    preferred_skills: [] as string[],
    certifications_required: false,
    leadership_required: false,
  })

  // WEIGHTS (For ranking candidates who pass requirements)
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    certifications: 5,
    leadership: 5
  })

  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0)

  const handlePresetSelect = (presetName: string) => {
    const preset = WEIGHT_PRESETS[presetName as keyof typeof WEIGHT_PRESETS]
    setWeights(preset)
    setSelectedPreset(presetName)
  }

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value })
    setSelectedPreset('')
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
      setError(`Scoring weights must sum to 100% (currently ${totalWeight}%)`)
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
        // Store requirements as JSON for backend
        requirements: JSON.stringify({
          min_education: requirements.min_education,
          certifications_required: requirements.certifications_required,
          leadership_required: requirements.leadership_required,
        }),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
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

      <main className="max-w-5xl mx-auto px-6 py-12">
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
            Set requirements and configure ML-powered scoring for candidate evaluation
          </p>
        </div>

        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* SECTION 1: Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-600">Essential details about the job posting</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-900">
                      Job Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Senior Full-Stack Developer"
                      required
                      className="mt-2 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-900">
                      Job Category *
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="mt-2 w-full h-11 px-3 rounded-md border border-gray-300 focus:border-amber-500 focus:ring-amber-500 focus:ring-1 bg-white"
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
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
                    Job Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    placeholder="Describe the role, responsibilities, team structure, and what makes your company great..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="mt-2 border-gray-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Include team size, tech stack, and growth opportunities to attract top talent
                  </p>
                </div>
              </div>

              {/* SECTION 2: Requirements (Hard Filters) */}
              <div className="space-y-6">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Requirements (Hard Filters)</h2>
                    <p className="text-sm text-gray-600">
                      Candidates must meet ALL these requirements to be considered. Those who don't will be automatically filtered out.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 space-y-6">
                  {/* Education & Experience Requirements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="min_education" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Minimum Education Level *
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          Required
                        </span>
                      </Label>
                      <select
                        id="min_education"
                        value={requirements.min_education}
                        onChange={(e) => setRequirements({ ...requirements, min_education: e.target.value as any })}
                        className="mt-2 w-full h-11 px-3 rounded-md border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500 focus:ring-1 bg-white font-medium"
                      >
                        <option value="none">No Requirement</option>
                        <option value="bachelors">Bachelor's Degree (Minimum)</option>
                        <option value="masters">Master's Degree (Minimum)</option>
                        <option value="phd">PhD (Minimum)</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-2">
                        Candidates below this level will be filtered out
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="min_experience" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Minimum Years of Experience *
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          Required
                        </span>
                      </Label>
                      <Input
                        id="min_experience"
                        type="number"
                        min="0"
                        max="20"
                        value={requirements.min_experience}
                        onChange={(e) => setRequirements({ ...requirements, min_experience: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="mt-2 border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500 font-semibold text-lg"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Candidates with less experience will be filtered out
                      </p>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Required Skills (Must Have ALL)
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        Critical
                      </span>
                    </Label>
                    <p className="text-xs text-gray-600 mb-3">
                      Candidates missing ANY of these skills will be automatically rejected
                    </p>
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
                        placeholder="Type a skill and press Enter (e.g., Python, React)"
                        className="border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddSkill('required')}
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {requirements.required_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border-2 border-red-200 shadow-sm">
                        {requirements.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md text-sm font-medium shadow-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill, 'required')}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-lg border-2 border-dashed border-orange-300 text-center">
                        <p className="text-sm text-gray-500">No required skills set. Add skills that are absolutely necessary.</p>
                      </div>
                    )}
                  </div>

                  {/* Preferred Skills */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Preferred Skills (Nice to Have)
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                        Bonus
                      </span>
                    </Label>
                    <p className="text-xs text-gray-600 mb-3">
                      These improve a candidate's ranking but aren't mandatory
                    </p>
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
                        placeholder="Type a skill and press Enter (e.g., Docker, AWS)"
                        className="border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddSkill('preferred')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {requirements.preferred_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border-2 border-amber-200 shadow-sm">
                        {requirements.preferred_skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md text-sm font-medium shadow-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill, 'preferred')}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-lg border-2 border-dashed border-amber-300 text-center">
                        <p className="text-sm text-gray-500">No preferred skills set. These are optional but help rank candidates.</p>
                      </div>
                    )}
                  </div>

                  {/* Browse Skills Section */}
                  <details className="p-4 bg-white rounded-lg border-2 border-orange-200 shadow-sm">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Browse & Quick-Add Skills by Category
                    </summary>
                    <div className="mt-4 space-y-4">
                      {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                        <div key={category}>
                          <p className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">{category}</p>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => {
                              const isRequired = requirements.required_skills.includes(skill)
                              const isPreferred = requirements.preferred_skills.includes(skill)

                              return (
                                <div key={skill} className="inline-flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200">
                                  <button
                                    type="button"
                                    onClick={() => handleQuickAddSkill(skill, 'required')}
                                    disabled={isRequired}
                                    className={`px-3 py-1.5 text-xs font-medium transition-all border-r border-gray-200 ${
                                      isRequired
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-inner'
                                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-700'
                                    } disabled:opacity-100 disabled:cursor-not-allowed`}
                                    title="Add as required skill (must have)"
                                  >
                                    {skill}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickAddSkill(skill, 'preferred')}
                                    disabled={isPreferred}
                                    className={`px-2 py-1.5 text-xs font-medium transition-all ${
                                      isPreferred
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-inner'
                                        : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                                    } disabled:opacity-100 disabled:cursor-not-allowed`}
                                    title="Add as preferred skill (bonus)"
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

                  {/* Additional Requirements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-orange-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Certifications Required?</p>
                        <p className="text-xs text-gray-600 mt-0.5">Must have professional certifications</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRequirements({
                          ...requirements,
                          certifications_required: !requirements.certifications_required
                        })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          requirements.certifications_required ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                            requirements.certifications_required ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-lg border-2 border-orange-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Leadership Experience Required?</p>
                        <p className="text-xs text-gray-600 mt-0.5">Must have led teams or projects</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRequirements({
                          ...requirements,
                          leadership_required: !requirements.leadership_required
                        })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          requirements.leadership_required ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-300'
                        })`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                            requirements.leadership_required ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Scoring Weights (For Ranking) */}
              <div className="space-y-6">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Scoring Weights (For Ranking)</h2>
                    <p className="text-sm text-gray-600">
                      How should we rank candidates who meet the requirements above?
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
                    totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {totalWeight === 100 ? (
                      <><CheckCircle2 className="h-5 w-5" /> {totalWeight}%</>
                    ) : (
                      <><AlertCircle className="h-5 w-5" /> {totalWeight}%</>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 space-y-6">
                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-3">
                    <p className="text-sm font-semibold text-gray-900 w-full mb-2">Quick Presets:</p>
                    {Object.keys(WEIGHT_PRESETS).map((presetName) => (
                      <button
                        key={presetName}
                        type="button"
                        onClick={() => handlePresetSelect(presetName)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedPreset === presetName
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md'
                        }`}
                      >
                        {presetName}
                      </button>
                    ))}
                  </div>

                  {/* Weight Sliders with Visual Bars */}
                  <div className="space-y-5">
                    {[
                      {
                        key: 'skills' as const,
                        label: 'Skills',
                        description: 'Preferred skills match + diversity',
                        color: 'blue'
                      },
                      {
                        key: 'experience' as const,
                        label: 'Experience',
                        description: 'Years beyond minimum requirement',
                        color: 'green'
                      },
                      {
                        key: 'education' as const,
                        label: 'Education',
                        description: 'Degrees above minimum level',
                        color: 'purple'
                      },
                      {
                        key: 'certifications' as const,
                        label: 'Certifications',
                        description: 'Professional certifications earned',
                        color: 'amber'
                      },
                      {
                        key: 'leadership' as const,
                        label: 'Leadership',
                        description: 'Team lead or management experience',
                        color: 'pink'
                      },
                    ].map(({ key, label, description, color }) => (
                      <div key={key} className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-600">{description}</p>
                          </div>
                          <span className="text-2xl font-bold text-purple-600 min-w-[60px] text-right">
                            {weights[key]}%
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3 shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r transition-all duration-300 ${
                              color === 'blue' ? 'from-blue-400 to-blue-600' :
                              color === 'green' ? 'from-green-400 to-green-600' :
                              color === 'purple' ? 'from-purple-400 to-purple-600' :
                              color === 'amber' ? 'from-amber-400 to-amber-600' :
                              'from-pink-400 to-pink-600'
                            }`}
                            style={{ width: `${weights[key]}%` }}
                          />
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={weights[key]}
                          onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Info Box */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">How Scoring Works:</p>
                      <p>
                        Only candidates who meet ALL requirements above are scored. Each component is scored 0-100,
                        then multiplied by its weight. The final score (0-100) ranks qualified candidates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || totalWeight !== 100}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                    Creating Job Posting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Briefcase className="h-6 w-6" />
                    Create Job Posting
                    {totalWeight === 100 && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                )}
              </Button>

              {totalWeight !== 100 && (
                <p className="text-center text-sm text-red-600 font-medium">
                  ⚠️ Scoring weights must sum to exactly 100% before creating the job
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
