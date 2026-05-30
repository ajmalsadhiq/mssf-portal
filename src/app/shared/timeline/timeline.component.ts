import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

export interface TimelineNode {
  title: string;
  description: string;
  date: string;
  status: 'complete' | 'active' | 'upcoming';
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative pl-6 border-l-2 border-stone-200/80 flex flex-col gap-8 max-w-lg" [ngClass]="lang.isRtl() ? 'pr-6 pl-0 border-r-2 border-l-0 text-right' : 'pl-6 border-l-2 text-left'">
      <!-- Active node list loop -->
      @for (node of nodes(); track $index) {
        <div class="relative flex flex-col animate-fade-in-up" [ngStyle]="{'animation-delay.ms': $index * 100}">
          <!-- Timeline Circle Bullet Node -->
          <div 
            class="absolute top-1.5 -left-[33px] w-4.5 h-4.5 rounded-full border-2 transition-all shadow-sm"
            [ngClass]="{
              'bg-primary border-accent': node.status === 'complete',
              'bg-accent border-accent animate-pulse-gold scale-125 z-10': node.status === 'active',
              'bg-white border-stone-300': node.status === 'upcoming'
            }"
            [ngClass]="lang.isRtl() ? '-right-[33px] -left-auto' : '-left-[33px]'"
          >
            @if (node.status === 'active') {
              <!-- Extra gold radar ring overlay -->
              <span class="absolute inset-0 rounded-full animate-ping bg-accent opacity-50"></span>
            }
          </div>

          <!-- Date Badge -->
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">{{ node.date }}</span>
          
          <!-- Node Title -->
          <h4 
            class="text-xs font-bold leading-tight mb-1 transition-colors"
            [ngClass]="{
              'text-primary': node.status === 'complete',
              'text-accent font-extrabold': node.status === 'active',
              'text-stone-400': node.status === 'upcoming'
            }"
          >
            {{ node.title }}
          </h4>
          
          <!-- Node Description -->
          <p 
            class="text-[11px] font-medium leading-relaxed"
            [ngClass]="{
              'text-stone-600': node.status !== 'upcoming',
              'text-stone-400': node.status === 'upcoming'
            }"
          >
            {{ node.description }}
          </p>
        </div>
      }
    </div>
  `
})
export class TimelineComponent {
  readonly lang = inject(LanguageService);

  readonly nodes = input.required<TimelineNode[]>();
}
