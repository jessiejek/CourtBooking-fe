import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-score-history',
  standalone: true,
  imports: [IonContent, IonIcon, PageHeaderComponent],
  templateUrl: './score-history.page.html',
  styleUrl: './score-history.page.scss',
})
export class ScoreHistoryPage {}
