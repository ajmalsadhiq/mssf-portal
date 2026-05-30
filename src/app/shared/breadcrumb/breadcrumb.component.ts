import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="Breadcrumb" class="w-full py-4 text-xs font-semibold">
      <ol class="flex items-center flex-wrap gap-2 text-stone-500">
        <!-- Home Core Link -->
        <li class="flex items-center gap-2">
          <a routerLink="/" class="text-stone-600 hover:text-accent transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>{{ lang.t('nav.home') }}</span>
          </a>
        </li>

        <!-- List Items Loop -->
        @for (item of items(); track $index; let last = $last) {
          <li class="flex items-center gap-2">
            <!-- Arrow Divider (Rotates on RTL) -->
            <svg class="w-3 h-3 text-stone-400 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>

            @if (last || !item.link) {
              <span class="text-accent font-bold leading-none" aria-current="page">
                {{ item.label }}
              </span>
            } @else {
              <a [routerLink]="item.link" class="text-stone-600 hover:text-accent transition-colors">
                {{ item.label }}
              </a>
            }
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  readonly lang = inject(LanguageService);
  readonly items = input<BreadcrumbItem[]>([]);
}
