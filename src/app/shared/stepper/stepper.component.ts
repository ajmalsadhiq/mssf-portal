import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full py-4" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <div class="relative flex items-center justify-between w-full">
        <!-- Connecting Track Line Background -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-stone-200 rounded-full z-0"></div>
        
        <!-- Connecting Track Line Active Fill -->
        <div 
          class="absolute top-1/2 -translate-y-1/2 h-[3px] bg-accent transition-all duration-500 ease-out z-0"
          [ngStyle]="{
            'width.%': activePercentage(),
            'left': lang.isRtl() ? 'auto' : '0',
            'right': lang.isRtl() ? '0' : 'auto'
          }"
        ></div>

        <!-- Stepper Circled Steps -->
        @for (step of steps(); track $index) {
          <div class="relative flex flex-col items-center z-10 select-none">
            <!-- Step Circled Badge -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold shadow-md border-2 transition-all duration-300 transform"
              [ngClass]="{
                'bg-accent text-primary border-accent scale-110': $index === activeStep(),
                'bg-primary text-accent border-accent': $index < activeStep(),
                'bg-white text-stone-400 border-stone-200': $index > activeStep()
              }"
            >
              @if ($index < activeStep()) {
                <!-- Complete Checkmark Symbol -->
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              } @else {
                {{ $index + 1 }}
              }
            </div>

            <!-- Localized Step Title Label -->
            <span 
              class="absolute top-12 text-[10px] sm:text-xs font-bold leading-tight whitespace-nowrap transition-colors duration-300"
              [ngClass]="{
                'text-primary': $index === activeStep(),
                'text-stone-500': $index < activeStep(),
                'text-stone-400': $index > activeStep()
              }"
            >
              {{ step }}
            </span>
          </div>
        }
      </div>
      <!-- Spacer to compensate for absolute step label heights -->
      <div class="h-10"></div>
    </div>
  `
})
export class StepperComponent {
  readonly lang = inject(LanguageService);

  readonly steps = input.required<string[]>();
  readonly activeStep = input.required<number>();

  protected activePercentage(): number {
    const total = this.steps().length;
    if (total <= 1) return 0;
    
    // Percentage logic representing connected segment lengths
    return (this.activeStep() / (total - 1)) * 100;
  }
}
