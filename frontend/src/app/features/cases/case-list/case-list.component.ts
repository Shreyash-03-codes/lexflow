import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../../core/services/case.service';
import { LegalCase, CreateCaseRequest, CaseStatus } from '../../../core/models/case.model';
import { ClientService } from '../../../core/services/client.service';
import { UserService } from '../../../core/services/user.service';
import { Client } from '../../../core/models/client.model';
import { User } from '../../../core/models/user.model';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    FormsModule, TableComponent, ButtonComponent,
    ModalComponent, LoaderComponent,
  ],
  template: `
    <div class="page">
      <div class="header">
        <h2>Cases</h2>
        @if (auth.userRole() !== 'CLIENT') {
          <app-button (click)="showCreate.set(true)">+ Create Case</app-button>
        }
      </div>

      <app-loader [loading]="loading()" />

      <app-modal [open]="showCreate()" title="Create Case" (close)="showCreate.set(false)">
        <form (ngSubmit)="onCreate()" class="form">
          <div class="field">
            <label>Title</label>
            <input [(ngModel)]="createData.title" name="title" required />
          </div>
          <div class="field">
            <label>Description</label>
            <textarea [(ngModel)]="createData.description" name="description" rows="3"></textarea>
          </div>
          <div class="field">
            <label>Client</label>
            <select [(ngModel)]="createData.clientId" name="clientId" required>
              @for (c of clients(); track c.id) {
                <option [value]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>
          <div class="actions">
            <app-button variant="secondary" (click)="showCreate.set(false)">Cancel</app-button>
            <app-button type="submit" [loading]="creating()">Create</app-button>
          </div>
        </form>
      </app-modal>

      @if (cases().length) {
        <app-table
          [columns]="columns"
          [data]="cases()"
          (rowClick)="viewCase($event)"
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
      .form { display: flex; flex-direction: column; gap: 14px; }
      .field { display: flex; flex-direction: column; gap: 4px; }
      .field label { font-size: 13px; font-weight: 500; color: #495057; }
      .field input, .field select, .field textarea {
        padding: 8px 10px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px;
      }
      .field textarea { resize: vertical; }
      .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    `,
  ],
})
export class CaseListComponent implements OnInit {
  cases = signal<LegalCase[]>([]);
  clients = signal<Client[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreate = signal(false);

  createData: CreateCaseRequest = { title: '', description: '', clientId: 0 };

  columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'clientName', label: 'Client' },
    { key: 'assignedLawyerName', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  constructor(
    public auth: AuthService,
    private caseService: CaseService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCases();
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
    });
  }

  loadCases(): void {
    this.caseService.getAll().subscribe({
      next: (data) => {
        this.cases.set(
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
    this.caseService.create(this.createData).subscribe({
      next: () => {
        this.showCreate.set(false);
        this.creating.set(false);
        this.createData = { title: '', description: '', clientId: 0 };
        this.loadCases();
      },
      error: () => (this.creating.set(false)),
    });
  }

  viewCase(legalCase: LegalCase): void {
    this.router.navigate(['/cases', legalCase.id]);
  }
}
