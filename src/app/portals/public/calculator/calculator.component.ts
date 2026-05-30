import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { PensionCalculatorComponent } from '../../../shared/pension-calc/pension-calc.component';

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, PensionCalculatorComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.calculator') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'حاسبة مستحقات التقاعد العسكرية والمدنية' : 'Military Pension Entitlement Calculator' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Input your basic salary details and rank classification to calculate estimated net monthly pension values instantly.
        </p>
      </div>

      <!-- Embedded Full Shared Calculator -->
      <div class="max-w-5xl mx-auto mb-16">
        <app-pension-calculator></app-pension-calculator>
      </div>

      <!-- Regulatory Framework Instructions Panel -->
      <div class="max-w-5xl mx-auto p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-sm mb-16">
        <h3 class="font-display text-sm font-bold text-primary mb-4 border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">
          {{ lang.isRtl() ? 'أحكام وقواعد احتساب المعاش التقاعدي' : 'Regulatory Calculation Guidelines' }}
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-500 leading-relaxed font-semibold">
          <div class="space-y-3">
            <h4 class="font-bold text-stone-700">1. Pension Accumulation Rate</h4>
            <p>Pensions accumulate based on your rank classification, applying a multiplier factor per year of verified military service: Senior Officers (4.5%/yr), Junior Officers (4.2%/yr), and صف ضباط (4.0%/yr).</p>
          </div>
          <div class="space-y-3">
            <h4 class="font-bold text-stone-700">2. Maximum Capping Ratios</h4>
            <p>The total basic pension replacement rate is legally capped depending on the rank (up to 100% of final basic salary for Senior Officers, 90% for Junior Officers, and 85% for Non-Commissioned Officers).</p>
          </div>
          <div class="space-y-3">
            <h4 class="font-bold text-stone-700">3. Guaranteed Minimum Pension</h4>
            <p>Under royal directives, the Sultanate of Oman guarantees a minimum net pension payment of 300 OMR to ensure a secure livelihood for families of lower enlisted personnel.</p>
          </div>
          <div class="space-y-3">
            <h4 class="font-bold text-stone-700">4. Alimony & Court Deductions</h4>
            <p>Approved commercial bank loan deductions or legal judicial execution child support rules are processed in strict priority order, capped at a maximum of 50% of the net pension.</p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CalculatorComponent {
  readonly lang = inject(LanguageService);
}
