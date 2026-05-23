import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="'badge--' + colorClass">
      {{ label }}
    </span>
  `,
  styles: [
    `
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 999px;
      white-space: nowrap;
    }
    .badge--primary { background: #e0d4f0; color: #5d3e8e; }
    .badge--success { background: #dcfce7; color: #166534; }
    .badge--warning { background: #fef3c7; color: #92400e; }
    .badge--danger { background: #fee2e2; color: #991b1b; }
    .badge--neutral { background: #f1f5f9; color: #475569; }
    .badge--info { background: #dbeafe; color: #1e40af; }
    `
  ]
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() colorClass = 'neutral';
}
