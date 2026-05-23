import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSpinner, IonIcon,
} from '@ionic/angular/standalone';
import { ScoringService } from '../../../../core/services/scoring.service';
import { ScoringMatchDto } from '../../../../core/models';

@Component({
  selector: 'app-score-live',
  standalone: true,
  imports: [NgIf, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonIcon],
  templateUrl: './score-live.page.html',
  styleUrl: './score-live.page.scss',
})
export class ScoreLivePage implements OnInit {
  match: ScoringMatchDto | null = null;
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoringService: ScoringService
  ) {}

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('matchId');
    if (!matchId) {
      this.loading = false;
      return;
    }

    this.scoringService.getMatch(matchId).subscribe({
      next: (match) => {
        this.match = match;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
