import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'court_access_token';
  private readonly REFRESH_KEY = 'court_refresh_token';

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}
