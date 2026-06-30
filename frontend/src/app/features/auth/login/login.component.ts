import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <span class="logo">⚖️</span>
          <h1>LexFlow</h1>
          <p>AI Powered Legal Case Management</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="form">
          @if (error()) {
            <div class="error">{{ error() }}</div>
          }

          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email"
              required
              autocomplete="email"
            />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>

          <button type="submit" [disabled]="loading()" class="btn-primary">
            @if (loading()) {
              <span class="spinner"></span>
            }
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f3f5;
      }
      .login-card {
        background: white;
        border-radius: 16px;
        padding: 40px;
        width: 380px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      }
      .brand {
        text-align: center;
        margin-bottom: 32px;
      }
      .logo {
        font-size: 40px;
      }
      .brand h1 {
        margin: 8px 0 4px;
        font-size: 24px;
        color: #212529;
      }
      .brand p {
        margin: 0;
        font-size: 13px;
        color: #868e96;
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .field label {
        font-size: 13px;
        font-weight: 500;
        color: #495057;
      }
      .field input {
        padding: 10px 12px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.15s;
      }
      .field input:focus {
        border-color: #4263eb;
        box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
      }
      .btn-primary {
        padding: 10px;
        background: #4263eb;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.15s;
      }
      .btn-primary:hover:not(:disabled) {
        background: #3b5bdb;
      }
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .error {
        background: #fff5f5;
        color: #e03131;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        border: 1px solid #ffc9c9;
      }
      .spinner {
        width: 16px;
        height: 16px;
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
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.error.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['']),
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password');
      },
    });
  }
}
