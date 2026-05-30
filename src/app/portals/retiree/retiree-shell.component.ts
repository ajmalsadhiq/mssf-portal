import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppSidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-retiree-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent, AppSidebarComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <!-- Sticky Navigation Header -->
      <app-header></app-header>
      
      <!-- Side-by-Side Content Grid -->
      <div class="flex-grow flex relative">
        <app-sidebar></app-sidebar>
        
        <!-- Dashboard Content pane -->
        <main class="flex-1 p-6 md:p-8 bg-stone-50 overflow-x-hidden min-h-[calc(100vh-80px)]">
          <div class="mx-auto max-w-5xl">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- App-wide Toast stack alerts -->
      <app-toast></app-toast>
    </div>
  `
})
export class RetireeShellComponent {
  readonly lang = inject(LanguageService);
}
