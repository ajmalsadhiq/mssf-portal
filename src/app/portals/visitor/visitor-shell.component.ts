import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { ChatWidgetComponent } from '../../shared/chat-widget/chat-widget.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-visitor-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent, AppFooterComponent, ChatWidgetComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>
      
      <main class="flex-grow p-6 md:p-8 bg-stone-50 overflow-x-hidden min-h-[calc(100vh-80px)]">
        <div class="mx-auto max-w-5xl">
          <router-outlet></router-outlet>
        </div>
      </main>

      <app-footer></app-footer>

      <!-- App-wide Floating Support Live Chat -->
      <app-chat-widget></app-chat-widget>

      <!-- App-wide Toast stack alerts -->
      <app-toast></app-toast>
    </div>
  `
})
export class VisitorShellComponent {
  readonly lang = inject(LanguageService);
}
