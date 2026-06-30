import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserRequest } from '../models/user.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API.BASE_URL}${API.USERS.BASE}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${API.BASE_URL}${API.USERS.BY_ID(id)}`);
  }

  create(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${API.BASE_URL}${API.USERS.BASE}`, data);
  }

  disable(id: number): Observable<void> {
    return this.http.delete<void>(`${API.BASE_URL}${API.USERS.BY_ID(id)}`);
  }
}
