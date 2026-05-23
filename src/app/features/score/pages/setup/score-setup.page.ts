import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonInput, IonSpinner,
} from '@ionic/angular/standalone';
import { ScoringService } from '../../../../core/services/scoring.service';
import { SettingsService } from '../../../../core/services/settings.service';
import {
  ScoreSportDto,
  ScoreRuleSetDto,
  CreateScoringMatchRequest,
  CreateScoringTeamRequest,
  CreateScoringPlayerRequest,
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
    NgIf, NgFor, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonSpinner,
    PlayerSlotComponent,
  ],
  templateUrl: './score-setup.page.html',
  styleUrl: './score-setup.page.scss',
})
export class ScoreSetupPage implements OnInit {
  loadingInit = true;
  requiresBooking = false;
  isSubmitting = false;
  formError = '';

  sports: ScoreSportDto[] = [];
  ruleSets: ScoreRuleSetDto[] = [];

  selectedSport: ScoreSportDto | null = null;
  selectedRuleSet: ScoreRuleSetDto | null = null;
  gameType: 'Doubles' | 'Singles' = 'Doubles';

  teamAName = 'Team A';
  teamBName = 'Team B';

  playersA: PlayerState[] = [{ playerName: '', registeredUserId: null, isGuest: true }];
  playersB: PlayerState[] = [{ playerName: '', registeredUserId: null, isGuest: true }];

  constructor(
    private readonly scoringService: ScoringService,
    private readonly settingsService: SettingsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get playerSlotsA(): number[] {
    return Array(this.gameType === 'Doubles' ? 2 : 1).fill(0);
  }

  get playerSlotsB(): number[] {
    return Array(this.gameType === 'Doubles' ? 2 : 1).fill(0);
  }

  private async loadData(): Promise<void> {
    this.loadingInit = true;

    try {
      const [requiresBooking, sports] = await Promise.all([
        firstValueFrom(this.settingsService.getScoringSetting()),
        firstValueFrom(this.scoringService.getSports()),
      ]);

      this.requiresBooking = requiresBooking ?? false;
      this.sports = sports ?? [];

      // Default to Pickleball
      this.selectedSport = this.sports.find(
        (s) => s.code === 'PICKLEBALL'
      ) ?? this.sports[0] ?? null;

      if (this.selectedSport) {
        const ruleSets = await firstValueFrom(
          this.scoringService.getRuleSets(this.selectedSport.code)
        );
        this.ruleSets = ruleSets ?? [];
        this.selectedRuleSet = this.ruleSets.find(
          (r) => r.code === 'PICKLEBALL_SIDE_OUT_11'
        ) ?? this.ruleSets[0] ?? null;
      }
    } catch {
      // Load failure handled gracefully by leaving empty states
    }

    this.loadingInit = false;
  }

  setGameType(type: 'Doubles' | 'Singles'): void {
    this.gameType = type;
    this.formError = '';

    // Reset player slots
    if (type === 'Doubles') {
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
    if (team === 'A') {
      this.playersA[index] = {
        playerName: result.fullName,
        registeredUserId: result.userId,
        isGuest: false,
      };
    } else {
      this.playersB[index] = {
        playerName: result.fullName,
        registeredUserId: result.userId,
        isGuest: false,
      };
    }
  }

  onPlayerNameChange(team: 'A' | 'B', index: number, value: string): void {
    if (team === 'A') {
      this.playersA[index] = {
        playerName: value,
        registeredUserId: null,
        isGuest: true,
      };
    } else {
      this.playersB[index] = {
        playerName: value,
        registeredUserId: null,
        isGuest: true,
      };
    }
  }

  startMatch(): void {
    this.formError = '';

    // Validate
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
        })
      ),
    });

    const payload: CreateScoringMatchRequest = {
      bookingId: null,
      sportCode: this.selectedSport.code,
      ruleSetCode: this.selectedRuleSet.code,
      matchMode: 'OpenPlay',
      gameType: this.gameType,
      targetScore: this.selectedRuleSet.targetScore,
      winBy: this.selectedRuleSet.winBy,
      teams: [
        buildTeam('A', this.teamAName, this.playersA),
        buildTeam('B', this.teamBName, this.playersB),
      ],
    };

    this.scoringService.createMatch(payload).subscribe({
      next: (match) => {
        this.isSubmitting = false;
        this.router.navigate(['/score/match', match.id, 'control']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.message || 'Failed to create match.';
      },
    });
  }
}
