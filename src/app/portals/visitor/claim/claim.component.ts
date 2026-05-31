import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { StepperComponent } from '../../../shared/stepper/stepper.component';
import { FileUploaderComponent } from '../../../shared/file-uploader/file-uploader.component';

@Component({
  selector: 'app-visitor-claim',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    BreadcrumbComponent, 
    StepperComponent, 
    FileUploaderComponent
  ],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb 
        [items]="[
          { label: lang.t('portal.visitor'), link: '/visitor' },
          { label: lang.t('funeral.wizard') }
        ]"
      ></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('funeral.wizard') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          File for bereavement grants of deceased military officers and secure legal heir disbursements.
        </p>
      </div>

      <!-- Multi-step Wizard Stepper Bar -->
      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-4 animate-fade-in-up">
        <app-stepper [steps]="stepLabels()" [activeStep]="currentStep()"></app-stepper>
      </div>

      <!-- Stepper Sheets Forms wrapper -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 animate-fade-in-up">
        
        <form [formGroup]="claimForm" class="flex flex-col gap-5">
          
          <!-- STEP 1: Deceased Info -->
          @if (currentStep() === 0) {
            <div class="flex flex-col gap-4 animate-fade-in-up" formGroupName="deceased">
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('funeral.step1') }}
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Deceased Civil ID</label>
                  <input 
                    type="text" 
                    formControlName="civilId" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono font-bold text-center tracking-widest outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    maxLength="8"
                    placeholder="e.g. 08412952"
                  />
                </div>
                
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="date" 
                    formControlName="expiryDate" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  />
                </div>
              </div>
            </div>
          }

          <!-- STEP 2: Applicant Info -->
          @if (currentStep() === 1) {
            <div class="flex flex-col gap-4 animate-fade-in-up" formGroupName="applicant">
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('funeral.step2') }}
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col gap-1 sm:col-span-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    placeholder="e.g. Salim Al-Abri"
                  />
                </div>

                <div class="flex flex-col gap-1 sm:col-span-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Relationship to Deceased</label>
                  <select 
                    formControlName="relationship" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
                  >
                    <option value="Spouse">Spouse (أرملة / زوج)</option>
                    <option value="Son">Son (ابن)</option>
                    <option value="Daughter">Daughter (ابنة)</option>
                    <option value="Brother">Brother (أخ)</option>
                    <option value="Legal_Guardian">Legal Guardian (وصي شرعي)</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1 sm:col-span-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Mobile Number</label>
                  <input 
                    type="tel" 
                    formControlName="mobile" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    placeholder="e.g. +968 99887766"
                  />
                </div>
              </div>
            </div>
          }

          <!-- STEP 3: Bank Details -->
          @if (currentStep() === 2) {
            <div class="flex flex-col gap-4 animate-fade-in-up" formGroupName="bank">
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('funeral.step3') }}
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Commercial Bank Name</label>
                  <select 
                    formControlName="bankName" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
                  >
                    <option value="Bank Muscat">Bank Muscat S.A.O.G.</option>
                    <option value="Oman Arab Bank">Oman Arab Bank S.A.O.G.</option>
                    <option value="National Bank of Oman">National Bank of Oman S.A.O.G.</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Applicant IBAN Number</label>
                  <input 
                    type="text" 
                    formControlName="iban" 
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-accent focus:border-accent tracking-wider"
                    placeholder="e.g. OM42 ROPB 0000 1234 5678 0001"
                  />
                </div>
              </div>
            </div>
          }

          <!-- STEP 4: Document Upload -->
          @if (currentStep() === 3) {
            <div class="flex flex-col gap-5 animate-fade-in-up">
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('funeral.step4') }}
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Legal Heir Cert -->
                <app-file-uploader
                  label="Legal Heir Certificate (حصر الإرث)"
                  (fileSelected)="onDocSelected('heirCert', $event)"
                ></app-file-uploader>

                <!-- Death Cert -->
                <app-file-uploader
                  label="Official Death Certificate (شهادة الوفاة)"
                  (fileSelected)="onDocSelected('deathCert', $event)"
                ></app-file-uploader>

                <!-- Applicant ID -->
                <app-file-uploader
                  label="Applicant Civil ID copy (البطاقة المدنية)"
                  (fileSelected)="onDocSelected('applicantId', $event)"
                ></app-file-uploader>

                <!-- Applicant Bank Card -->
                <app-file-uploader
                  label="Applicant Bank Confirmation Card / Letter"
                  (fileSelected)="onDocSelected('bankCard', $event)"
                ></app-file-uploader>
              </div>
            </div>
          }

          <!-- STEP 5: Review & Submit -->
          @if (currentStep() === 4) {
            <div class="flex flex-col gap-6 animate-fade-in-up">
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('funeral.step5') }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-500 font-semibold leading-relaxed">
                <!-- Deceased info box -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-stone-700">Deceased Info</h4>
                    <button (click)="goToStep(0)" class="text-[9px] text-accent font-bold hover:underline">Edit</button>
                  </div>
                  <p>Civil ID: {{ claimForm.value.deceased.civilId }}</p>
                  <p>Expiry: {{ claimForm.value.deceased.expiryDate }}</p>
                </div>

                <!-- Applicant info box -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-stone-700">Applicant Info</h4>
                    <button (click)="goToStep(1)" class="text-[9px] text-accent font-bold hover:underline">Edit</button>
                  </div>
                  <p>Name: {{ claimForm.value.applicant.name }}</p>
                  <p>Relation: {{ claimForm.value.applicant.relationship }}</p>
                  <p>Mobile: {{ claimForm.value.applicant.mobile }}</p>
                </div>

                <!-- Bank Info box -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-stone-700">Bank Details</h4>
                    <button (click)="goToStep(2)" class="text-[9px] text-accent font-bold hover:underline">Edit</button>
                  </div>
                  <p>Bank: {{ claimForm.value.bank.bankName }}</p>
                  <p class="truncate">IBAN: {{ claimForm.value.bank.iban }}</p>
                </div>
              </div>

              <!-- Uploaded docs indicator list -->
              <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/50 text-xs font-bold text-emerald-800 flex flex-col gap-2">
                <h4 class="text-stone-700 font-bold mb-1">Attached Official Documents Verification</h4>
                <div class="flex items-center gap-2">&check; Legal Heir Certificate (Attached)</div>
                <div class="flex items-center gap-2">&check; Official Death Certificate (Attached)</div>
                <div class="flex items-center gap-2">&check; Applicant Civil ID copy (Attached)</div>
                <div class="flex items-center gap-2">&check; Bank Card / Letter verification (Attached)</div>
              </div>
            </div>
          }

          <!-- Bottom Prev / Next / Submit Controls -->
          <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
            <button 
              type="button"
              [disabled]="currentStep() === 0"
              (click)="prevStep()"
              class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              &larr; {{ lang.t('btn.prev') }}
            </button>

            @if (currentStep() < 4) {
              <button 
                type="button"
                [disabled]="isStepInvalid()"
                (click)="nextStep()"
                class="px-5 py-2 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md"
              >
                {{ lang.t('btn.next') }} &rarr;
              </button>
            } @else {
              <button 
                type="button"
                (click)="submitClaim()"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5"
              >
                {{ lang.t('btn.submit') }}
              </button>
            }
          </div>

        </form>

      </div>
    </div>
  `
})
export class ClaimComponent implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly adminData = inject(AdminDataService);

  readonly currentStep = signal<number>(0);
  readonly stepLabels = signal<string[]>(['Deceased Info', 'Applicant Info', 'Bank Details', 'Document Uploads', 'Review & Submit']);

  readonly claimForm: FormGroup;
  
  // Track document selection states
  readonly docs = signal<Record<string, File | null>>({
    heirCert: null,
    deathCert: null,
    applicantId: null,
    bankCard: null
  });

  constructor() {
    this.claimForm = this.fb.group({
      deceased: this.fb.group({
        civilId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
        expiryDate: ['', Validators.required]
      }),
      applicant: this.fb.group({
        name: ['', Validators.required],
        relationship: ['Spouse', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,15}$/)]]
      }),
      bank: this.fb.group({
        bankName: ['Bank Muscat', Validators.required],
        iban: ['', [Validators.required, Validators.pattern(/^OM[0-9]{2}[A-Z0-9]{20,30}$/i)]]
      })
    });
  }

  ngOnInit(): void {
    this.loadDraft();

    // Auto-save drafts dynamically on any form parameters changes
    this.claimForm.valueChanges.subscribe(() => {
      this.saveDraft();
    });
  }

  private saveDraft(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('msspf_funeral_claim_draft', JSON.stringify({
        form: this.claimForm.value,
        step: this.currentStep()
      }));
    }
  }

  private loadDraft(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('msspf_funeral_claim_draft');
      if (saved) {
        try {
          const { form, step } = JSON.parse(saved);
          this.claimForm.patchValue(form);
          this.currentStep.set(step);
          this.notification.info(this.lang.t('funeral.saved'));
        } catch {
          // Clear corrupt drafts
          localStorage.removeItem('msspf_funeral_claim_draft');
        }
      }
    }
  }

  private clearDraft(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('msspf_funeral_claim_draft');
    }
  }

  onDocSelected(key: string, file: File | null): void {
    const activeDocs = { ...this.docs() };
    activeDocs[key] = file;
    this.docs.set(activeDocs);
    this.saveDraft();
  }

  isStepInvalid(): boolean {
    const step = this.currentStep();
    if (step === 0) return this.claimForm.get('deceased')?.invalid ?? true;
    if (step === 1) return this.claimForm.get('applicant')?.invalid ?? true;
    if (step === 2) return this.claimForm.get('bank')?.invalid ?? true;
    if (step === 3) {
      const active = this.docs();
      // Ensure all 4 docs are attached
      return !active['heirCert'] || !active['deathCert'] || !active['applicantId'] || !active['bankCard'];
    }
    return false;
  }

  nextStep(): void {
    if (this.currentStep() < 4 && !this.isStepInvalid()) {
      this.currentStep.update(s => s + 1);
      this.saveDraft();
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
      this.saveDraft();
    }
  }

  goToStep(index: number): void {
    this.currentStep.set(index);
    this.saveDraft();
  }

  submitClaim(): void {
    // Perform final validation checks
    if (this.claimForm.invalid || this.isStepInvalid()) return;

    // Push the claim to AdminDataService shared signal
    const decVal = this.claimForm.value.deceased || {};
    const appVal = this.claimForm.value.applicant || {};
    const bankVal = this.claimForm.value.bank || {};
    const docsVal = this.docs();

    this.adminData.addFuneralClaim({
      deceasedId: decVal.civilId || 'Unknown ID',
      deceasedName: `Deceased Officer (${decVal.civilId})`,
      applicantName: appVal.name || 'Anonymous Applicant',
      applicantPhone: appVal.mobile || '99999999',
      relationship: appVal.relationship || 'Relative',
      iban: bankVal.iban || 'OM48BANK0000000000000000',
      heirCert: docsVal['heirCert']?.name || 'heir_certificate.pdf',
      deathCert: docsVal['deathCert']?.name || 'death_certificate.pdf',
      applicantId: docsVal['applicantId']?.name || 'applicant_id.pdf',
      bankCard: docsVal['bankCard']?.name || 'bank_card.pdf'
    });

    this.notification.success(
      this.lang.isRtl()
        ? 'تم إرسال طلب مستحقات مصاريف الجنازة والتعازي بنجاح وهو قيد المراجعة الإدارية (المرجع المرجعي: MSSPF/CLM/309).'
        : 'Funeral expense claim submitted successfully. Track status reference: MSSPF/CLM/309.'
    );
    
    this.clearDraft();
    this.claimForm.reset();
    this.docs.set({
      heirCert: null,
      deathCert: null,
      applicantId: null,
      bankCard: null
    });

    this.router.navigate(['/visitor']);
  }
}
