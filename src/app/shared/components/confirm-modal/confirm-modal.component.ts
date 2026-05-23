import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="modal-overlay" *ngIf="show" (click)="cancel.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-ghost" (click)="cancel.emit()">Cancel</button>
          <button class="btn-primary" (click)="confirm.emit()">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    .modal-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.125rem;
    }
    .modal-card p {
      margin: 0 0 20px 0;
      color: #64748b;
      font-size: 0.875rem;
    }
    .modal-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .btn-ghost {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-primary {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: #5d3e8e;
      color: #fff;
      cursor: pointer;
      font-size: 0.875rem;
    }
    `
  ]
})
export class ConfirmModalComponent {
  @Input() show = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmLabel = 'Confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
