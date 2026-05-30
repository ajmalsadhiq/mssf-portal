import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-visitor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BreadcrumbComponent],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('portal.visitor') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('portal.visitor') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          Access general public welfare grants or log administrative queries immediately.
        </p>
      </div>

      <!-- Grid: claim Grant Call-out vs suggestions Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        
        <!-- Column 1: Funeral claim CTA Banner (1 Column) -->
        <div class="lg:col-span-1 bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-2xl border border-accent/20 flex flex-col justify-between min-h-[300px] relative overflow-hidden shadow-md">
          <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <svg class="w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>

          <div class="space-y-3">
            <span class="text-[9px] text-accent font-extrabold uppercase tracking-wider">Social Security Grant</span>
            <h3 class="font-display text-sm font-black text-white leading-tight">
              {{ lang.isRtl() ? 'صرف مستحقات مصاريف الجنازة وعزاء المتقاعدين' : 'Funeral Expense Bereavement Claims' }}
            </h3>
            <p class="text-stone-300 text-[10px] sm:text-xs leading-relaxed font-semibold">
              Bereaved families and legal heirs of deceased military officers can request the fixed welfare bereavement grant of 500 OMR via our secure wizard.
            </p>
          </div>

          <a 
            routerLink="claim"
            class="w-full text-center py-3 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-xs transition-all shadow-md mt-6 block select-none"
          >
            Launch Claim Wizard &rarr;
          </a>
        </div>

        <!-- Column 2 & 3: Suggestion & Inquiry Form (2 Columns) -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h3 class="font-display text-sm font-bold text-primary mb-1">
              {{ lang.isRtl() ? 'نموذج تقديم المقترحات والاستفسارات العام' : 'Public Suggestions & Inquiries Docket' }}
            </h3>
            <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Direct Customer Care filing</p>
          </div>

          <form [formGroup]="inquiryForm" (ngSubmit)="submitInquiry()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Name -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Your Full Name</label>
              <input 
                type="text" 
                formControlName="name"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                [placeholder]="lang.isRtl() ? 'أدخل اسمك الكامل' : 'e.g., Salem Al-Ghafri'"
              />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                formControlName="email"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="e.g. name@domain.om"
              />
            </div>

            <!-- Mobile -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Mobile Number</label>
              <input 
                type="tel" 
                formControlName="mobile"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-mono"
                placeholder="e.g. +968 99887766"
              />
            </div>

            <!-- Type -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Submission Type</label>
              <select 
                formControlName="type"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="Suggestion">Suggestion / Administrative Idea</option>
                <option value="Inquiry">General Welfare Inquiry</option>
                <option value="Complaint">Formal Complaint</option>
              </select>
            </div>

            <!-- Description -->
            <div class="sm:col-span-2 flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Message Description</label>
              <textarea 
                formControlName="description"
                rows="4"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent leading-relaxed"
                [placeholder]="lang.isRtl() ? 'تفاصيل اقتراحك أو استفسارك هنا...' : 'Provide complete operational details...'"
              ></textarea>
            </div>

            <!-- Submit -->
            <div class="sm:col-span-2 flex justify-end mt-2">
              <button 
                type="submit"
                [disabled]="inquiryForm.invalid"
                class="px-6 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
              >
                {{ lang.t('btn.submit') }}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  `
})
export class VisitorDashboardComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly inquiryForm: FormGroup;

  constructor() {
    this.inquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,15}$/)]],
      type: ['Inquiry', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitInquiry(): void {
    if (this.inquiryForm.invalid) return;

    this.notification.success(
      this.lang.isRtl() 
        ? 'تم إرسال المقترح/الاستفسار العام بنجاح. سنقوم بالرد عليك عبر البريد في أقرب وقت.' 
        : 'Inquiry docket filed successfully. We will follow up via email shortly.'
    );
    this.inquiryForm.reset({ type: 'Inquiry' });
  }
}
