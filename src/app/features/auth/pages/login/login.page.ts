import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonIcon,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.loading = true;
    this.error = '';

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.router.navigateByUrl(this.getRedirectUrl());
      },
      error: (err) => {
        this.error = err.message || 'Login failed.';
        this.loading = false;
      },
    });
  }

  private getRedirectUrl(): string {
    const role = this.auth.currentUser?.role;
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'Staff') return '/staff/dashboard';
    return '/user/dashboard';
  }
}
