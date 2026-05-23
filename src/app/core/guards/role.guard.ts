import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
