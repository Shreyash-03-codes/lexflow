import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, CreateUserRequest } from '../../../core/models/user.model';
import { Role } from '../../../core/models/auth.model';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, TableComponent, ButtonComponent, ModalComponent, LoaderComponent],
  template: `
    <div class="page">
      <div class="header">
        <h2>Users</h2>
        <app-button (click)="showCreate.set(true)">+ Create User</app-button>
      </div>

      <app-loader [loading]="loading()" />
      <app-modal [open]="showCreate()" title="Create User" (close)="showCreate.set(false)">
          <form #createForm="ngForm" (ngSubmit)="onCreate()" class="create-form">
            <div class="field">
              <label>First Name</label>
              <input [(ngModel)]="createData.firstName" name="firstName" required />
            </div>
            <div class="field">
              <label>Last Name</label>
              <input [(ngModel)]="createData.lastName" name="lastName" required />
            </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="createData.email" name="email" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="createData.password" name="password" required />
          </div>
          <div class="field">
            <label>Role</label>
            <select [(ngModel)]="createData.role" name="role" required>
              <option value="LAWYER">Lawyer</option>
            </select>
          </div>
          <div class="actions">
            <app-button variant="secondary" (click)="showCreate.set(false)">Cancel</app-button>
            <app-button type="submit" [loading]="creating()">Create</app-button>
          </div>
        </form>
      </app-modal>

      @if (users().length) {
        <app-table
          [columns]="columns"
          [data]="users()"
          [actions]="true"
          (rowClick)="viewUser($event)"
        >
          @for (user of users(); track user.id) {
            <app-button
              variant="danger"
              [disabled]="!user.enabled"
              (click)="onDisable($event, user)"
            >
              {{ user.enabled ? 'Disable' : 'Disabled' }}
            </app-button>
          }
        </app-table>
      }
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 960px;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .header h2 {
        margin: 0;
        font-size: 20px;
      }
      .create-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .field label {
        font-size: 13px;
        font-weight: 500;
        color: #495057;
      }
      .field input,
      .field select {
        padding: 8px 10px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        font-size: 14px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }
    `,
  ],
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreate = signal(false);

  createData: CreateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'LAWYER',
  };

  columns: Column[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(
          data.map((u) => ({
            ...u,
            status: u.enabled ? 'Active' : 'Disabled',
            createdAt: new Date(u.createdAt).toLocaleDateString(),
          }))
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onCreate(): void {
    this.creating.set(true);
    this.userService.create(this.createData).subscribe({
      next: () => {
        this.showCreate.set(false);
        this.creating.set(false);
        this.createData = { firstName: '', lastName: '', email: '', password: '', role: 'LAWYER' };
        this.loadUsers();
      },
      error: () => (this.creating.set(false)),
    });
  }

  onDisable(event: Event, user: User): void {
    event.stopPropagation();
    if (!user.enabled) return;
    this.userService.disable(user.id).subscribe(() => this.loadUsers());
  }

  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}
