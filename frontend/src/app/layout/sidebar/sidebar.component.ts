import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/auth.model';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="logo">⚖️</span>
        <span class="name">LexFlow</span>
      </div>
      <nav>
        @for (item of navItems; track item.path) {
          @if (item.roles.includes(userRole())) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/admin' || item.path === '/lawyer' || item.path === '/client' }"
            >
              <span class="icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </a>
          }
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 240px;
        background: #1e293b;
        color: white;
        display: flex;
        flex-direction: column;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px;
        border-bottom: 1px solid #334155;
      }
      .logo {
        font-size: 24px;
      }
      .name {
        font-size: 18px;
        font-weight: 700;
      }
      nav {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 14px;
        transition: all 0.15s;
      }
      a:hover {
        background: #334155;
        color: white;
      }
      a.active {
        background: #4263eb;
        color: white;
      }
      .icon {
        font-size: 18px;
        width: 24px;
        text-align: center;
      }
    `,
  ],
})
export class SidebarComponent {
  private auth = inject(AuthService);
  userRole = this.auth.userRole as unknown as () => Role;

  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: '📊', roles: ['ADMIN'] },
    { label: 'Dashboard', path: '/lawyer', icon: '📊', roles: ['LAWYER'] },
    { label: 'Dashboard', path: '/client', icon: '📊', roles: ['CLIENT'] },
    { label: 'Users', path: '/users', icon: '👥', roles: ['ADMIN'] },
    { label: 'Clients', path: '/clients', icon: '👤', roles: ['ADMIN'] },
    { label: 'Cases', path: '/cases', icon: '📁', roles: ['ADMIN', 'LAWYER'] },
    { label: 'Documents', path: '/documents', icon: '📄', roles: ['ADMIN', 'LAWYER', 'CLIENT'] },
    { label: 'Search', path: '/search', icon: '🔍', roles: ['ADMIN', 'LAWYER'] },
  ];

}
