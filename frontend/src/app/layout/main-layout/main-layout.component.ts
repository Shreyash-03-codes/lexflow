import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <app-sidebar />
    <div class="main">
      <app-header>LexFlow</app-header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
      .main {
        margin-left: 240px;
        flex: 1;
        min-height: 100vh;
        background: #f1f3f5;
      }
      main {
        padding: 24px 32px;
      }
    `,
  ],
})
export class MainLayoutComponent {}
