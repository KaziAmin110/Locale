// API service to connect frontend to Flask backend
const API_BASE_URL = "http://localhost:5003";

// Type definitions
export interface Apartment {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  description: string;
  match_score: number;
  amenities?: string[];
  square_feet?: number;
  lat?: number;
  lng?: number;
}

export interface Person {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  match_score: number;
  occupation?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  city?: string;
  budget_min?: number;
  budget_max?: number;
  interests?: string[];
  photos?: string[];
  onboarding_complete: boolean;
}

export interface Spot {
  id: string;
  name: string;
  address: string;
  photos: string[];
  description: string;
  match_score: number;
  category?: string;
  rating?: number;
}

export interface Match {
  id: string;
  name: string;
  type: "apartment" | "person" | "spot";
  photo: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  conversation_id: string;
  other_user: {
    id: string;
    name: string;
    image?: string;
    age?: number;
  };
  messages?: Message[];
  last_message?: string;
  last_message_at?: string;
  created_at: string;
}

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  static logout() {
    this.token = null;
    localStorage.removeItem("auth_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    if (!token) {
      this.logout();
      throw new Error("Not authenticated");
    }

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      this.logout();
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "An unknown API error occurred" }));
      throw new Error(
        errorData.error || `API request failed: ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(data);

    return data;
  }

  static async login(userInfo: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Login failed: ${response.statusText}`);
    }
    if (data.success && data.token) {
      this.setToken(data.token);
      return data;
    }
    throw new Error(data.error || "Login failed");
  }

  static async register(userInfo: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }
    if (data.success && data.token) {
      this.setToken(data.token);
      return data;
    } else {
      throw new Error(data.error || "Registration failed");
    }
  }

  static async getApartmentFeed() {
    const data = await this.request(`/api/apartments/feed`);
    if (!data.success) throw new Error(data.error);
    return data.apartments;
  }

  static async getPeopleFeed() {
    const data = await this.request(`/api/people/feed`);
    if (!data.success) throw new Error(data.error);
    return data.people;
  }

  static async getSpotsFeed() {
    const data = await this.request(`/api/spots/feed`);
    if (!data.success) throw new Error(data.error);
    return data.spots;
  }

  static async swipeApartment(
    apartmentId: string,
    direction: "left" | "right"
  ) {
    return this.request(`/api/apartments/swipe`, {
      method: "POST",
      body: JSON.stringify({
        apartment_id: apartmentId,
        direction: direction,
      }),
    });
  }

  static async swipePerson(personId: string, direction: "left" | "right") {
    return this.request(`/api/people/swipe`, {
      method: "POST",
      body: JSON.stringify({
        person_id: personId,
        direction: direction,
      }),
    });
  }

  static async swipeSpot(spotId: string, direction: "left" | "right") {
    return this.request(`/api/spots/swipe`, {
      method: "POST",
      body: JSON.stringify({
        spot_id: spotId,
        direction: direction,
      }),
    });
  }

  static async getMatches() {
    const data = await this.request(`/api/matches`);
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async submitOnboarding(data: any) {
    return this.request(`/api/onboarding`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getProfile(): Promise<User> {
    const data = await this.request(`/api/profile`);
    if (!data.success) throw new Error(data.error || "Failed to fetch profile");
    return data.user;
  }

  // Chat methods
  static async getConversations() {
    const data = await this.request(`/api/chat/conversations`);
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async getConversation(conversationId: string) {
    const data = await this.request(`/api/chat/${conversationId}`);
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async sendMessage(conversationId: string, content: string) {
    return this.request(`/api/chat/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  static async startConversation(userId: string) {
    return this.request(`/api/chat/start`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  }
}
