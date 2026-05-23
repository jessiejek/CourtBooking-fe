import { Component } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, RouterLink],
  templateUrl: './staff-dashboard.page.html',
  styleUrl: './staff-dashboard.page.scss',
})
export class StaffDashboardPage {}
