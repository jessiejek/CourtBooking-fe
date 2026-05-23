import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';

export interface SearchResult {
  userId: string;
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-player-slot',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, IonInput, IonIcon],
  template: `
    <div class="player-slot">
      <div class="player-slot__input-row">
        <span class="player-slot__number">{{ playerIndex + 1 }}</span>
        <ion-input
          class="player-slot__input"
          [ngModel]="playerName"
          (ngModelChange)="onInputChange($event)"
          placeholder="Player {{ playerIndex + 1 }} name or search"
          fill="outline"
        ></ion-input>
        <ion-icon
          *ngIf="registeredUserId"
          name="checkmark-circle"
          class="player-slot__check"
        ></ion-icon>
      </div>

      <div *ngIf="searchResults.length > 0 && !selected" class="search-dropdown">
        <button
          type="button"
          class="search-dropdown__item"
          *ngFor="let r of searchResults"
          (click)="selectResult(r)"
        >
          <strong>{{ r.fullName }}</strong>
          <span>{{ r.email }}</span>
        </button>
      </div>

      <div *ngIf="registeredUserId && !isGuest" class="player-slot__tag">
        Registered player
      </div>
      <div *ngIf="!registeredUserId && playerName" class="player-slot__tag player-slot__tag--guest">
        Guest
      </div>
    </div>
  `,
  styles: [`
    .player-slot {
      margin-bottom: 8px;
      position: relative;
    }
    .player-slot__input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .player-slot__number {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #5d3e8e;
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .player-slot__input {
      flex: 1;
    }
    .player-slot__check {
      color: #16a34a;
      font-size: 20px;
      flex-shrink: 0;
    }
    .search-dropdown {
      position: absolute;
      top: 100%;
      left: 32px;
      right: 0;
      z-index: 100;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      max-height: 200px;
      overflow-y: auto;
    }
    .search-dropdown__item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.85rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .search-dropdown__item:last-child {
      border-bottom: none;
    }
    .search-dropdown__item:hover {
      background: #f8fafc;
    }
    .search-dropdown__item strong {
      color: #0f172a;
    }
    .search-dropdown__item span {
      color: #94a3b8;
      font-size: 0.8rem;
    }
    .player-slot__tag {
      font-size: 0.7rem;
      color: #16a34a;
      font-weight: 600;
      padding: 2px 0 0 32px;
    }
    .player-slot__tag--guest {
      color: #94a3b8;
    }
  `],
})
export class PlayerSlotComponent implements OnDestroy {
  @Input() playerIndex = 0;
  @Input() teamCode = 'A';
  @Input() playerName = '';
  @Input() registeredUserId: string | null = null;
  @Input() isGuest = true;

  @Output() playerSearch = new EventEmitter<string>();
  @Output() playerSelect = new EventEmitter<{ userId: string; fullName: string }>();
  @Output() playerNameChange = new EventEmitter<string>();

  searchResults: SearchResult[] = [];
  selected = false;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  onInputChange(value: string): void {
    this.selected = false;
    this.playerNameChange.emit(value);

    if (value.length >= 2) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.playerSearch.emit(value);
      }, 300);
    } else {
      this.searchResults = [];
    }
  }

  selectResult(r: SearchResult): void {
    this.selected = true;
    this.searchResults = [];
    this.playerSelect.emit({ userId: r.userId, fullName: r.fullName });
  }

  setSearchResults(results: SearchResult[]): void {
    if (!this.selected) {
      this.searchResults = results;
    }
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }
}
