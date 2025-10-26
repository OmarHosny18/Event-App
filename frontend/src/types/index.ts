// User Types
export interface User {
  Id: number; // Changed from Id
  Name: string; // Changed from Name
  Email: string; // Changed from Email
}
// Event Types
export interface Event {
  Id: number;
  UserId: number;
  Name: string;
  Description: string;
  DateTime: string;
  Location: string;
}
// Attendee Types
export interface Attendee {
  id: number;
  name: string;
  UserId: number;
  EventId: number;
}

// API Request/Response Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateEventRequest {
  Name: string;
  Description: string;
  Location: string;
  DateTime: string;
}

export interface UpdateEventRequest extends CreateEventRequest {
  Id: number;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Error Response
export interface ApiError {
  error: string;
}

export interface LoginResponse {
  token: string;
  user: User; // ✅ Add user object to login response
}
