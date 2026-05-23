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

/* ── Scoring Models ── */

export interface ScoreSportDto {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ScoreRuleSetDto {
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

export interface ScoringSettingDto {
  scoringRequiresBooking: boolean;
}

export interface RegisteredPlayerSearchDto {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface CreateScoringPlayerRequest {
  registeredUserId: string | null;
  playerName: string;
  isGuest: boolean;
}

export interface CreateScoringTeamRequest {
  teamCode: string;
  teamName: string;
  players: CreateScoringPlayerRequest[];
}

export interface CreateScoringMatchRequest {
  bookingId: string | null;
  sportCode: string;
  ruleSetCode: string;
  matchMode: string;
  gameType: string;
  targetScore: number;
  winBy: number;
  teams: CreateScoringTeamRequest[];
}

export interface ScoringPlayerDto {
  id: string;
  registeredUserId: string | null;
  playerName: string;
  playerOrder: number;
  isGuest: boolean;
}

export interface ScoringTeamDto {
  id: string;
  teamCode: string;
  teamName: string;
  score: number;
  players: ScoringPlayerDto[];
}

export interface ScoringMatchDto {
  id: string;
  bookingId: string | null;
  sportCode: string;
  sportName: string;
  ruleSetCode: string;
  ruleSetName: string;
  matchMode: string;
  gameType: string;
  targetScore: number;
  winBy: number;
  teamAScore: number;
  teamBScore: number;
  servingTeam: string;
  serverNumber: number | null;
  scoreCall: string;
  status: string;
  winnerTeam: string | null;
  isOpenPlay: boolean;
  startedAt: string;
  completedAt: string | null;
  teams: ScoringTeamDto[];
}
