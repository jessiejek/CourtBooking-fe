import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state">
      <ion-spinner name="dots"></ion-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [
    `
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 12px;
      color: #94a3b8;
    }
    .loading-state p {
      font-size: 0.875rem;
      margin: 0;
    }
    `
  ]
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}
