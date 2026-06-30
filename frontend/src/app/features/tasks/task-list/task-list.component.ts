import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { Task, CreateTaskRequest } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, TableComponent, ButtonComponent, ModalComponent, LoaderComponent],
  template: `
    <div class="page">
      <div class="header">
        <h2>Tasks for Case #{{ caseId }}</h2>
        @if (auth.userRole() !== 'CLIENT') {
          <app-button (click)="showCreate.set(true)">+ Add Task</app-button>
        }
      </div>

      <app-loader [loading]="loading()" />

      <app-modal [open]="showCreate()" title="Create Task" (close)="showCreate.set(false)">
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
            <label>Assigned To (User ID)</label>
            <input [(ngModel)]="createData.assignedToId" name="assignedToId" placeholder="User ID" />
          </div>
          <div class="actions">
            <app-button variant="secondary" (click)="showCreate.set(false)">Cancel</app-button>
            <app-button type="submit" [loading]="creating()">Create</app-button>
          </div>
        </form>
      </app-modal>

      @if (tasks().length) {
        <app-table
          [columns]="columns"
          [data]="tasks()"
          [actions]="true"
          (rowClick)="viewTask($event)"
        >
          @for (task of tasks(); track task.id) {
            @if (task.status !== 'COMPLETED') {
              <app-button (click)="onComplete($event, task)">Complete</app-button>
            }
          }
        </app-table>
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 960px; }
      .header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 24px;
      }
      .header h2 { margin: 0; font-size: 20px; }
      .form { display: flex; flex-direction: column; gap: 14px; }
      .field { display: flex; flex-direction: column; gap: 4px; }
      .field label { font-size: 13px; font-weight: 500; color: #495057; }
      .field input, .field textarea {
        padding: 8px 10px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px;
      }
      .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreate = signal(false);
  caseId = 0;

  createData: CreateTaskRequest = { title: '', description: '', caseId: 0 };

  columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'assignedToName', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.caseId = Number(this.route.snapshot.paramMap.get('caseId'));
    this.createData.caseId = this.caseId;
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getByCase(this.caseId).subscribe({
      next: (data) => {
        this.tasks.set(
          data.map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt).toLocaleDateString(),
          }))
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onCreate(): void {
    this.creating.set(true);
    this.taskService.create(this.createData).subscribe({
      next: () => {
        this.showCreate.set(false);
        this.creating.set(false);
        this.createData = { title: '', description: '', caseId: this.caseId };
        this.loadTasks();
      },
      error: () => (this.creating.set(false)),
    });
  }

  onComplete(event: Event, task: Task): void {
    event.stopPropagation();
    this.taskService.markComplete(task.id).subscribe(() => this.loadTasks());
  }

  viewTask(_task: Task): void {}
}
