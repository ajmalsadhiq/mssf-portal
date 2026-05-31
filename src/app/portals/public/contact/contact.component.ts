import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { AdminDataService } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.contact') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'تواصل معنا - قنوات الدعم المباشر' : 'Contact Us - Official Support' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Submit your queries, reach our administrative departments, or check physical pension headquarters coordinates.
        </p>
      </div>

      <!-- Split Grid Contact Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        <!-- Left: Inquiry Form Card -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-6">
          <div>
            <h3 class="font-display text-base font-bold text-primary mb-1">
              {{ lang.isRtl() ? 'إرسال استفسار أو مقترح إداري' : 'File Administrative Inquiry' }}
            </h3>
            <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Secure Support Filing</p>
          </div>

          <!-- Contact Reactive Form -->
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Name -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  formControlName="fullName"
                  class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  [placeholder]="lang.isRtl() ? 'مثال: أحمد الحارثي' : 'e.g., Ahmed Al-Harthy'"
                />
              </div>
              
              <!-- Mobile -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Mobile Number</label>
                <input 
                  type="tel" 
                  formControlName="mobile"
                  class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-mono"
                  placeholder="e.g., +968 99887766"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                formControlName="email"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="e.g., name@domain.om"
              />
            </div>

            <!-- Subject Selection -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Inquiry Category</label>
              <select 
                formControlName="subject"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="pension">Pension Calculation & Welfare Claims</option>
                <option value="iban">Bank Details & IBAN Updates</option>
                <option value="funeral">Funeral Claims & Bereavement Grants</option>
                <option value="technical">Website & Technical Portal Access Issues</option>
                <option value="other">General Feedback & Citizen Suggestions</option>
              </select>
            </div>

            <!-- Message Text -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Inquiry details</label>
              <textarea 
                formControlName="message"
                rows="4"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent leading-relaxed"
                [placeholder]="lang.isRtl() ? 'تفاصيل استفسارك بالتفصيل...' : 'Provide full details...'"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="contactForm.invalid"
              class="w-full mt-2 py-3 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-xs transition-all shadow-md disabled:opacity-40 cursor-pointer"
            >
              {{ lang.t('btn.submit') }}
            </button>
          </form>
        </div>

        <!-- Right: Contact Information & Google Maps Stub -->
        <div class="flex flex-col gap-6">
          <!-- Coordinates Info -->
          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">HQ Location</h4>
              <p class="text-[11px] text-stone-500 font-semibold leading-relaxed">
                Building 14, Row 102,<br/>
                Ministries District, Al Khuwair,<br/>
                Muscat, Sultanate of Oman
              </p>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">Fund Support</h4>
              <p class="text-[11px] text-stone-500 font-semibold leading-relaxed">
                Hotline: <a href="tel:80077777" class="text-accent font-bold hover:underline">800-77777</a><br/>
                Telephone: +968 2440 9999<br/>
                Email: <a href="mailto:support&#64;msspf.gov.om" class="text-accent font-bold hover:underline">support&#64;msspf.gov.om</a>
              </p>
            </div>

          </div>

          <!-- Premium Illustrated Google Maps Stub SVG -->
          <div class="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden flex-1 min-h-[220px] relative flex flex-col justify-end p-6 bg-[radial-gradient(#F1EAE0_1px,transparent_1px)] bg-[size:12px_12px] bg-luxury-cream">
            <div class="absolute inset-0 flex items-center justify-center p-6 text-stone-400">
              <!-- Illustrated Military Fort Map Location Vector SVG -->
              <svg viewBox="0 0 100 100" class="w-24 h-24 text-accent/20">
                <circle cx="50" cy="40" r="10" fill="currentColor"/>
                <path d="M50 15c-15 0-25 10-25 25 0 20 25 45 25 45s25-25 25-45c0-15-10-25-25-25zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="relative z-10 w-full p-4 rounded-xl bg-white border border-stone-200/80 shadow-md text-left flex items-center gap-3" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
              </div>
              <div class="flex flex-col text-left" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
                <span class="text-[10px] font-bold text-primary leading-tight">MSSPF Headquarters Map Pin</span>
                <span class="text-[9px] text-stone-400 leading-none">Inter-ministerial Ring Road, Muscat</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class ContactComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  private readonly adminData = inject(AdminDataService);

  readonly contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9\+\s]{8,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['pension', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    const val = this.contactForm.value;
    
    // Push the suggestion to AdminDataService shared signal
    this.adminData.addSuggestion({
      name: val.fullName,
      email: val.email,
      phone: val.mobile,
      subject: this.getSubjectLabel(val.subject),
      message: val.message
    });

    this.notification.success(
      this.lang.isRtl()
        ? 'تم إرسال استفسارك بنجاح. سيقوم أحد موظفي الصندوق بالرد عليك هاتفياً أو عبر البريد قريباً.'
        : 'Inquiry submitted successfully. A fund support officer will contact you shortly.'
    );
    this.contactForm.reset({
      subject: 'pension'
    });
  }

  private getSubjectLabel(subjectKey: string): string {
    const labels: Record<string, string> = {
      'pension': 'Pension Calculation & Welfare Claims',
      'iban': 'Bank Details & IBAN Updates',
      'funeral': 'Funeral Claims & Bereavement Grants',
      'technical': 'Website & Technical Portal Access Issues',
      'other': 'General Feedback & Citizen Suggestions'
    };
    return labels[subjectKey] || subjectKey;
  }
}
