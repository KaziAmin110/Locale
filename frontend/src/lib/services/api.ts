// Types
export interface Apartment {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  amenities: string[];
  images: string[];
  lat: number;
  lng: number;
  match_score?: number;
  distance_km?: number;
}

export interface Person {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  images: string[];
  match_score?: number;
}

export interface Spot {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  match_score?: number;
  distance_km?: number;
}

// Add data source tracking
interface FeedResponse<T> {
    success: boolean;
    data?: T[];
    apartments?: T[];
    people?: T[];
    spots?: T[];
    total_available: number;
    data_source: 'real' | 'mock' | 'google' | 'yelp' | 'rentspree' | 'zillow';
    user_location?: string;
    user_interests?: string[];
    error?: string;
  }
  
class ApiService {
  private static baseURL = 'http://localhost:5002/api';

  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Update feed methods to handle new response format
  static async getApartmentsFeed(): Promise<FeedResponse<Apartment>> {
    return this.makeRequest('/apartments/feed');
  }

  static async getPeopleFeed(): Promise<FeedResponse<Person>> {
    return this.makeRequest('/people/feed');
  }

  static async getSpotsFeed(): Promise<FeedResponse<Spot>> {
    return this.makeRequest('/spots/feed');
  }

  // Add method to check data sources
  static async getDataSources(): Promise<{
    apartments: string;
    people: string;
    spots: string;
  }> {
    try {
      const [apartments, people, spots] = await Promise.all([
        this.getApartmentsFeed(),
        this.getPeopleFeed(),
        this.getSpotsFeed()
      ]);

      return {
        apartments: apartments.data_source || 'unknown',
        people: people.data_source || 'mock',
        spots: spots.data_source || 'unknown'
      };
    } catch (error) {
      console.error('Failed to get data sources:', error);
      return {
        apartments: 'error',
        people: 'error', 
        spots: 'error'
      };
    }
  }
}

export default ApiService;