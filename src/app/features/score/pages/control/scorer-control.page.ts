import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-scorer-control',
  standalone: true,
  imports: [IonContent, IonButton, PageHeaderComponent],
  templateUrl: './scorer-control.page.html',
  styleUrl: './scorer-control.page.scss',
})
export class ScorerControlPage {}
