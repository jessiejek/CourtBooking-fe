import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonInput, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { ScoringService } from '../../../../core/services/scoring.service';
import { SettingsService } from '../../../../core/services/settings.service';
import {
  ScoreSportDto,
  ScoreRuleSetDto,
  CreateScoringMatchRequest,
  CreateScoringTeamRequest,
  CreateScoringPlayerRequest,
  ScoringMatchDto,
} from '../../../../core/models';
import { PlayerSlotComponent } from '../../../../shared/components/player-slot/player-slot.component';

interface PlayerState {
  playerName: string;
  registeredUserId: string | null;
  isGuest: boolean;
}

@Component({
  selector: 'app-score-setup',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe, FormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonSpinner,
    PlayerSlotComponent,
  ],
  templateUrl: './score-setup.page.html',
  styleUrl: './score-setup.page.scss',
})
export class ScoreSetupPage implements OnInit {
  loadingInit = true;
  isSubmitting = false;
  formError = '';

  sports: ScoreSportDto[] = [];
  selectedSport: ScoreSportDto | null = null;
  selectedRuleSet: ScoreRuleSetDto | null = null;
  gameType: 'SINGLES' | 'DOUBLES' = 'SINGLES';

  teamAName = 'Player A';
  teamBName = 'Player B';

  playersA: PlayerState[] = [{ playerName: '', registeredUserId: null, isGuest: true }];
  playersB: PlayerState[] = [{ playerName: '', registeredUserId: null, isGuest: true }];

  /* History */
  recentMatches: ScoringMatchDto[] = [];
  historyLoading = false;

  constructor(
    private readonly scoringService: ScoringService,
    private readonly router: Router,
    private readonly toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.loadSetup();
    this.loadHistory();
  }

  get playerSlotsA(): number[] {
    return Array(this.gameType === 'DOUBLES' ? 2 : 1).fill(0);
  }

  get playerSlotsB(): number[] {
    return Array(this.gameType === 'DOUBLES' ? 2 : 1).fill(0);
  }

  private async loadSetup(): Promise<void> {
    this.loadingInit = true;
    try {
      const sports = await firstValueFrom(this.scoringService.getSports());
      this.sports = sports ?? [];

      this.selectedSport = this.sports.find((s) => s.code === 'PICKLEBALL') ?? this.sports[0] ?? null;

      if (this.selectedSport) {
        const ruleSets = await firstValueFrom(this.scoringService.getRuleSets(this.selectedSport.code));
        const rs = ruleSets ?? [];
        this.selectedRuleSet = rs.find((r) => r.code === 'PICKLEBALL_SIDE_OUT_11') ?? rs[0] ?? null;
      }
    } catch {
      this.formError = 'Failed to load scoring configuration.';
    }
    this.loadingInit = false;
  }

  private loadHistory(): void {
    this.historyLoading = true;
    this.scoringService.getMyHistory().subscribe({
      next: (matches) => {
        this.recentMatches = matches ?? [];
        this.historyLoading = false;
      },
      error: () => {
        this.historyLoading = false;
      },
    });
  }

  setGameType(type: 'SINGLES' | 'DOUBLES'): void {
    this.gameType = type;
    this.formError = '';

    if (type === 'DOUBLES') {
      this.teamAName = 'Team A';
      this.teamBName = 'Team B';
      this.playersA = [
        { playerName: '', registeredUserId: null, isGuest: true },
        { playerName: '', registeredUserId: null, isGuest: true },
      ];
      this.playersB = [
        { playerName: '', registeredUserId: null, isGuest: true },
        { playerName: '', registeredUserId: null, isGuest: true },
      ];
    } else {
      this.teamAName = 'Player A';
      this.teamBName = 'Player B';
      this.playersA = [{ playerName: '', registeredUserId: null, isGuest: true }];
      this.playersB = [{ playerName: '', registeredUserId: null, isGuest: true }];
    }
  }

  onPlayerSelect(team: 'A' | 'B', index: number, result: { userId: string; fullName: string }): void {
    const player = { playerName: result.fullName, registeredUserId: result.userId, isGuest: false };
    if (team === 'A') this.playersA[index] = player;
    else this.playersB[index] = player;
  }

  onPlayerNameChange(team: 'A' | 'B', index: number, value: string): void {
    const player = { playerName: value, registeredUserId: null, isGuest: true };
    if (team === 'A') this.playersA[index] = player;
    else this.playersB[index] = player;
  }

  async startMatch(): Promise<void> {
    this.formError = '';

    if (!this.selectedSport || !this.selectedRuleSet) {
      this.formError = 'Sport and rule set configuration is missing.';
      return;
    }

    const allPlayers = [...this.playersA, ...this.playersB];
    if (allPlayers.some((p) => !p.playerName.trim())) {
      this.formError = 'All player names are required.';
      return;
    }

    if (!this.teamAName.trim() || !this.teamBName.trim()) {
      this.formError = 'Team names are required.';
      return;
    }

    this.isSubmitting = true;

    const buildTeam = (code: string, teamName: string, players: PlayerState[]): CreateScoringTeamRequest => ({
      teamCode: code,
      teamName: teamName.trim(),
      players: players.map(
        (p): CreateScoringPlayerRequest => ({
          registeredUserId: p.registeredUserId,
          playerName: p.playerName.trim(),
          isGuest: p.isGuest,
        }),
      ),
    });

    const payload: CreateScoringMatchRequest = {
      bookingId: null,
      sportCode: this.selectedSport.code,
      ruleSetCode: this.selectedRuleSet.code,
      matchMode: 'OPEN_PLAY',
      gameType: this.gameType,
      targetScore: this.selectedRuleSet.targetScore,
      winBy: this.selectedRuleSet.winBy,
      teams: [
        buildTeam('A', this.teamAName, this.playersA),
        buildTeam('B', this.teamBName, this.playersB),
      ],
    };

    this.scoringService.createMatch(payload).subscribe({
      next: async (match) => {
        this.isSubmitting = false;
        const toast = await this.toastCtrl.create({ message: 'Match created!', duration: 2000, color: 'success', position: 'top' });
        await toast.present();
        this.loadHistory();
        this.router.navigate(['/score/match', match.id, 'control']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.message || 'Failed to create match.';
      },
    });
  }
}
