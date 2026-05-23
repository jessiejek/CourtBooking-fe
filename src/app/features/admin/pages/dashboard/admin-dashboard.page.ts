import { Component } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, RouterLink],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
})
export class AdminDashboardPage {}
