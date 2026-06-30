import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../core/api.config';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

interface ClientStats {
  clientId: string;
  clientName?: string;
  totalCases: number;
  totalDocuments: number;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [LoaderComponent],
  template: `
    <div class="dashboard">
      <h2>My Dashboard</h2>
      <app-loader [loading]="loading()" />

      @if (stats(); as s) {
        <div class="cards">
          <div class="card">
            <span class="num">{{ s.totalCases }}</span>
            <span class="label">Total Cases</span>
          </div>
          <div class="card">
            <span class="num">{{ s.totalDocuments }}</span>
            <span class="label">Total Documents</span>
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
      .label {
        font-size: 13px;
        color: #868e96;
      }
    `,
  ],
})
export class ClientDashboardComponent implements OnInit {
  stats = signal<ClientStats | null>(null);
  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const clientId = 0;
    this.http.get<ClientStats>(`${API.BASE_URL}${API.DASHBOARD.CLIENT(clientId)}`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
