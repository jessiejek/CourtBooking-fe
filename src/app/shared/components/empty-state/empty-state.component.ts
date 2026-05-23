import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">
        <ion-icon [name]="icon"></ion-icon>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__description">{{ description }}</p>
    </div>
  `,
  styles: [
    `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-state__icon {
      font-size: 48px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }
    .empty-state__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }
    .empty-state__description {
      font-size: 0.875rem;
      color: #94a3b8;
      max-width: 360px;
      margin: 0;
    }
    `
  ]
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'Nothing here';
  @Input() description = '';
}
