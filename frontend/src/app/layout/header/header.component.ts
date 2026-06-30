import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <div class="page-title">
        <ng-content />
      </div>
      <div class="user-info">
        <span class="user-name">{{ auth.userName() }}</span>
        <span class="user-role">{{ auth.userRole() }}</span>
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 32px;
        background: white;
        border-bottom: 1px solid #e9ecef;
        height: 64px;
      }
      .page-title {
        font-size: 20px;
        font-weight: 600;
        color: #212529;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #495057;
      }
      .user-role {
        font-size: 12px;
        background: #edf2ff;
        color: #4263eb;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: 500;
      }
      .logout-btn {
        padding: 6px 16px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        background: white;
        color: #495057;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .logout-btn:hover {
        background: #f8f9fa;
        border-color: #adb5bd;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
