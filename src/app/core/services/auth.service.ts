import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly token: TokenService
  ) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.token.hasToken() && !!this.currentUser;
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap((res) => this.handleAuthResponse(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', data).pipe(
      tap((res) => this.handleAuthResponse(res))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.token.getRefreshToken();
    return this.api.post<AuthResponse>('/auth/refresh-token', { refreshToken }).pipe(
      tap((res) => this.handleAuthResponse(res))
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('/auth/logout', {}).pipe(
      tap(() => this.clearSession())
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.api.get<User>('/auth/me').pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }

  private handleAuthResponse(res: AuthResponse): void {
    this.token.setTokens(res.accessToken, res.refreshToken);
    this.currentUserSubject.next(res.user);
  }

  clearSession(): void {
    this.token.clearTokens();
    this.currentUserSubject.next(null);
  }
}
