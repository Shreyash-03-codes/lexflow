import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client, CreateClientRequest } from '../../../core/models/client.model';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [FormsModule, TableComponent, ButtonComponent, ModalComponent, LoaderComponent],
  template: `
    <div class="page">
      <div class="header">
        <h2>Clients</h2>
        <app-button (click)="showCreate.set(true)">+ Create Client</app-button>
      </div>

      <app-loader [loading]="loading()" />

      <app-modal [open]="showCreate()" title="Create Client" (close)="showCreate.set(false)">
        <form (ngSubmit)="onCreate()" class="create-form">
          <div class="field">
            <label>Name</label>
            <input [(ngModel)]="createData.name" name="name" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="createData.email" name="email" required />
          </div>
          <div class="field">
            <label>Phone</label>
            <input [(ngModel)]="createData.phone" name="phone" required />
          </div>
          <div class="field">
            <label>Address</label>
            <input [(ngModel)]="createData.address" name="address" required />
          </div>
          <div class="actions">
            <app-button variant="secondary" (click)="showCreate.set(false)">Cancel</app-button>
            <app-button type="submit" [loading]="creating()">Create</app-button>
          </div>
        </form>
      </app-modal>

      @if (clients().length) {
        <app-table
          [columns]="columns"
          [data]="clients()"
          (rowClick)="viewClient($event)"
        />
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 960px; }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .header h2 { margin: 0; font-size: 20px; }
      .create-form { display: flex; flex-direction: column; gap: 14px; }
      .field { display: flex; flex-direction: column; gap: 4px; }
      .field label { font-size: 13px; font-weight: 500; color: #495057; }
      .field input { padding: 8px 10px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px; }
      .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    `,
  ],
})
export class ClientListComponent implements OnInit {
  clients = signal<Client[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreate = signal(false);

  createData: CreateClientRequest = { name: '', email: '', phone: '', address: '' };

  columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Created' },
  ];

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients.set(
          data.map((c) => ({
            ...c,
            createdAt: new Date(c.createdAt).toLocaleDateString(),
          }))
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onCreate(): void {
    this.creating.set(true);
    this.clientService.create(this.createData).subscribe({
      next: () => {
        this.showCreate.set(false);
        this.creating.set(false);
        this.createData = { name: '', email: '', phone: '', address: '' };
        this.loadClients();
      },
      error: () => (this.creating.set(false)),
    });
  }

  viewClient(client: Client): void {
    this.router.navigate(['/clients', client.id]);
  }
}
