import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [LoaderComponent, DatePipe],
  template: `
    <div class="page">
      <app-loader [loading]="loading()" />
      @if (client(); as c) {
        <h2>{{ c.name }}</h2>
        <div class="detail-card">
          <div class="row"><span>Email</span><span>{{ c.email }}</span></div>
          <div class="row"><span>Phone</span><span>{{ c.phone }}</span></div>
          <div class="row"><span>Address</span><span>{{ c.address }}</span></div>
          <div class="row"><span>Created</span><span>{{ c.createdAt | date }}</span></div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 600px; }
      h2 { margin: 0 0 20px; font-size: 20px; }
      .detail-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f1f3f5;
        font-size: 14px;
      }
      .row:last-child { border: none; }
      .row span:first-child { color: #868e96; font-weight: 500; }
    `,
  ],
})
export class ClientDetailComponent implements OnInit {
  client = signal<Client | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getById(id).subscribe({
      next: (data) => {
        this.client.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
