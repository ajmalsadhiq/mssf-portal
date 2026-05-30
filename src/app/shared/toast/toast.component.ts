import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border luxury-glass transform transition-all duration-300 animate-fade-in-up"
          [ngClass]="{
            'border-emerald-500/20 bg-emerald-50/90 text-emerald-950': toast.type === 'success',
            'border-rose-500/20 bg-rose-50/90 text-rose-950': toast.type === 'error',
            'border-amber-500/20 bg-amber-50/90 text-amber-950': toast.type === 'warning',
            'border-accent/20 bg-luxury-cream/90 text-primary': toast.type === 'info'
          }"
          role="alert"
        >
          <!-- Icons based on type -->
          <div class="flex-shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            } @else {
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
          </div>

          <!-- Message Text -->
          <div class="flex-1 text-sm font-medium leading-5">
            {{ toast.message }}
          </div>

          <!-- Close Action Button -->
          <button 
            (click)="notificationService.remove(toast.id)" 
            class="flex-shrink-0 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Dismiss toast"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class NotificationToastComponent {
  readonly notificationService = inject(NotificationService);
}
