import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (loading()) {
      <div class="loader-overlay">
        <div class="spinner"></div>
        @if (text()) {
          <p>{{ text() }}</p>
        }
      </div>
    }
  `,
  styles: [
    `
      .loader-overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px;
      }
      .spinner {
        width: 36px;
        height: 36px;
        border: 3px solid #e9ecef;
        border-top-color: #4263eb;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      p {
        color: #868e96;
        font-size: 14px;
        margin: 0;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  loading = input(false);
  text = input('Loading...');
}
