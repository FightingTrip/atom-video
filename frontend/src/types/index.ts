export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
