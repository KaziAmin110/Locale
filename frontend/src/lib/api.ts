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

interface ApiResponse<T> {
  success: boolean;
  items: T[];
  total_available?: number;
  data_source?: string;
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
  photos?: string[]; // Added photos based on your backend
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

  static async getApartmentsFeed(): Promise<ApiResponse<Apartment>> {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/apartments/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    // Return the consistent shape your page expects
    return {
      success: true,
      items: data.apartments || [],
      total_available: data.total_available,
      data_source: data.data_source,
    };
  }

  static async getPeopleFeed(): Promise<ApiResponse<Person>> {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/people/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    return {
      success: true,
      items: data.people || [],
      total_available: data.total_available,
      data_source: data.data_source,
    };
  }

  static async getSpotsFeed(): Promise<ApiResponse<Spot>> {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/spots/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    return {
      success: true,
      items: data.spots || [],
      total_available: data.total_available,
      data_source: data.data_source,
    };
  }

  static async swipeApartment(payload: {
    item_id: string;
    action: "like" | "pass";
  }) {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/apartments/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        apartment_id: payload.item_id,
        direction: payload.action === "like" ? "right" : "left",
      }),
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);
    return response.json();
  }

  static async swipePerson(personId: string, direction: "left" | "right") {
    const token = this.getToken();
    if (!token) {
      // Redirect to login if not authenticated
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/people/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        person_id: personId,
        direction: direction,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async swipeSpot(spotId: string, direction: "left" | "right") {
    const token = this.getToken();
    if (!token) {
      // Redirect to login if not authenticated
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }

    console.log("Spot ID:", spotId);
    console.log("Direction:", direction);

    const response = await fetch(`${API_BASE_URL}/api/spots/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        spot_id: spotId,
        direction: direction,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async getMatches() {
    const token = this.getToken();
    if (!token) {
      // Redirect to login if not authenticated
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/matches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async submitOnboarding(data: any) {
    const token = this.getToken();
    if (!token) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }

  static async getProfile(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      // Redirect to login if not authenticated
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch profile");
    }

    return data.user;
  }

  // Chat methods
  static async getConversations() {
    const token = this.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async getConversation(conversationId: string) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async sendMessage(conversationId: string, content: string) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/${conversationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  static async startConversation(userId: string) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }
}
