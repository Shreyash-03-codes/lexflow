import { Component, input, output } from '@angular/core';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th [class.sortable]="col.sortable">
                {{ col.label }}
              </th>
            }
            @if (actions()) {
              <th class="actions-cell">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track row.id ?? $index) {
            <tr (click)="rowClick.emit(row)">
              @for (col of columns(); track col.key) {
                <td>{{ row[col.key] }}</td>
              }
              @if (actions()) {
                <td class="actions-cell">
                  <ng-content />
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length + (actions() ? 1 : 0)" class="empty">
                No data found
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
      th {
        background: #f8f9fa;
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
      }
      td {
        padding: 10px 16px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #212529;
      }
      tbody tr {
        cursor: pointer;
        transition: background 0.15s;
      }
      tbody tr:hover {
        background: #f1f3f5;
      }
      .actions-cell {
        text-align: right;
        white-space: nowrap;
      }
      .empty {
        text-align: center;
        color: #868e96;
        padding: 32px;
      }
    `,
  ],
})
export class TableComponent {
  columns = input.required<Column[]>();
  data = input.required<any[]>();
  actions = input(false);
  rowClick = output<any>();
}
