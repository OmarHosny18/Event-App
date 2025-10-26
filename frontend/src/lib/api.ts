import axios, { AxiosError } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  Attendee,
  ApiError,
} from "@/types";

// Base API URL - adjust this to your backend URL
const API_BASE_URL = "http://localhost:8080/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if needed
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    // ✅ Store both token and user info
    localStorage.setItem("token", response.data.token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

// Events API
export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>("/events");
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await api.post<Event>("/events", data);
    return response.data;
  },

  update: async (id: number, data: UpdateEventRequest): Promise<Event> => {
    const response = await api.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  getAttendees: async (eventId: number): Promise<User[]> => {
    const response = await api.get<User[]>(`/events/${eventId}/attendees`);
    return response.data;
  },

  addAttendee: async (eventId: number, userId: number): Promise<Attendee> => {
    const response = await api.post<Attendee>(
      `/events/${eventId}/attendees/${userId}`
    );
    console.log("Response:", response.data);
    return response.data;
  },

  removeAttendee: async (eventId: number, userId: number): Promise<void> => {
    await api.delete(`/events/${eventId}/attendees/${userId}`);
  },
};

// Attendees API
export const attendeesApi = {
  getEventsByAttendee: async (userId: number): Promise<Event[]> => {
    console.log("Fetching events for user:", userId);
    const response = await api.get<Event[]>(`/attendees/${userId}/events`);
    console.log("Response:", response.data);
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;
