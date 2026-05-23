import { Component } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterLink],
  templateUrl: './public.page.html',
  styleUrl: './public.page.scss',
})
export class PublicPage {}
