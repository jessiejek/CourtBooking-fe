import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSpinner, IonIcon,
} from '@ionic/angular/standalone';
import { ScoringService } from '../../../../core/services/scoring.service';
import { ScoringMatchDto } from '../../../../core/models';

@Component({
  selector: 'app-score-history',
  standalone: true,
  imports: [
    NgIf, NgFor, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonSpinner, IonIcon,
  ],
  templateUrl: './score-history.page.html',
  styleUrl: './score-history.page.scss',
})
export class ScoreHistoryPage implements OnInit {
  matches: ScoringMatchDto[] = [];
  loading = true;

  constructor(private readonly scoringService: ScoringService) {}

  ngOnInit(): void {
    this.scoringService.getMyHistory().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
