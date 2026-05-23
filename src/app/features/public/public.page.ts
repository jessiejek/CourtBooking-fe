import { Component } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  templateUrl: './public.page.html',
  styleUrl: './public.page.scss',
})
export class PublicPage {
  constructor(private readonly router: Router) {}

  goTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}
