import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [AsyncPipe, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, RouterLink],
  templateUrl: './user-dashboard.page.html',
  styleUrl: './user-dashboard.page.scss',
})
export class UserDashboardPage {
  currentUser$ = this.auth.currentUser$;
  constructor(private readonly auth: AuthService) {}
}
