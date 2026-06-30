import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../api.config';

export interface SearchResult {
  users: { id: number; name: string; email: string; type: string }[];
  clients: { id: number; name: string; email: string; type: string }[];
  cases: { id: number; title: string; status: string; type: string }[];
  totalResults?: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(`${API.BASE_URL}${API.SEARCH.QUERY(query)}`);
  }
}
