import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../core/services/search.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ButtonComponent, LoaderComponent],
  template: `
    <div class="page">
      <h2>Search</h2>
      <div class="search-bar">
        <input
          [(ngModel)]="query"
          (keyup.enter)="onSearch()"
          placeholder="Search cases, clients, users..."
        />
        <app-button (click)="onSearch()" [loading]="loading()">Search</app-button>
      </div>

      <app-loader [loading]="loading()" />

      @if (results(); as r) {
        @if (r.cases.length) {
          <h3>Cases</h3>
          <div class="results">
            @for (c of r.cases; track c.id) {
              <div class="result-item">
                <strong>{{ c.title }}</strong>
                <span class="badge">{{ c.status }}</span>
              </div>
            }
          </div>
        }
        @if (r.clients.length) {
          <h3>Clients</h3>
          <div class="results">
            @for (c of r.clients; track c.id) {
              <div class="result-item">
                <strong>{{ c.name }}</strong>
                <span>{{ c.email }}</span>
              </div>
            }
          </div>
        }
        @if (r.users.length) {
          <h3>Users</h3>
          <div class="results">
            @for (u of r.users; track u.id) {
              <div class="result-item">
                <strong>{{ u.name }}</strong>
                <span>{{ u.email }}</span>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 700px; }
      h2 { margin: 0 0 20px; font-size: 20px; }
      h3 { margin: 20px 0 10px; font-size: 15px; color: #495057; }
      .search-bar {
        display: flex; gap: 8px; margin-bottom: 20px;
      }
      .search-bar input {
        flex: 1; padding: 10px 14px; border: 1px solid #dee2e6;
        border-radius: 8px; font-size: 14px; outline: none;
      }
      .search-bar input:focus { border-color: #4263eb; }
      .results {
        display: flex; flex-direction: column; gap: 8px;
      }
      .result-item {
        display: flex; align-items: center; gap: 12px;
        background: white; padding: 12px 16px; border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        font-size: 14px;
      }
      .result-item span { color: #868e96; }
      .badge {
        padding: 2px 8px; border-radius: 10px; font-size: 11px;
        background: #dbe4ff; color: #4263eb; font-weight: 500;
      }
    `,
  ],
})
export class SearchComponent {
  query = '';
  results = signal<SearchResult | null>(null);
  loading = signal(false);

  constructor(private searchService: SearchService) {}

  onSearch(): void {
    if (!this.query.trim()) return;
    this.loading.set(true);
    this.searchService.search(this.query).subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
