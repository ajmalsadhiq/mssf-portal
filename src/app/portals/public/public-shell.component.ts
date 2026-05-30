import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { ChatWidgetComponent } from '../../shared/chat-widget/chat-widget.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    AppHeaderComponent, 
    AppFooterComponent, 
    ChatWidgetComponent,
    NotificationToastComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>

      <!-- App-wide Floating Support Live Chat -->
      <app-chat-widget></app-chat-widget>

      <!-- App-wide Toast stack alerts -->
      <app-toast></app-toast>
    </div>
  `
})
export class PublicShellComponent {
  readonly lang = inject(LanguageService);
}
