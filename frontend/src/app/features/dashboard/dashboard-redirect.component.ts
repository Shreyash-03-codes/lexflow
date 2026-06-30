import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  template: '',
})
export class DashboardRedirectComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const role = this.auth.userRole();
    const path = role === 'ADMIN' ? '/admin' : role === 'LAWYER' ? '/lawyer' : '/client';
    this.router.navigate([path]);
  }
}
