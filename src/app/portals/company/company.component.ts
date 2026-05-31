import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { AdminDataService } from '../../core/services/admin-data.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader.component';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-company-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FileUploaderComponent, AppHeaderComponent, AppFooterComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>

      <main class="flex-grow p-6 md:p-8 bg-stone-50">
        <div class="mx-auto max-w-4xl">
          
          <!-- Breadcrumb Navigation -->
          <app-breadcrumb [items]="[{ label: lang.t('portal.company') }]"></app-breadcrumb>

          <!-- Banner Header -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
              {{ lang.t('portal.company') }}
            </h2>
            <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
              Register commercial details and classifications for military procurement supplier dockets.
            </p>
          </div>

          <!-- Card Content Body -->
          <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 animate-fade-in-up">
            
            @if (!isSuccess()) {
              <!-- Step 1: Form View -->
              <div class="flex flex-col gap-6">
                <div>
                  <h3 class="font-display text-sm font-bold text-primary mb-1">Corporate Registration Dossier</h3>
                  <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Official Supplier Certification</p>
                </div>

                <!-- Registration form -->
                <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <!-- Company Name -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Commercial Company Name</label>
                    <input 
                      type="text" 
                      formControlName="companyName" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      placeholder="e.g. Al-Tasnim Enterprises"
                    />
                  </div>

                  <!-- CR Number -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Commercial Registration (CR) Number</label>
                    <input 
                      type="text" 
                      formControlName="crNumber" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      placeholder="e.g. 1049285"
                    />
                  </div>

                  <!-- CR Expiry -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">CR Expiry Date</label>
                    <input 
                      type="date" 
                      formControlName="crExpiry" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <!-- Contact Person -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Authorized Contact Person</label>
                    <input 
                      type="text" 
                      formControlName="contactPerson" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      placeholder="e.g. Salim Al-Harthy"
                    />
                  </div>

                  <!-- Phone -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Corporate Telephone</label>
                    <input 
                      type="tel" 
                      formControlName="phone" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      placeholder="e.g. +968 24409999"
                    />
                  </div>

                  <!-- Email -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Corporate Email Address</label>
                    <input 
                      type="email" 
                      formControlName="email" 
                      class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      placeholder="e.g. tenders@tasnim.om"
                    />
                  </div>

                  <!-- Multi-select services -->
                  <div class="sm:col-span-2 flex flex-col gap-2 bg-stone-50 p-4 rounded-xl border border-stone-200/60 text-xs">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Supplied Logistics Categories</span>
                    <div class="grid grid-cols-2 gap-2 text-stone-600 font-semibold leading-relaxed">
                      <label class="flex items-center gap-2"><input type="checkbox" class="accent-accent" /> Military Apparel & Uniforms</label>
                      <label class="flex items-center gap-2"><input type="checkbox" class="accent-accent" /> Tactical Communications Systems</label>
                      <label class="flex items-center gap-2"><input type="checkbox" class="accent-accent" /> HQ Facilities & Maintenance</label>
                      <label class="flex items-center gap-2"><input type="checkbox" class="accent-accent" /> Sovereign Catering & Food Supplies</label>
                    </div>
                  </div>

                  <!-- Uploader -->
                  <div class="sm:col-span-2 flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Official CR Certificate Attachment</label>
                    <app-file-uploader
                      label="Commercial Registration Document PDF"
                      (fileSelected)="onCrAttached($event)"
                    ></app-file-uploader>
                  </div>

                  <!-- Submit -->
                  <div class="sm:col-span-2 flex justify-end mt-4">
                    <button 
                      type="submit" 
                      [disabled]="regForm.invalid || !crFile()"
                      class="px-6 py-3.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      File Registration Dossier
                    </button>
                  </div>

                </form>
              </div>
            } @else {
              <!-- Success State -->
              <div class="flex flex-col items-center justify-center p-12 text-center gap-6 animate-fade-in-up">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center border-2 border-emerald-500/20 shadow-md">
                  <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                <div class="space-y-2">
                  <h3 class="font-display text-lg font-bold text-primary">Registration Filed Successfully!</h3>
                  <p class="text-xs text-stone-400 font-bold uppercase tracking-wider font-mono">Dossier Reference: MSSPF/CORP/{{ referenceNo }}</p>
                  <p class="text-xs text-stone-500 font-semibold max-w-md leading-relaxed mx-auto mt-4">
                    Thank you. Your commercial classification dossier and CR certificates have been securely filed. The Procurement and sovereign assets investment committee will analyze parameters and verify ROP records within 5 working days.
                  </p>
                </div>

                <button 
                  (click)="resetForm()"
                  class="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  File Another Registration
                </button>
              </div>
            }

          </div>

        </div>
      </main>

      <app-footer></app-footer>
      <app-toast></app-toast>
    </div>
  `
})
export class CompanyComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly isSuccess = signal<boolean>(false);
  readonly crFile = signal<File | null>(null);
  private readonly adminData = inject(AdminDataService);

  readonly regForm: FormGroup;
  readonly referenceNo = Math.floor(10000 + Math.random() * 90000);

  constructor() {
    this.regForm = this.fb.group({
      companyName: ['', Validators.required],
      crNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Z-]{5,15}$/i)]],
      crExpiry: ['', Validators.required],
      contactPerson: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCrAttached(file: File | null): void {
    this.crFile.set(file);
  }

  onSubmit(): void {
    if (this.regForm.invalid || !this.crFile()) return;
    
    // Push supplier registration dossier to AdminDataService shared signal
    const val = this.regForm.value;
    this.adminData.addCompanyRegistration({
      companyName: val.companyName,
      crNumber: val.crNumber,
      crExpiry: val.crExpiry,
      contactPerson: val.contactPerson,
      phone: val.phone,
      email: val.email,
      categories: ['Tactical Logistics Supplier'],
      crFileName: this.crFile()?.name || 'cr_certificate.pdf'
    });

    this.isSuccess.set(true);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم إرسال ملف تسجيل الموردين والمقاولين التجاريين بنجاح.' 
        : 'Corporate supplier registration filed successfully.'
    );
  }

  resetForm(): void {
    this.regForm.reset();
    this.crFile.set(null);
    this.isSuccess.set(false);
  }
}

// Router routing config export inline
export const companyRoutes = [
  { path: '', component: CompanyComponent }
];
