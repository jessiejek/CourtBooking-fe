import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Public landing
  { path: '', loadComponent: () => import('./features/public/public.page').then(m => m.PublicPage) },

  // Auth
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.page').then(m => m.LoginPage) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.page').then(m => m.RegisterPage) },
    ],
  },

  // User (authenticated)
  {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/user/pages/dashboard/user-dashboard.page').then(m => m.UserDashboardPage) },
    ],
  },

  // Admin
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/pages/dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage) },
    ],
  },

  // Staff
  {
    path: 'staff',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Staff'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/staff/pages/dashboard/staff-dashboard.page').then(m => m.StaffDashboardPage) },
    ],
  },

  // Scoring (requires auth)
  {
    path: 'score',
    canActivate: [AuthGuard],
    children: [
      { path: 'setup', loadComponent: () => import('./features/score/pages/setup/score-setup.page').then(m => m.ScoreSetupPage) },
      { path: 'live/:matchId', loadComponent: () => import('./features/score/pages/live/score-live.page').then(m => m.ScoreLivePage) },
      { path: 'match/:matchId/control', loadComponent: () => import('./features/score/pages/control/scorer-control.page').then(m => m.ScorerControlPage) },
      { path: 'history', loadComponent: () => import('./features/score/pages/history/score-history.page').then(m => m.ScoreHistoryPage) },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
