import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Role } from '../models/auth.model';
import { API } from '../api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'lexflow_token';
  private readonly USER_KEY = 'lexflow_user';

  isAuthenticated = signal(false);
  userRole = signal<Role | null>(null);
  userName = signal<string | null>(null);
  userEmail = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadSession();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API.BASE_URL}${API.AUTH.LOGIN}`, credentials).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.clearSignals();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.accessToken);
    const name = `${res.firstName} ${res.lastName}`.trim();
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({ email: res.email, role: res.role, name })
    );
    this.isAuthenticated.set(true);
    this.userRole.set(res.role);
    this.userName.set(name);
    this.userEmail.set(res.email);
  }

  private loadSession(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.USER_KEY);
    if (token && userStr) {
      const user = JSON.parse(userStr);
      this.isAuthenticated.set(true);
      this.userRole.set(user.role);
      this.userName.set(user.name);
      this.userEmail.set(user.email);
    }
  }

  private clearSignals(): void {
    this.isAuthenticated.set(false);
    this.userRole.set(null);
    this.userName.set(null);
    this.userEmail.set(null);
  }
}
