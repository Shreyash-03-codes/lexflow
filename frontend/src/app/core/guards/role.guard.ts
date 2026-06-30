import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.model';

export const roleGuard = (allowedRoles: Role[]) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.userRole();
  if (role && allowedRoles.includes(role)) {
    return true;
  }

  return router.parseUrl('/login');
};
