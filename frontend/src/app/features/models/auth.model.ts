export interface AuthResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}
