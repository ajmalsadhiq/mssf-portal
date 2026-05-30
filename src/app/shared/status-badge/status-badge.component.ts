import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | string;

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
      [ngClass]="{
        'bg-amber-50 text-amber-700 border-amber-200/60': normalizedStatus() === 'pending',
        'bg-emerald-50 text-emerald-700 border-emerald-200/60': normalizedStatus() === 'approved',
        'bg-rose-50 text-rose-700 border-rose-200/60': normalizedStatus() === 'rejected'
      }"
    >
      <!-- Small Status Bullet -->
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
        'bg-amber-500': normalizedStatus() === 'pending',
        'bg-emerald-500': normalizedStatus() === 'approved',
        'bg-rose-500': normalizedStatus() === 'rejected'
      }"></span>

      <span>{{ statusLabel() }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  readonly lang = inject(LanguageService);

  readonly status = input.required<RequestStatus>();

  protected normalizedStatus(): string {
    const s = this.status().toLowerCase();
    if (s.includes('pending') || s.includes('wait')) return 'pending';
    if (s.includes('approved') || s.includes('success') || s.includes('complete')) return 'approved';
    if (s.includes('reject') || s.includes('fail') || s.includes('stop')) return 'rejected';
    return 'pending';
  }

  protected statusLabel(): string {
    const norm = this.normalizedStatus();
    if (norm === 'pending') return this.lang.t('status.pending');
    if (norm === 'approved') return this.lang.t('status.approved');
    if (norm === 'rejected') return this.lang.t('status.rejected');
    return this.status();
  }
}
