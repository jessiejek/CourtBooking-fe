export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Staff' | 'User' | 'Umpire';
  avatarUrl: string | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ScoreSport {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ScoreRuleSet {
  id: string;
  sportId: string;
  code: string;
  name: string;
  scoringMode: string;
  targetScore: number;
  winBy: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ScoringSetting {
  key: string;
  value: string;
}
