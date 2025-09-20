// API service to connect frontend to Flask backend
const API_BASE_URL = 'http://localhost:5001';

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  static async login(userInfo: { email: string; name: string; picture?: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_info: userInfo }),
      });

      const data = await response.json();
      
      if (data.success && data.access_token) {
        this.setToken(data.access_token);
        return data;
      }
      
      throw new Error(data.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async getApartmentFeed() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/apartments/feed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.apartments;
  }

  static async getPeopleFeed() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/people/feed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.people;
  }

  static async getSpotsFeed() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/spots/feed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.spots;
  }

  static async swipeApartment(apartmentId: string, direction: 'left' | 'right') {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/apartments/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        apartment_id: apartmentId,
        direction: direction,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async swipePerson(personId: string, direction: 'left' | 'right') {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/people/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        person_id: personId,
        direction: direction,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async swipeSpot(spotId: string, direction: 'left' | 'right') {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/spots/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        spot_id: spotId,
        direction: direction,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }
}

