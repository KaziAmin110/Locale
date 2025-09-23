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

export interface SwipeAction {
  item_id: string;
  action: "like" | "pass";
}

export interface Match {
  id: string;
  type: "apartment" | "person" | "spot";
  item: Apartment | Person | Spot;
  matched_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  conversation_id: string;
  other_user: {
    id: string;
    name: string;
    image?: string;
  };
  messages: Message[];
}

// Add data source tracking
interface FeedResponse<T> {
  success: boolean;
  data?: T[];
  apartments?: T[];
  people?: T[];
  spots?: T[];
  total_available: number;
  data_source: "real" | "mock" | "google" | "yelp" | "rentspree" | "zillow";
  user_location?: string;
  user_interests?: string[];
  error?: string;
}

class ApiService {
  private static baseURL = "http://localhost:5002/api";

  private static async makeRequest<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Update feed methods to handle new response format
  static async getApartmentsFeed(): Promise<FeedResponse<Apartment>> {
    return this.makeRequest("/apartments/feed");
  }

  static async getPeopleFeed(): Promise<FeedResponse<Person>> {
    return this.makeRequest("/people/feed");
  }

  static async getSpotsFeed(): Promise<FeedResponse<Spot>> {
    return this.makeRequest("/spots/feed");
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
        this.getSpotsFeed(),
      ]);

      return {
        apartments: apartments.data_source || "unknown",
        people: people.data_source || "mock",
        spots: spots.data_source || "unknown",
      };
    } catch (error) {
      console.error("Failed to get data sources:", error);
      return {
        apartments: "error",
        people: "error",
        spots: "error",
      };
    }
  }

  // Swipe methods
  static async swipeApartment(
    action: SwipeAction
  ): Promise<{ success: boolean; match?: boolean }> {
    return this.makeRequest("/apartments/swipe", "POST", action);
  }

  static async swipePerson(
    action: SwipeAction
  ): Promise<{ success: boolean; match?: boolean }> {
    return this.makeRequest("/people/swipe", "POST", action);
  }

  static async swipeSpot(
    action: SwipeAction
  ): Promise<{ success: boolean; match?: boolean }> {
    return this.makeRequest("/spots/swipe", "POST", action);
  }

  // Matches methods
  static async getMatches(): Promise<{ success: boolean; matches: Match[] }> {
    return this.makeRequest("/matches");
  }

  // Chat methods
  static async getConversation(
    conversationId: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    return this.makeRequest(`/chat/conversation/${conversationId}`);
  }

  static async sendMessage(message: {
    conversation_id: string;
    content: string;
  }): Promise<{ success: boolean }> {
    return this.makeRequest("/chat/send", "POST", message);
  }

  // Auth methods
  static async register(
    userData: any
  ): Promise<{ success: boolean; token?: string }> {
    return this.makeRequest("/auth/register", "POST", userData);
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; token?: string }> {
    return this.makeRequest("/auth/login", "POST", credentials);
  }
}

export default ApiService;
