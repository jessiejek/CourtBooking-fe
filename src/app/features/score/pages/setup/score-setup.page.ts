import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-score-setup',
  standalone: true,
  imports: [IonContent, PageHeaderComponent],
  templateUrl: './score-setup.page.html',
  styleUrl: './score-setup.page.scss',
})
export class ScoreSetupPage {}
