import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonSpinner,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
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

    const { fullName, email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register({ fullName, email, password }).subscribe({
      next: () => {
        this.router.navigateByUrl(this.getRedirectUrl());
      },
      error: (err) => {
        this.error = err.message || 'Registration failed.';
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
