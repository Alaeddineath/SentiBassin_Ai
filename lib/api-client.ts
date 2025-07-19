interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl = "/api"
  private token: string | null = null

  constructor() {
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth-token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", response.status, response.statusText)
        return { error: `Server error: ${response.status} ${response.statusText}` }
      }

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || `HTTP ${response.status}: ${response.statusText}` }
      }

      return { data }
    } catch (error) {
      console.error("API request error:", error)
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        return { error: "Network error - please check your connection" }
      }
      return { error: "An unexpected error occurred" }
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async getProfile() {
    return this.request<{ user: any }>("/auth/me")
  }

  async updateProfile(profileData: any) {
    return this.request<{ user: any }>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  // Bassin methods
  async getBassins() {
    return this.request<{ bassins: any[] }>("/bassins")
  }

  async getBassin(id: string) {
    return this.request<{ bassin: any }>(`/bassins/${id}`)
  }

  async createBassin(bassinData: any) {
    return this.request<{ bassin: any }>("/bassins", {
      method: "POST",
      body: JSON.stringify(bassinData),
    })
  }

  async updateBassin(id: string, bassinData: any) {
    return this.request<{ bassin: any }>(`/bassins/${id}`, {
      method: "PUT",
      body: JSON.stringify(bassinData),
    })
  }

  async deleteBassin(id: string) {
    return this.request<{ message: string }>(`/bassins/${id}`, {
      method: "DELETE",
    })
  }

  // Water quality readings
  async getWaterQualityReadings(bassinId: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : ""
    return this.request<{ readings: any[] }>(`/bassins/${bassinId}/readings${params}`)
  }

  async createWaterQualityReading(bassinId: string, readingData: any) {
    return this.request<{ reading: any }>(`/bassins/${bassinId}/readings`, {
      method: "POST",
      body: JSON.stringify(readingData),
    })
  }

  // Alert methods
  async getAlerts(limit?: number) {
    const params = limit ? `?limit=${limit}` : ""
    return this.request<{ alerts: any[] }>(`/alerts${params}`)
  }

  async createAlert(alertData: any) {
    return this.request<{ alert: any }>("/alerts", {
      method: "POST",
      body: JSON.stringify(alertData),
    })
  }

  async updateAlert(id: string, alertData: any) {
    return this.request<{ alert: any }>(`/alerts/${id}`, {
      method: "PUT",
      body: JSON.stringify(alertData),
    })
  }

  async deleteAlert(id: string) {
    return this.request<{ message: string }>(`/alerts/${id}`, {
      method: "DELETE",
    })
  }

  async clearAllAlerts() {
    return this.request<{ message: string }>("/alerts", {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
