import { Property, PropertyFilter, User } from "../types";

const API_BASE_URL = "/api/v1";

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("rks_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Property endpoints
  async getProperties(filters: PropertyFilter = {}): Promise<{ data: Property[]; meta: any }> {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.city) params.append("city", filters.city);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.search) params.append("search", filters.search);
    if (filters.isTitleVerified !== undefined)
      params.append("isTitleVerified", String(filters.isTitleVerified));

    const response = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return response.json();
  },

  async getPropertyBySlug(slug: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${slug}`);
    if (!response.ok) throw new Error("Failed to fetch property details");
    const json = await response.json();
    return json.data;
  },

  // Site Visit endpoint
  async bookSiteVisit(data: {
    propertyId: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    visitDate: string;
    timeSlot: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/site-visits`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to book site visit");
    return result;
  },

  // Lead / Inquiry endpoint
  async submitLead(data: {
    propertyId?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    interestedIn?: string;
    budgetRange?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to submit lead inquiry");
    return result;
  },

  // Auth endpoints
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Login failed");
    localStorage.setItem("rks_auth_token", result.data.token);
    return result.data;
  },

  async register(data: { name: string; email: string; password: string; phone?: string }): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Registration failed");
    localStorage.setItem("rks_auth_token", result.data.token);
    return result.data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("rks_auth_token");
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return null;
      const result = await response.json();
      return result.data.user;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("rks_auth_token");
  },
};
