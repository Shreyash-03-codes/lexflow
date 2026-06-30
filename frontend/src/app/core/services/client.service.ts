import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientRequest } from '../models/client.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${API.BASE_URL}${API.CLIENTS.BASE}`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${API.BASE_URL}${API.CLIENTS.BY_ID(id)}`);
  }

  create(data: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(`${API.BASE_URL}${API.CLIENTS.BASE}`, data);
  }
}
