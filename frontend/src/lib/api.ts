// lib/api.ts - Clean API service for your Flask backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003'

// Types
export interface Apartment {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet?: number
  address: string
  lat: number
  lng: number
  photos: string[]
  amenities: string[]
  match_score?: number
}

export interface Person {
  id: string
  name: string
  age: number
  bio: string
  interests: string[]
  photos: string[]
  lat?: number
  lng?: number
  match_score?: number
}

export interface Spot {
  id: string
  name: string
  category: string
  rating: number
  price_level?: number
  address: string
  lat: number
  lng: number
  photos: string[]
  description: string
  match_score?: number
}

export interface Match {
  id: string
  name: string
  type: 'apartment' | 'person' | 'spot'
  photo: string
  timestamp: string
}

class ApiServiceClass {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}/api${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token)
    }
    
    return response
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
    }
    
    return response
  }

  // Apartments
  async getApartmentFeed(): Promise<Apartment[]> {
    try {
      const response = await this.request('/apartments/feed')
      return response.apartments || []
    } catch (error) {
      console.error('Failed to fetch apartments:', error)
      return []
    }
  }

  async swipeApartment(id: string, direction: 'left' | 'right') {
    const action = direction === 'right' ? 'like' : 'pass'
    return this.request('/apartments/swipe', {
      method: 'POST',
      body: JSON.stringify({ item_id: id, action })
    })
  }

  // People
  async getPeopleFeed(): Promise<Person[]> {
    try {
      const response = await this.request('/people/feed')
      return response.people || []
    } catch (error) {
      console.error('Failed to fetch people:', error)
      return []
    }
  }

  async swipePerson(id: string, direction: 'left' | 'right') {
    return this.request('/people/swipe', {
      method: 'POST',
      body: JSON.stringify({ person_id: id, direction })
    })
  }

  // Spots
  async getSpotsFeed(): Promise<Spot[]> {
    try {
      const response = await this.request('/spots/feed')
      return response.spots || []
    } catch (error) {
      console.error('Failed to fetch spots:', error)
      return []
    }
  }

  async swipeSpot(id: string, direction: 'left' | 'right') {
    return this.request('/spots/swipe', {
      method: 'POST',
      body: JSON.stringify({ spot_id: id, direction })
    })
  }

  // Matches
  async getMatches(): Promise<{ success: boolean; matches: Match[] }> {
    try {
      const response = await this.request('/matches')
      return {
        success: true,
        matches: response.matches || []
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
      return {
        success: false,
        matches: []
      }
    }
  }

  // Profile
  async getProfile() {
    return this.request('/profile')
  }

  async updateProfile(data: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // Onboarding
  async saveOnboardingData(data: any) {
    return this.request('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async submitOnboarding(data: any) {
    return this.request('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const ApiService = new ApiServiceClass()

// Debug function to test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/health`)
    const data = await response.json()
    console.log('API Connection Test:', data)
    return data.status === 'healthy'
  } catch (error) {
    console.error('API Connection Failed:', error)
    return false
  }
}