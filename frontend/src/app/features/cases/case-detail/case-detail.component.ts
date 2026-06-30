import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../../core/services/case.service';
import { LegalCase, CaseStatus } from '../../../core/models/case.model';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { StatusLabelPipe } from '../../../shared/pipes/status.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [FormsModule, ButtonComponent, LoaderComponent, StatusLabelPipe, DatePipe],
  template: `
    <div class="page">
      <app-loader [loading]="loading()" />
      @if (caseData(); as c) {
        <h2>{{ c.title }}</h2>
        <div class="detail-card">
          <div class="row"><span>Status</span>
            <span class="badge" [class]="c.status">{{ c.status | statusLabel }}</span>
          </div>
          <div class="row"><span>Client</span><span>{{ c.clientName }}</span></div>
          <div class="row"><span>Assigned To</span><span>{{ c.assignedLawyerName || 'Unassigned' }}</span></div>
          <div class="row"><span>Created</span><span>{{ c.createdAt | date }}</span></div>
          <div class="row"><span>Description</span><span>{{ c.description }}</span></div>
        </div>

        @if (auth.userRole() !== 'CLIENT') {
          <div class="actions-row">
            <div class="action-group">
              <label>Assign Lawyer</label>
                <select [(ngModel)]="selectedLawyerId">
                  @for (lawyer of lawyers(); track lawyer.id) {
                    <option [value]="lawyer.id">{{ lawyer.firstName }} {{ lawyer.lastName }}</option>
                  }
                </select>
              <app-button (click)="assignLawyer()">Assign</app-button>
            </div>

            <div class="action-group">
              <label>Update Status</label>
              <select [(ngModel)]="selectedStatus">
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
              <app-button (click)="updateStatus()">Update</app-button>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 700px; }
      h2 { margin: 0 0 20px; font-size: 20px; }
      .detail-card {
        background: white; border-radius: 12px; padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .row {
        display: flex; justify-content: space-between; padding: 10px 0;
        border-bottom: 1px solid #f1f3f5; font-size: 14px;
      }
      .row:last-child { border: none; }
      .row span:first-child { color: #868e96; font-weight: 500; }
      .badge {
        padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;
      }
      .badge.OPEN { background: #fff3bf; color: #e67700; }
      .badge.IN_PROGRESS { background: #dbe4ff; color: #4263eb; }
      .badge.CLOSED { background: #d3f9d8; color: #2f9e44; }
      .actions-row {
        display: flex; gap: 24px; margin-top: 24px; flex-wrap: wrap;
      }
      .action-group {
        display: flex; align-items: center; gap: 8px;
        background: white; padding: 12px 16px; border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .action-group label { font-size: 13px; font-weight: 500; color: #495057; }
      .action-group select {
        padding: 6px 8px; border: 1px solid #dee2e6; border-radius: 4px;
      }
    `,
  ],
})
export class CaseDetailComponent implements OnInit {
  caseData = signal<LegalCase | null>(null);
  lawyers = signal<User[]>([]);
  loading = signal(true);
  selectedLawyerId = 0;
  selectedStatus: CaseStatus = 'OPEN';

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private caseService: CaseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caseService.getById(id).subscribe({
      next: (data) => {
        this.caseData.set(data);
        this.selectedStatus = data.status;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.userService.getAll().subscribe({
      next: (data) => this.lawyers.set(data.filter((u) => u.role === 'LAWYER' && u.enabled)),
    });
  }

  assignLawyer(): void {
    const id = this.caseData()!.id;
    this.caseService.assignLawyer(id, this.selectedLawyerId).subscribe({
      next: (data) => this.caseData.set(data),
    });
  }

  updateStatus(): void {
    const id = this.caseData()!.id;
    this.caseService.updateStatus(id, this.selectedStatus).subscribe({
      next: (data) => this.caseData.set(data),
    });
  }
}
