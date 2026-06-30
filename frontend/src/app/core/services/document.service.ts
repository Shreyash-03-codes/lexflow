import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private http: HttpClient) {}

  getByCase(caseId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${API.BASE_URL}${API.DOCUMENTS.BY_CASE(caseId)}`);
  }

  upload(caseId: number, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId.toString());
    return this.http.post<Document>(`${API.BASE_URL}${API.DOCUMENTS.UPLOAD}`, formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${API.BASE_URL}${API.DOCUMENTS.DOWNLOAD(id)}`, {
      responseType: 'blob',
    });
  }
}
