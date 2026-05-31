import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { FileUploaderComponent } from '../../../shared/file-uploader/file-uploader.component';
import { OtpInputComponent } from '../../../shared/otp-input/otp-input.component';
import { DataTableComponent, TableColumn } from '../../../shared/table/table.component';

interface IbanHistory {
  date: string;
  bankName: string;
  iban: string;
  status: 'Approved & Processed' | 'Pending Review';
}

@Component({
  selector: 'app-retiree-bank',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    BreadcrumbComponent, 
    FileUploaderComponent, 
    OtpInputComponent,
    DataTableComponent
  ],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('serv.bank') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('serv.bank') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          Manage your verified commercial bank accounts and securely update your IBAN numbers.
        </p>
      </div>

      <!-- Current IBAN Details & Warning Alert -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
        
        <!-- Masked IBAN Display Card -->
        <div class="md:col-span-1 bg-white border border-stone-200 rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col gap-4">
          <div class="absolute top-0 inset-x-0 h-1 bg-accent"></div>
          
          <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Registered Account</span>
          
          <div class="flex flex-col">
            <span class="text-xs text-stone-400 font-semibold leading-none mb-1">Active Bank Name</span>
            <span class="text-xs font-bold text-primary">Bank Muscat S.A.O.G.</span>
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-stone-400 font-semibold leading-none mb-1">Masked Account Number</span>
            <span class="text-xs font-bold font-mono tracking-wider text-primary select-all">
              {{ auth.currentUser()?.iban }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 text-[9px] text-emerald-600 font-bold uppercase tracking-wider border-t border-stone-100 pt-3">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Central Bank Verified</span>
          </div>
        </div>

        <!-- Omani Pension cut-off Date Alert banner -->
        <div class="md:col-span-2 bg-amber-50 border border-amber-200/60 rounded-2xl p-6 flex items-start gap-3.5">
          <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="flex flex-col text-left" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
            <h4 class="text-xs font-bold text-amber-900 leading-tight mb-1">
              {{ lang.isRtl() ? 'تنبيه تاريخ الاستقطاع وقطع الرواتب' : 'Pension Cut-Off Cycle Advisory' }}
            </h4>
            <p class="text-[10px] text-amber-800 font-semibold leading-relaxed">
              {{ lang.t('iban.warning') }} Administrative logs lock on the 15th to assure timely clearance processes.
            </p>
          </div>
        </div>

      </div>

      <!-- Update IBAN Form / Process -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 animate-fade-in-up">
        
        @if (updateStep() === 'form') {
          <!-- Form View -->
          <div class="flex flex-col gap-6">
            <div>
              <h3 class="font-display text-sm font-bold text-primary mb-1">
                {{ lang.t('iban.update') }}
              </h3>
              <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Multi-factor Security Update</p>
            </div>

            <!-- IBAN Form fields -->
            <form [formGroup]="ibanForm" (ngSubmit)="requestUpdateOtp()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-4">
                <!-- Bank Selector -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {{ lang.t('iban.bankName') }}
                  </label>
                  <select 
                    formControlName="bankName"
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
                  >
                    <option value="Bank Muscat">Bank Muscat S.A.O.G.</option>
                    <option value="Oman Arab Bank">Oman Arab Bank S.A.O.G.</option>
                    <option value="National Bank of Oman">National Bank of Oman S.A.O.G.</option>
                    <option value="Sohar International">Sohar International Bank S.A.O.G.</option>
                    <option value="Bank Dhofar">Bank Dhofar S.A.O.G.</option>
                  </select>
                </div>

                <!-- IBAN String -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {{ lang.t('iban.new') }}
                  </label>
                  <input 
                    type="text" 
                    formControlName="iban"
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-accent focus:border-accent tracking-wider"
                    placeholder="e.g., OM42 ROPB 0000 1234 5678 0001"
                    maxLength="34"
                  />
                  @if (ibanForm.get('iban')?.touched && ibanForm.get('iban')?.invalid) {
                    <span class="text-[9px] text-rose-500 font-bold uppercase mt-0.5">Please provide a valid Omani IBAN (must begin with OM and be 24-34 chars).</span>
                  }
                </div>
              </div>

              <!-- Upload confirmation letter drag-drop -->
              <div class="flex flex-col gap-3">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Official Bank Confirmation Letter</label>
                <app-file-uploader
                  label="Bank Letter Attachment"
                  [allowedTypes]="['application/pdf', 'image/jpeg', 'image/png']"
                  [maxSizeMb]="5"
                  (fileSelected)="onLetterSelected($event)"
                ></app-file-uploader>
              </div>

              <!-- Submit button inline full width -->
              <div class="md:col-span-2 flex justify-end">
                <button 
                  type="submit"
                  [disabled]="ibanForm.invalid || !letterFile()"
                  class="px-6 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
                >
                  Verify via Mobile OTP
                </button>
              </div>
            </form>
          </div>
        } @else {
          <!-- OTP Verification View -->
          <div class="flex flex-col items-center justify-center max-w-sm mx-auto gap-5 text-center animate-fade-in-up">
            <div>
              <h3 class="font-display text-sm font-bold text-primary mb-1">Confirm Secure IBAN Amendment</h3>
              <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">A security OTP was sent to {{ auth.currentUser()?.mobile }}</p>
            </div>
            
            <app-otp-input 
              (otpComplete)="confirmIbanUpdate($event)"
              (resendTriggered)="resendIbanOtp()"
            ></app-otp-input>

            <button 
              (click)="updateStep.set('form')" 
              class="text-stone-400 hover:text-stone-600 font-bold text-[10px] uppercase tracking-wider mt-2"
            >
              &larr; Return to Form
            </button>
          </div>
        }

      </div>

      <!-- History log DataTable -->
      <section class="animate-fade-in-up">
        <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          IBAN Changes History Logs
        </h3>

        <app-data-table
          [columns]="historyColumns"
          [data]="historyLogs()"
          [showSearch]="false"
          [pageSize]="3"
        ></app-data-table>
      </section>

    </div>
  `
})
export class BankComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  private readonly adminData = inject(AdminDataService);

  readonly updateStep = signal<'form' | 'otp'>('form');
  readonly letterFile = signal<File | null>(null);

  readonly ibanForm: FormGroup;

  readonly historyColumns: TableColumn[] = [
    { key: 'date', label: 'Adjustment Date', sortable: true },
    { key: 'bankName', label: 'Commercial Bank', sortable: true },
    { key: 'iban', label: 'Account number (IBAN)', sortable: true },
    { key: 'status', label: 'Verification Status', sortable: true, type: 'badge' }
  ];

  readonly historyLogs = signal<IbanHistory[]>([
    {
      date: '2026-05-27',
      bankName: 'Bank Muscat S.A.O.G.',
      iban: 'OM42 ROPB 0000 1234 5678 0001',
      status: 'Pending Review'
    },
    {
      date: '2023-09-12',
      bankName: 'National Bank of Oman S.A.O.G.',
      iban: 'OM12 NBOB 0000 9999 8888 0012',
      status: 'Approved & Processed'
    }
  ]);

  constructor() {
    this.ibanForm = this.fb.group({
      bankName: ['Bank Muscat', Validators.required],
      // Standard Omani IBAN regex: OMxx followed by 20 to 30 characters
      iban: ['', [Validators.required, Validators.pattern(/^OM[0-9]{2}[A-Z0-9]{20,30}$/i)]]
    });
  }

  onLetterSelected(file: File | null): void {
    this.letterFile.set(file);
  }

  requestUpdateOtp(): void {
    if (this.ibanForm.invalid || !this.letterFile()) return;

    this.updateStep.set('otp');
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم إرسال رمز الأمان الثنائي إلى هاتفك المسجل.' 
        : 'Security verification OTP code sent to your registered mobile.'
    );
  }

  resendIbanOtp(): void {
    this.notification.success(
      this.lang.isRtl() 
        ? 'تمت إعادة إرسال رمز الأمان بنجاح.' 
        : 'Security OTP code resent successfully.'
    );
  }

  confirmIbanUpdate(otp: string): void {
    // Mock check (any 6 digit OTP)
    if (otp.length === 6) {
      const { bankName, iban } = this.ibanForm.value;
      
      // Prepend to history table
      const newLog: IbanHistory = {
        date: new Date().toISOString().split('T')[0],
        bankName,
        iban,
        status: 'Pending Review'
      };
      
      this.historyLogs.update(logs => [newLog, ...logs]);

      // Push global request to AdminDataService for Admin approval!
      this.adminData.addIbanRequest({
        officerId: this.auth.currentUser()?.civilId || '08412952',
        officerName: this.auth.currentUser()?.fullNameEn || 'Salim Al-Abri',
        bankName,
        newIban: iban,
        letterFileName: this.letterFile()?.name || 'iban_letter.pdf'
      });
      
      this.notification.success(
        this.lang.isRtl()
          ? 'تم تقديم طلب تعديل الحساب البنكي (IBAN) بنجاح وهو قيد المراجعة الأمنية.'
          : 'IBAN adjustment request filed successfully and is pending administrative review.'
      );

      // Reset form and return
      this.ibanForm.reset({ bankName: 'Bank Muscat' });
      this.letterFile.set(null);
      this.updateStep.set('form');
    }
  }
}
