// API service to connect frontend to Flask backend
const API_BASE_URL = "http://localhost:5003";

// Type definitions (Interfaces are fine, no changes needed here)
export interface Apartment {
  // ...
}
export interface Person {
  // ...
}
// ... (and so on for other interfaces)

// --- NEW: Define a consistent response shape for feed methods ---
interface ApiResponse<T> {
  success: boolean;
  items: T[];
  total_available?: number;
  data_source?: string;
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

  // --- LOGIN AND REGISTER ARE FINE ---
  static async login(userInfo: { email: string; password: string }) {
    /* ... */
  }
  static async register(userInfo: {
    name: string;
    email: string;
    password: string;
  }) {
    /* ... */
  }

  // --- FIX: Renamed method and normalized the return value ---
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

  // --- FIX: Normalized the return value ---
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

  // --- FIX: Normalized the return value ---
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

  // --- FIX: Updated swipe methods to accept a single payload object ---
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

  static async swipePerson(payload: {
    item_id: string;
    action: "like" | "pass";
  }) {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/people/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        person_id: payload.item_id,
        direction: payload.action === "like" ? "right" : "left",
      }),
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);
    return response.json();
  }

  static async swipeSpot(payload: {
    item_id: string;
    action: "like" | "pass";
  }) {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/spots/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        spot_id: payload.item_id,
        direction: payload.action === "like" ? "right" : "left",
      }),
    });
    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);
    return response.json();
  }

  // --- Other methods are likely fine, but you would apply similar fixes if needed ---
  // ... getMatches, submitOnboarding, getProfile, etc. ...
}

// NOTE: You'll need to fill in the missing methods like getMatches, getProfile etc.
// from your original file if you copy/paste this whole class.
// The code provided above shows the essential fixes for your feed and swipe functions.
