import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="variant()"
      (click)="click.emit($event)"
    >
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [
    `
      button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .primary {
        background: #4263eb;
        color: white;
      }
      .primary:hover:not(:disabled) {
        background: #3b5bdb;
      }
      .secondary {
        background: white;
        color: #495057;
        border-color: #dee2e6;
      }
      .secondary:hover:not(:disabled) {
        background: #f8f9fa;
      }
      .danger {
        background: #e03131;
        color: white;
      }
      .danger:hover:not(:disabled) {
        background: #c92a2a;
      }
      .ghost {
        background: transparent;
        color: #4263eb;
      }
      .ghost:hover:not(:disabled) {
        background: #edf2ff;
      }
      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  disabled = input(false);
  loading = input(false);
  click = output<Event>();
}
