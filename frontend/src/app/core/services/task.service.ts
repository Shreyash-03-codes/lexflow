import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest } from '../models/task.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getByCase(caseId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${API.BASE_URL}${API.TASKS.BY_CASE(caseId)}`);
  }

  create(data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${API.BASE_URL}${API.TASKS.BASE}`, data);
  }

  markComplete(id: number): Observable<Task> {
    return this.http.put<Task>(`${API.BASE_URL}${API.TASKS.COMPLETE(id)}`, {});
  }
}
