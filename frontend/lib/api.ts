/**
 * API client for ATS backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    // Always load fresh token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async register(data: { email: string; password: string; full_name: string; role: string }) {
    const result = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    this.setToken(result.access_token)
    return result
  }

  async login(email: string, password: string) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(result.access_token)
    return result
  }

  async logout() {
    this.setToken(null)
    return { message: 'Logged out' }
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  // Job endpoints
  async getJobs(statusFilter?: string) {
    const params = statusFilter ? `?status_filter=${statusFilter}` : ''
    return this.request(`/api/jobs${params}`)
  }

  async getJobById(id: number) {
    return this.request(`/api/jobs/${id}`)
  }

  async getJob(id: string) {
    return this.request(`/api/jobs/${id}`)
  }

  async createJob(data: any) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateJob(id: number, data: any) {
    return this.request(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteJob(id: number) {
    return this.request(`/api/jobs/${id}`, {
      method: 'DELETE',
    })
  }

  // Application endpoints
  async submitApplication(jobId: number, resumeFile: File) {
    // Always load fresh token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }

    const formData = new FormData()
    formData.append('job_id', jobId.toString())
    formData.append('resume_file', resumeFile)

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/api/applications`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getMyApplications() {
    return this.request('/api/applications/my')
  }

  async getApplicationById(id: number) {
    return this.request(`/api/applications/${id}`)
  }

  async getApplication(id: string) {
    return this.request(`/api/applications/${id}`)
  }

  async applyToJob(jobId: number, formData: FormData) {
    // Always load fresh token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    formData.append('job_id', jobId.toString())

    const response = await fetch(`${this.baseURL}/api/applications`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getApplicationsForJob(jobId: string) {
    return this.request(`/api/applications/job/${jobId}`)
  }

  async updateApplicationStatus(id: number, status: string) {
    return this.request(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async generateRandomApplication(jobId: number, count: number = 1) {
    return this.request(`/api/applications/job/${jobId}/generate-random?count=${count}`, {
      method: 'POST',
    })
  }

  // Resume analysis endpoints
  async analyzeResume(resumeFile: File) {
    // Always load fresh token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }

    const formData = new FormData()
    formData.append('resume_file', resumeFile)

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/api/recommendations/analyze-resume`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getJobRecommendations(analysis: any) {
    return this.request('/api/recommendations/jobs', {
      method: 'POST',
      body: JSON.stringify(analysis),
    })
  }
}

export const api = new APIClient(API_BASE_URL)
