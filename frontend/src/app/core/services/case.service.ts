import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalCase, CreateCaseRequest, CaseStatus } from '../models/case.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class CaseService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<LegalCase[]> {
    return this.http.get<LegalCase[]>(`${API.BASE_URL}${API.CASES.BASE}`);
  }

  getById(id: number): Observable<LegalCase> {
    return this.http.get<LegalCase>(`${API.BASE_URL}${API.CASES.BY_ID(id)}`);
  }

  create(data: CreateCaseRequest): Observable<LegalCase> {
    return this.http.post<LegalCase>(`${API.BASE_URL}${API.CASES.BASE}`, data);
  }

  assignLawyer(id: number, lawyerId: number): Observable<LegalCase> {
    return this.http.put<LegalCase>(`${API.BASE_URL}${API.CASES.ASSIGN_LAWYER(id)}`, { lawyerId });
  }

  updateStatus(id: number, status: CaseStatus): Observable<LegalCase> {
    return this.http.put<LegalCase>(`${API.BASE_URL}${API.CASES.STATUS(id)}`, { status });
  }
}
