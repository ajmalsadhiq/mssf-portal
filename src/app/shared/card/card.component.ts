import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="group relative flex flex-col justify-between rounded-2xl p-6 bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 card-shine"
      [ngClass]="{
        'hover:border-accent/40 animate-pulse-gold': highlighted()
      }"
    >
      <div>
        <!-- Top luxury gradient border decoration -->
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>

        <!-- Dynamic Image Container with fading gradient overlay -->
        @if (image()) {
          <div class="relative w-full h-24 rounded-xl overflow-hidden mb-4 border border-stone-200/60 shadow-inner group-hover:scale-[1.015] transition-transform duration-300">
            <!-- Stock image -->
            <img [src]="image()" [alt]="title()" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <!-- Rich military brown gradient fading overlay from bottom to top -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent mix-blend-multiply"></div>
            <!-- Dynamic gold/amber glow overlay to add interesting hue and gradient depth -->
            <div class="absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-transparent opacity-90 pointer-events-none"></div>
          </div>
        } @else if (icon()) {
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-luxury-cream text-accent border border-accent/15 group-hover:bg-accent group-hover:text-primary transition-all duration-300 shadow-sm">
            <div class="w-6 h-6 flex items-center justify-center" [innerHTML]="icon()"></div>
          </div>
        }

        <!-- Card Title -->
        <h3 class="text-base font-bold tracking-tight text-primary group-hover:text-accent transition-colors leading-tight mb-2">
          {{ title() }}
        </h3>

        <!-- Card Description -->
        <p class="text-xs text-stone-500 font-medium leading-relaxed mb-6 line-clamp-3">
          {{ description() }}
        </p>
      </div>

      <!-- Action Button / Link -->
      <div>
        @if (route()) {
          <a 
            [routerLink]="route()"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-light transition-colors group/link"
          >
            <span>{{ ctaText() || lang.t('btn.view') }}</span>
            <!-- Directional arrow reflecting RTL -->
            <svg class="w-3.5 h-3.5 transform transition-transform group-hover/link:translate-x-1 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        } @else {
          <button 
            (click)="actionClicked.emit()"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-light transition-colors group/btn"
          >
            <span>{{ ctaText() || lang.t('btn.view') }}</span>
            <svg class="w-3.5 h-3.5 transform transition-transform group-hover/btn:translate-x-1 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        }
      </div>
    </div>
  `
})
export class CardComponent {
  readonly lang = inject(LanguageService);

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input<string>('');
  readonly image = input<string>('');
  readonly route = input<string | any[]>('');
  readonly ctaText = input<string>('');
  readonly highlighted = input<boolean>(false);

  readonly actionClicked = output<void>();
}
