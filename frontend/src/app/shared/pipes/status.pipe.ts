import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusClass',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    const map: Record<string, string> = {
      OPEN: 'status-open',
      IN_PROGRESS: 'status-progress',
      CLOSED: 'status-closed',
      true: 'status-completed',
      false: 'status-pending',
    };
    return map[value] ?? '';
  }
}

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: string): string {
    const map: Record<string, string> = {
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      CLOSED: 'Closed',
      true: 'Completed',
      false: 'Pending',
    };
    return map[value] ?? value;
  }
}
