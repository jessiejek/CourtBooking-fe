import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scorer-control',
  standalone: true,
  imports: [NgIf, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, RouterLink],
  templateUrl: './scorer-control.page.html',
  styleUrl: './scorer-control.page.scss',
})
export class ScorerControlPage implements OnInit {
  matchId = '';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('matchId') ?? '';
  }
}
