import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { OtpInputComponent } from '../../../shared/otp-input/otp-input.component';

@Component({
  selector: 'app-retiree-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, OtpInputComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] bg-[size:20px_20px] bg-luxury-cream" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Sticky Toast alerts for invalid OTPs -->
      <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <!-- Renders notifications stack if needed -->
      </div>

      <!-- Luxury Glassmorphism Login Container Card -->
      <div class="w-full max-w-md bg-white border border-accent/20 rounded-3xl shadow-xl overflow-hidden relative flex flex-col items-center p-6 sm:p-8 animate-fade-in-up">
        
        <!-- Gold double ribbon header accent -->
        <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary via-accent to-secondary"></div>

        <!-- Crest Icon Shield -->
        <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-accent border border-accent/25 shadow-md">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"></path>
          </svg>
        </div>

        <div class="text-center mb-8">
          <h2 class="font-display text-lg sm:text-xl font-black text-primary leading-tight">
            {{ lang.isRtl() ? 'الدخول الآمن لبوابة المتقاعدين' : 'Secure Retiree Portal Entry' }}
          </h2>
          <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1 block">Military Services Welfare</span>
        </div>

        <!-- Conditional view togglers -->
        @if (authStep() === 'civilId') {
          <!-- Step 1: Input Civil ID Form -->
          <form [formGroup]="loginForm" (ngSubmit)="requestOtp()" class="w-full flex flex-col gap-4">
            
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {{ lang.t('auth.civilId') }}
              </label>
              <input 
                type="text" 
                formControlName="civilId"
                class="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-accent focus:border-accent text-center tracking-widest"
                placeholder="e.g. 08412952"
                maxLength="8"
              />
              @if (loginForm.get('civilId')?.touched && loginForm.get('civilId')?.invalid) {
                <span class="text-[9px] text-rose-500 font-bold uppercase mt-0.5">Please provide a valid 8-digit Civil ID number.</span>
              }
            </div>

            <!-- OTP Request Submit Button -->
            <button 
              type="submit"
              [disabled]="loginForm.invalid || isRequesting()"
              class="w-full mt-2 py-3 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-xs transition-all shadow-md disabled:opacity-40 cursor-pointer"
            >
              @if (isRequesting()) {
                <span>Requesting OTP...</span>
              } @else {
                {{ lang.t('auth.requestOtp') }}
              }
            </button>

            <!-- Face Recognition Option Card -->
            <div 
              (click)="authenticateFace()"
              class="mt-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors flex items-center gap-3 cursor-pointer select-none group border-dashed"
            >
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-luxury-cream text-accent border border-accent/15 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                <!-- Face ID Scan SVG -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2H7z"></path>
                </svg>
              </div>
              <div class="flex flex-col text-left" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
                <span class="text-[10px] font-bold text-stone-700 leading-tight">{{ lang.t('auth.facePlaceholder') }}</span>
                <span class="text-[8px] text-stone-400 mt-0.5 leading-none font-semibold">{{ lang.t('auth.faceDesc') }}</span>
              </div>
            </div>

            <!-- Guest Link -->
            <a 
              routerLink="/visitor" 
              class="mt-6 text-center text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors"
            >
              {{ lang.t('auth.visitorLink') }}
            </a>
          </form>
        } @else if (authStep() === 'otp') {
          <!-- Step 2: Input Verification Code OTP -->
          <div class="w-full flex flex-col gap-6 animate-fade-in-up">
            <p class="text-xs text-stone-500 font-semibold leading-relaxed text-center">
              {{ lang.t('auth.otpSent') }}<br/>
              Enter code <span class="text-accent font-extrabold font-mono">123456</span> to access.
            </p>

            <app-otp-input 
              (otpComplete)="verifyOtp($event)"
              (resendTriggered)="resendOtp()"
            ></app-otp-input>

            <button 
              (click)="authStep.set('civilId')" 
              class="text-center text-[10px] font-bold text-accent hover:text-accent-light uppercase tracking-wider mt-4"
            >
              &larr; Back to Civil ID
            </button>
          </div>
        } @else {
          <!-- Step 3: Face Scanning Placeholder Loop -->
          <div class="w-full flex flex-col items-center justify-center py-6 gap-6 animate-fade-in-up select-none">
            <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 border-2 border-accent border-dashed animate-spin">
              <!-- Radar sweep ring -->
              <span class="absolute inset-0 rounded-full animate-ping bg-accent opacity-20"></span>
            </div>
            
            <div class="text-center">
              <h4 class="text-xs font-bold text-accent mb-1 animate-pulse">Scanning Biometric Features...</h4>
              <p class="text-[9px] text-stone-400 font-semibold leading-none">Do not close front camera panel</p>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class LoginComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly loginForm: FormGroup;
  readonly authStep = signal<'civilId' | 'otp' | 'face'>('civilId');
  readonly isRequesting = signal<boolean>(false);

  constructor() {
    this.loginForm = this.fb.group({
      civilId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });
  }

  requestOtp(): void {
    if (this.loginForm.invalid) return;

    this.isRequesting.set(true);
    const { civilId } = this.loginForm.value;

    this.auth.requestOtp(civilId).subscribe(() => {
      this.isRequesting.set(false);
      this.authStep.set('otp');
      this.notification.success(
        this.lang.isRtl() 
          ? 'تم إرسال رمز التحقق لهاتفك المسجل بنجاح' 
          : 'Verification code OTP sent successfully to mobile.'
      );
    });
  }

  verifyOtp(otp: string): void {
    this.auth.verifyOtp(otp).subscribe(success => {
      if (success) {
        this.notification.success(
          this.lang.isRtl() 
            ? 'مرحباً بك مجدداً. تم التحقق من هويتك بنجاح.' 
            : 'Welcome back. Identity verified successfully.'
        );
        this.router.navigate(['/retiree']);
      } else {
        this.notification.error(
          this.lang.isRtl() 
            ? 'فشل التحقق: رمز المرور المدخل غير صحيح' 
            : 'Verification failed: Invalid OTP code provided.'
        );
      }
    });
  }

  resendOtp(): void {
    this.notification.success(
      this.lang.isRtl() 
        ? 'تمت إعادة إرسال الرمز بنجاح. يرجى التحقق من الرسائل الواردة.' 
        : 'OTP code resent successfully. Please check your SMS inbox.'
    );
  }

  authenticateFace(): void {
    this.authStep.set('face');
    this.auth.authenticateWithFace().subscribe(() => {
      this.notification.success(
        this.lang.isRtl() 
          ? 'تم التحقق البصري الآمن لبصمة الوجه بنجاح.' 
          : 'Face ID biometric scanner verified successfully.'
      );
      this.router.navigate(['/retiree']);
    });
  }
}
