import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { loadGoogleSdk, GoogleCredentialResponse } from '../../../../shared/helpers/google-sdk';

declare const FB: any;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonSpinner,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage implements AfterViewInit {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  googleLoading = false;
  facebookLoading = false;
  error = '';
  returnUrl = '';
  googleSdkError: string | null = null;
  private destroyed = false;

  readonly googleClientId = environment.googleClientId;
  readonly canUseGoogleLogin = this.googleClientId.trim().length > 0;

  @ViewChild('googleButton', { static: false })
  private googleButton?: ElementRef<HTMLElement>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastCtrl: ToastController,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '';
    void this.initializeGoogleButton();
  }

  private async initializeGoogleButton(): Promise<void> {
    if (!this.canUseGoogleLogin || !this.googleButton?.nativeElement || this.destroyed) return;

    try {
      const google = await loadGoogleSdk();

      if (this.destroyed || !this.googleButton?.nativeElement) return;

      google.initialize({
        client_id: this.googleClientId.trim(),
        callback: (response: GoogleCredentialResponse) =>
          this.ngZone.run(() => {
            if (!this.destroyed) void this.handleGoogleCredential(response);
          }),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const container = this.googleButton.nativeElement;
      container.replaceChildren();

      google.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'continue_with',
        width: Math.max(240, Math.min(container.clientWidth || 320, 400)),
      });
    } catch (error) {
      if (this.destroyed) return;
      this.googleSdkError = error instanceof Error ? error.message : 'Google sign-in failed to initialize.';
    }
  }

  private async handleGoogleCredential(response: GoogleCredentialResponse): Promise<void> {
    if (this.destroyed) return;

    if (!response.credential) {
      this.error = 'Google sign-in did not return a token.';
      return;
    }

    console.log('Google credential received:', !!response.credential);

    this.googleLoading = true;
    this.error = '';

    this.auth
      .socialLogin({ provider: 'google', idToken: response.credential, accessToken: null })
      .pipe(finalize(() => (this.googleLoading = false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl || this.getRedirectUrl()),
        error: (err) => (this.error = err.message || 'Google login failed.'),
      });
  }

  async onGoogleFallbackClick(): Promise<void> {
    if (!this.canUseGoogleLogin) {
      this.error = 'Google sign-in is not configured yet.';
      return;
    }

    this.googleSdkError = null;
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await this.initializeGoogleButton();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.loading = true;
    this.error = '';

    this.auth.login({ email, password }).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl || this.getRedirectUrl()),
      error: (err) => {
        this.error = err.message || 'Login failed.';
        this.loading = false;
      },
    });
  }

  onFacebookLogin(): void {
    this.facebookLoading = true;
    this.error = '';

    const doFb = () => {
      if (typeof FB === 'undefined') {
        this.facebookLoading = false;
        this.error = 'Facebook SDK not available.';
        return;
      }

      FB.init({ appId: environment.facebookAppId, version: environment.facebookSdkVersion, xfbml: false, cookie: false });

      FB.login(
        (response: any) => {
          this.ngZone.run(() => {
            if (response.authResponse?.accessToken) {
              this.auth
                .socialLogin({ provider: 'facebook', idToken: null, accessToken: response.authResponse.accessToken })
                .subscribe({
                  next: () => this.router.navigateByUrl(this.returnUrl || this.getRedirectUrl()),
                  error: (err) => {
                    this.error = err.message || 'Facebook login failed.';
                    this.facebookLoading = false;
                  },
                });
            } else {
              this.error = 'Facebook sign-in was cancelled or permission was denied.';
              this.facebookLoading = false;
            }
          });
        },
        { scope: 'email,public_profile' },
      );
    };

    if (typeof FB === 'undefined') {
      const s = document.createElement('script');
      s.src = 'https://connect.facebook.net/en_US/sdk.js';
      s.onload = doFb;
      s.onerror = () => {
        this.facebookLoading = false;
        this.error = 'Facebook SDK failed to load.';
      };
      document.body.appendChild(s);
      return;
    }

    doFb();
  }

  private getRedirectUrl(): string {
    const role = this.auth.currentUser?.role;
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'Staff') return '/staff/dashboard';
    return '/user/dashboard';
  }
}
