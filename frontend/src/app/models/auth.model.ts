export interface LoginResponse {
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
