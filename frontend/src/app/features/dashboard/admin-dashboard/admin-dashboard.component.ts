import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../core/api.config';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  closedCases: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [LoaderComponent],
  template: `
    <div class="dashboard">
      <h2>Admin Dashboard</h2>
      <app-loader [loading]="loading()" />

      @if (stats(); as s) {
        <div class="cards">
          <div class="card">
            <span class="num">{{ s.totalUsers }}</span>
            <span class="label">Total Users</span>
          </div>
          <div class="card">
            <span class="num">{{ s.totalClients }}</span>
            <span class="label">Total Clients</span>
          </div>
          <div class="card">
            <span class="num">{{ s.totalCases }}</span>
            <span class="label">Total Cases</span>
          </div>
          <div class="card">
            <span class="num open">{{ s.openCases }}</span>
            <span class="label">Open Cases</span>
          </div>
          <div class="card">
            <span class="num progress">{{ s.inProgressCases }}</span>
            <span class="label">In Progress</span>
          </div>
          <div class="card">
            <span class="num closed">{{ s.closedCases }}</span>
            <span class="label">Closed Cases</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .dashboard h2 {
        margin: 0 0 24px;
        font-size: 20px;
        color: #212529;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
      }
      .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .num {
        font-size: 32px;
        font-weight: 700;
        color: #212529;
      }
      .num.open {
        color: #f59f00;
      }
      .num.progress {
        color: #4263eb;
      }
      .num.closed {
        color: #2f9e44;
      }
      .label {
        font-size: 13px;
        color: #868e96;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<AdminStats | null>(null);
  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<AdminStats>(`${API.BASE_URL}${API.DASHBOARD.ADMIN}`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
