import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="overlay" (click)="close.emit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="header">
            <h3>{{ title() }}</h3>
            <button class="close" (click)="close.emit()">&times;</button>
          </div>
          <div class="body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 520px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid #eee;
      }
      .header h3 {
        margin: 0;
        font-size: 16px;
      }
      .close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #868e96;
        padding: 0;
        line-height: 1;
      }
      .body {
        padding: 24px;
      }
    `,
  ],
})
export class ModalComponent {
  open = input(false);
  title = input('');
  close = output<void>();
}
