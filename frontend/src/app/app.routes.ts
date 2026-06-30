import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardRedirectComponent } from './features/dashboard/dashboard-redirect.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardRedirectComponent },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
        canActivate: [() => roleGuard(['ADMIN'])],
      },
      {
        path: 'lawyer',
        loadComponent: () =>
          import('./features/dashboard/lawyer-dashboard/lawyer-dashboard.component').then(
            (m) => m.LawyerDashboardComponent
          ),
        canActivate: [() => roleGuard(['LAWYER'])],
      },
      {
        path: 'client',
        loadComponent: () =>
          import('./features/dashboard/client-dashboard/client-dashboard.component').then(
            (m) => m.ClientDashboardComponent
          ),
        canActivate: [() => roleGuard(['CLIENT'])],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        canActivate: [() => roleGuard(['ADMIN'])],
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/client-list/client-list.component').then(
            (m) => m.ClientListComponent
          ),
        canActivate: [() => roleGuard(['ADMIN'])],
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./features/clients/client-detail/client-detail.component').then(
            (m) => m.ClientDetailComponent
          ),
        canActivate: [() => roleGuard(['ADMIN'])],
      },
      {
        path: 'cases',
        loadComponent: () =>
          import('./features/cases/case-list/case-list.component').then(
            (m) => m.CaseListComponent
          ),
        canActivate: [() => roleGuard(['ADMIN', 'LAWYER'])],
      },
      {
        path: 'cases/:id',
        loadComponent: () =>
          import('./features/cases/case-detail/case-detail.component').then(
            (m) => m.CaseDetailComponent
          ),
        canActivate: [() => roleGuard(['ADMIN', 'LAWYER'])],
      },
      {
        path: 'cases/:caseId/tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
        canActivate: [() => roleGuard(['ADMIN', 'LAWYER'])],
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/document-list/document-list.component').then(
            (m) => m.DocumentListComponent
          ),
        canActivate: [() => roleGuard(['ADMIN', 'LAWYER', 'CLIENT'])],
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component').then((m) => m.SearchComponent),
        canActivate: [() => roleGuard(['ADMIN', 'LAWYER'])],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
