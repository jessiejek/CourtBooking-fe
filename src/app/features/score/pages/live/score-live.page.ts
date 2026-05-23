import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-score-live',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './score-live.page.html',
  styleUrl: './score-live.page.scss',
})
export class ScoreLivePage {}
