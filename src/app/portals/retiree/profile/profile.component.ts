import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { OtpInputComponent } from '../../../shared/otp-input/otp-input.component';

@Component({
  selector: 'app-retiree-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, OtpInputComponent],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('serv.profile') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('serv.profile') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          Verify your official military registers and update contacts.
        </p>
      </div>

      <!-- ROP Integration Informational Alert -->
      <div class="p-4 bg-emerald-50 border border-emerald-200/50 rounded-2xl flex items-start gap-3 animate-fade-in-up">
        <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <!-- ROP Shield / Verified SVG -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <div class="flex flex-col text-left" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
          <h4 class="text-xs font-bold text-emerald-950 leading-tight mb-1">ROP Verified Credentials</h4>
          <p class="text-[10px] text-stone-600 font-semibold leading-relaxed">
            {{ lang.t('profile.readonly') }} Legal identity updates require civil records filing.
          </p>
        </div>
      </div>

      <!-- Split Layout: Read-only parameters vs contact parameters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
        
        <!-- Column 1 & 2: Official Verified Fields (Read-Only) -->
        <div class="md:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <h3 class="font-display text-sm font-bold text-primary border-b border-stone-100 pb-3 leading-none">
            {{ lang.isRtl() ? 'السجل العسكري الموثق' : 'Verified Service Registers' }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs font-semibold leading-none">
            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Retiree Full Name</span>
              <span class="text-stone-700 font-bold">{{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}</span>
            </div>
            
            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Civil ID Number</span>
              <span class="text-stone-700 font-mono">{{ auth.currentUser()?.civilId }}</span>
            </div>

            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Military Rank</span>
              <span class="text-stone-700 font-bold">{{ lang.isRtl() ? auth.currentUser()?.rankAr : auth.currentUser()?.rankEn }}</span>
            </div>

            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Military Branch</span>
              <span class="text-stone-700 font-bold">{{ lang.isRtl() ? auth.currentUser()?.branchAr : auth.currentUser()?.branchEn }}</span>
            </div>

            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Retirement Date</span>
              <span class="text-stone-700 font-mono">2024-03-12</span>
            </div>

            <div class="flex flex-col border-b border-stone-50 pb-1.5">
              <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Last Basic Pension</span>
              <span class="text-stone-700 font-bold">{{ auth.currentUser()?.lastPensionPaid | number:'1.3-3' }} OMR</span>
            </div>
          </div>
        </div>

        <!-- Column 3: Contact details (Editable) -->
        <div class="md:col-span-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 inset-x-0 h-1 bg-accent"></div>
          
          <div class="space-y-6">
            <h3 class="font-display text-sm font-bold text-primary border-b border-stone-100 pb-3 leading-none">
              Contact Channels
            </h3>

            <div class="flex flex-col gap-4">
              <!-- Mobile field -->
              <div class="flex flex-col leading-tight">
                <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                  {{ lang.t('profile.phone') }}
                </span>
                <div class="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5">
                  <span class="text-stone-700 font-bold font-mono">{{ auth.currentUser()?.mobile }}</span>
                  <button (click)="openMobileModal()" class="text-[9px] text-accent font-bold uppercase tracking-wider hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>
              </div>

              <!-- Address field -->
              <div class="flex flex-col leading-tight">
                <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                  {{ lang.t('profile.address') }}
                </span>
                <div class="flex items-start justify-between gap-2 border-b border-stone-100 pb-1.5">
                  <span class="text-stone-700 font-bold text-xs max-w-[150px] leading-relaxed">
                    {{ lang.isRtl() ? auth.currentUser()?.addressAr : auth.currentUser()?.addressEn }}
                  </span>
                  <button (click)="openAddressModal()" class="text-[9px] text-accent font-bold uppercase tracking-wider hover:underline cursor-pointer flex-shrink-0">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-6 pt-3 border-t border-stone-100 flex items-center gap-1 leading-none">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>Mobile changes require SMS OTP</span>
          </div>
        </div>

      </div>

      <!-- Modal 1: Edit Mobile (OTP-Protected) -->
      @if (mobileModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in-up" (click)="mobileModalVisible.set(false)">
          <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-accent/25 p-6 flex flex-col gap-5" (click)="$event.stopPropagation()">
            
            @if (otpStep() === 'form') {
              <!-- Phone form -->
              <div>
                <h3 class="font-display text-sm font-bold text-primary mb-1">Update Mobile Number</h3>
                <p class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">SMS Authentication Required</p>
              </div>

              <form [formGroup]="mobileForm" (ngSubmit)="sendMobileOtp()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">New Phone Number</label>
                  <input 
                    type="tel" 
                    formControlName="mobile"
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    placeholder="e.g., +968 99887766"
                  />
                </div>

                <div class="flex justify-end gap-3 mt-2">
                  <button type="button" (click)="mobileModalVisible.set(false)" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" [disabled]="mobileForm.invalid" class="px-5 py-2 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md">Verify OTP</button>
                </div>
              </form>
            } @else {
              <!-- OTP check -->
              <div class="flex flex-col items-center gap-5 text-center">
                <div>
                  <h3 class="font-display text-sm font-bold text-primary mb-1">Verify Mobile Update</h3>
                  <p class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Enter OTP sent to your new mobile</p>
                </div>
                
                <app-otp-input 
                  (otpComplete)="confirmMobileUpdate($event)"
                  (resendTriggered)="resendProfileOtp()"
                ></app-otp-input>

                <button (click)="otpStep.set('form')" class="text-stone-400 hover:text-stone-600 font-bold text-[9px] uppercase tracking-wider">
                  &larr; Change Number
                </button>
              </div>
            }

          </div>
        </div>
      }

      <!-- Modal 2: Edit Address -->
      @if (addressModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in-up" (click)="addressModalVisible.set(false)">
          <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-accent/25 p-6 flex flex-col gap-5" (click)="$event.stopPropagation()">
            
            <div>
              <h3 class="font-display text-sm font-bold text-primary mb-1">Update Home Address</h3>
              <p class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Contact Records Adjustment</p>
            </div>

            <form [formGroup]="addressForm" (ngSubmit)="confirmAddressUpdate()" class="flex flex-col gap-4">
              <!-- Address En -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Address (English)</label>
                <input 
                  type="text" 
                  formControlName="addressEn"
                  class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                  placeholder="e.g., Villa 12, Way 3045, Muscat"
                />
              </div>

              <!-- Address Ar -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">العنوان (بالعربية)</label>
                <input 
                  type="text" 
                  formControlName="addressAr"
                  class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                  placeholder="مثال: فيلا ١٢، سكة ٣٠٤٥، مسقط"
                />
              </div>

              <div class="flex justify-end gap-3 mt-2">
                <button type="button" (click)="addressModalVisible.set(false)" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" [disabled]="addressForm.invalid" class="px-5 py-2 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md">Update Address</button>
              </div>
            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class ProfileComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly mobileModalVisible = signal<boolean>(false);
  readonly addressModalVisible = signal<boolean>(false);
  readonly otpStep = signal<'form' | 'otp'>('form');

  readonly mobileForm: FormGroup;
  readonly addressForm: FormGroup;

  constructor() {
    this.mobileForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,15}$/)]]
    });

    this.addressForm = this.fb.group({
      addressEn: ['', [Validators.required, Validators.minLength(6)]],
      addressAr: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  openMobileModal(): void {
    this.mobileForm.reset({
      mobile: this.auth.currentUser()?.mobile
    });
    this.otpStep.set('form');
    this.mobileModalVisible.set(true);
  }

  openAddressModal(): void {
    this.addressForm.reset({
      addressEn: this.auth.currentUser()?.addressEn,
      addressAr: this.auth.currentUser()?.addressAr
    });
    this.addressModalVisible.set(true);
  }

  sendMobileOtp(): void {
    if (this.mobileForm.invalid) return;
    this.otpStep.set('otp');
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم إرسال رمز التحقق الأمني لهاتفك الجوال الجديد.' 
        : 'Security OTP code sent to your new mobile number.'
    );
  }

  resendProfileOtp(): void {
    this.notification.success(
      this.lang.isRtl() ? 'تم إرسال رمز الأمان مجدداً.' : 'Security OTP code resent successfully.'
    );
  }

  confirmMobileUpdate(otp: string): void {
    if (otp.length === 6) {
      const { mobile } = this.mobileForm.value;
      this.auth.updateProfileMobile(mobile);
      
      this.notification.success(
        this.lang.isRtl() 
          ? 'تم تحديث رقم الهاتف النقال للمتقاعد بنجاح.' 
          : 'Retiree mobile number updated successfully.'
      );
      this.mobileModalVisible.set(false);
    }
  }

  confirmAddressUpdate(): void {
    if (this.addressForm.invalid) return;

    const { addressEn, addressAr } = this.addressForm.value;
    this.auth.updateProfileAddress(addressEn, addressAr);

    this.notification.success(
      this.lang.isRtl() 
        ? 'تم تحديث العنوان السكني للمتقاعد في السجل.' 
        : 'Retiree home address updated successfully.'
    );
    this.addressModalVisible.set(false);
  }
}
