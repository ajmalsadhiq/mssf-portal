import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { PensionService, PensionResult } from '../../core/services/pension.service';

@Component({
  selector: 'app-pension-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Outer luxury textured frame with gold border -->
    <div class="relative w-full p-4 sm:p-6 md:p-8 rounded-3xl border border-accent/25 bg-luxury-beige/50 shadow-inner overflow-hidden">
      <!-- Omani Sunset Watermark Background Pic directly under the calculator box -->
      <div class="absolute inset-0 bg-cover bg-center opacity-[0.08] filter grayscale contrast-125 mix-blend-overlay pointer-events-none -z-20" style="background-image: url('/oman_bg.png');"></div>
      
      <!-- Luxurious soft military brown shadow glow aura peeking from under the box -->
      <div class="absolute inset-x-8 inset-y-12 bg-primary/25 blur-3xl rounded-3xl -z-10 pointer-events-none"></div>
      
      <!-- Gold & amber glowing color backdrop aura -->
      <div class="absolute inset-0 bg-gradient-to-tr from-accent/20 via-primary-light/5 to-secondary/20 blur-3xl opacity-75 pointer-events-none -z-10"></div>
      
      <div 
        class="relative w-full bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10" 
        [dir]="lang.isRtl() ? 'rtl' : 'ltr'"
      >
        
        <!-- Left Column: Inputs Form -->
        <div class="p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <h3 class="font-display text-lg font-bold text-primary mb-1">
              {{ lang.t('nav.calculator') }}
            </h3>
            <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
              Estimate your pension benefits using our interactive Omani military-grade simulator.
            </p>
          </div>

          <!-- Reactive Form -->
          <form [formGroup]="calcForm" (ngSubmit)="calculate()" class="flex flex-col gap-4">
            
            <!-- Basic Salary Input -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {{ lang.t('calc.salary') }}
              </label>
              <input 
                type="number" 
                formControlName="basicSalary" 
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-mono font-bold"
                [placeholder]="lang.isRtl() ? 'مثال: 1200' : 'e.g., 1200'"
              />
              @if (calcForm.get('basicSalary')?.touched && calcForm.get('basicSalary')?.invalid) {
                <span class="text-[9px] text-rose-500 font-bold uppercase mt-0.5">Please provide a valid salary amount (min: 100 OMR).</span>
              }
            </div>

            <!-- Service Years Range Slider -->
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {{ lang.t('calc.years') }}
                </label>
                <span class="text-xs font-bold text-accent font-mono">{{ calcForm.get('yearsOfService')?.value }} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="40" 
                formControlName="yearsOfService" 
                class="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            <!-- Military Rank Categories -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {{ lang.t('calc.rank') }}
              </label>
              <select 
                formControlName="rankId"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
              >
                @for (rank of pensionService.ranks(); track rank.id) {
                  <option [value]="rank.id">
                    {{ lang.isRtl() ? rank.nameAr : rank.nameEn }} ({{ rank.multiplier * 100 | number:'1.1-1' }}%/yr)
                  </option>
                }
              </select>
            </div>

            <!-- proposed Retirement Date -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {{ lang.t('calc.retDate') }}
              </label>
              <input 
                type="date" 
                formControlName="retirementDate" 
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
              />
            </div>
          </form>
        </div>

        <!-- Right Column: Animated Payout Output -->
        <div class="p-6 sm:p-8 bg-stone-50 border-t border-stone-200/80 md:border-t-0 md:border-l border-stone-200/80 flex flex-col justify-between gap-6" [ngClass]="lang.isRtl() ? 'md:border-r md:border-l-0' : 'md:border-l md:border-r-0'">
          
          <!-- Big Number Highlight Result -->
          <div class="text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-secondary"></div>
            
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              {{ lang.t('calc.estimate') }}
            </span>

            <h2 class="text-2xl sm:text-3xl font-display font-black text-primary leading-none mb-1 text-accent select-all font-mono">
              {{ results().netPension | number:'1.3-3' }} OMR
            </h2>
            <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Net Monthly Pension</span>
          </div>

          <!-- Calculated Detailed Ledger Parameters -->
          <div class="flex flex-col gap-2.5 text-xs font-semibold">
            <div class="flex justify-between border-b border-stone-200/60 pb-1.5 leading-none">
              <span class="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Basic Pension Rate</span>
              <span class="text-stone-700 font-bold">{{ results().estimatedPension | number:'1.3-3' }} OMR</span>
            </div>
            <div class="flex justify-between border-b border-stone-200/60 pb-1.5 leading-none">
              <span class="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Allowance Premium</span>
              <span class="text-stone-700 font-bold">+{{ results().allowanceSum | number:'1.3-3' }} OMR</span>
            </div>
            <div class="flex justify-between border-b border-stone-200/60 pb-1.5 leading-none">
              <span class="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Replacement Rate</span>
              <span class="text-stone-700 font-bold font-mono">{{ results().replacementRate | number:'1.1-1' }}%</span>
            </div>
            <div class="flex justify-between border-b border-stone-200/60 pb-1.5 leading-none">
              <span class="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Contribution Deduction (1%)</span>
              <span class="text-stone-400 font-bold font-mono">-{{ results().pensionTaxDeduction | number:'1.3-3' }} OMR</span>
            </div>
          </div>

          <!-- Disclaimer footer -->
          <p class="text-[9px] text-stone-400 leading-relaxed font-semibold">
            {{ lang.t('calc.disclaimer') }}
          </p>
        </div>

      </div>
    </div>
  `
})
export class PensionCalculatorComponent {
  readonly lang = inject(LanguageService);
  readonly pensionService = inject(PensionService);
  private readonly fb = inject(FormBuilder);

  readonly calcForm: FormGroup;
  readonly results = signal<PensionResult>({
    estimatedPension: 0,
    replacementRate: 0,
    allowanceSum: 0,
    grossPension: 0,
    pensionTaxDeduction: 0,
    netPension: 0
  });

  constructor() {
    // Generate dates
    const nextDate = new Date();
    nextDate.setFullYear(nextDate.getFullYear() + 1);

    this.calcForm = this.fb.group({
      basicSalary: [1000, [Validators.required, Validators.min(100)]],
      yearsOfService: [20, [Validators.required, Validators.min(1), Validators.max(40)]],
      rankId: ['officer_junior', Validators.required],
      retirementDate: [nextDate.toISOString().split('T')[0], Validators.required]
    });

    // Compute pension automatically as form values change
    this.calcForm.valueChanges.subscribe(() => {
      this.calculate();
    });

    this.calculate();
  }

  calculate(): void {
    if (this.calcForm.invalid) return;

    const { basicSalary, yearsOfService, rankId } = this.calcForm.value;
    const res = this.pensionService.calculatePension(basicSalary, yearsOfService, rankId);
    this.results.set(res);
  }
}
