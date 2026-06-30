import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../core/api.config';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

interface LawyerStats {
  assignedCases: number;
  pendingTasks: number;
  completedTasks: number;
}

@Component({
  selector: 'app-lawyer-dashboard',
  standalone: true,
  imports: [LoaderComponent],
  template: `
    <div class="dashboard">
      <h2>Lawyer Dashboard</h2>
      <app-loader [loading]="loading()" />

      @if (stats(); as s) {
        <div class="cards">
          <div class="card">
            <span class="num">{{ s.assignedCases }}</span>
            <span class="label">Assigned Cases</span>
          </div>
          <div class="card">
            <span class="num open">{{ s.pendingTasks }}</span>
            <span class="label">Pending Tasks</span>
          </div>
          <div class="card">
            <span class="num closed">{{ s.completedTasks }}</span>
            <span class="label">Completed Tasks</span>
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
export class LawyerDashboardComponent implements OnInit {
  stats = signal<LawyerStats | null>(null);
  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<LawyerStats>(`${API.BASE_URL}${API.DASHBOARD.LAWYER}`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
