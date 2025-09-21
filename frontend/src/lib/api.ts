import {
  fallbackPeople,
  fallbackApartments,
  fallbackSpots,
} from "./fallbackData";

// API service to connect frontend to Flask backend
const API_BASE_URL = "http://localhost:5003";

// --- (Your interface definitions remain the same) ---
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
  sender: "user" | "match";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: "apartment" | "person" | "spot";
  photo: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    // Ensure this only runs on the client
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  static getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  // ✅ ADDED: A logout method to clear credentials
  static logout() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
  }

  // ✅ REFACTORED: A private, centralized request handler
  private static async _request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    if (!token) {
      // If there's no token at all, log out to redirect to login
      this.logout();
      throw new Error("Not authenticated");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // ✅ This is the key change: handle 401 errors specifically
    if (response.status === 401) {
      console.error("Authentication error: Token is invalid or expired.");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data.success === false) {
      // Check for explicit false from backend
      throw new Error(data.error || "API returned an error");
    }

    return data;
  }

  // --- Your login and register methods can remain the same ---
  static async login(userInfo: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error || `Login failed: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
        return data;
      }

      throw new Error(data.error || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(userInfo: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
        return data;
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async getApartmentFeed() {
    return Promise.resolve(fallbackApartments);
  }

  static async getPeopleFeed() {
    return Promise.resolve(fallbackPeople);
  }

  static async getSpotsFeed() {
    return Promise.resolve(fallbackSpots);
  }

  static async swipeApartment(
    apartmentId: string,
    direction: "left" | "right"
  ) {
    return this._request("/api/apartments/swipe", {
      method: "POST",
      body: JSON.stringify({ apartment_id: apartmentId, direction }),
    });
  }

  static async swipePerson(personId: string, direction: "left" | "right") {
    return this._request("/api/people/swipe", {
      method: "POST",
      body: JSON.stringify({ person_id: personId, direction }),
    });
  }

  static async swipeSpot(spotId: string, direction: "left" | "right") {
    return this._request("/api/spots/swipe", {
      method: "POST",
      body: JSON.stringify({ spot_id: spotId, direction }),
    });
  }

  static async getMatches() {
    return this._request("/api/matches");
  }

  static async submitOnboarding(data: any) {
    return this._request("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
