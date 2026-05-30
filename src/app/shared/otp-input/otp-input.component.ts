import { Component, inject, input, output, signal, viewChildren, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- 6-digit Input Boxes Container -->
      <div class="flex items-center gap-2 sm:gap-3">
        @for (box of [0,1,2,3,4,5]; track $index) {
          <input 
            #otpBox
            type="text" 
            maxLength="1" 
            pattern="[0-9]*" 
            inputmode="numeric"
            (input)="onInput($index, $event)"
            (keydown)="onKeyDown($index, $event)"
            class="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border border-stone-200 bg-white text-center text-lg font-bold text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none shadow-sm transition-all"
          />
        }
      </div>

      <!-- Timer Indicator -->
      <div class="flex flex-col items-center gap-2 select-none">
        @if (timeLeft() > 0) {
          <div class="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
            <!-- Spinner / Timer Icon -->
            <svg class="w-4 h-4 text-accent animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>
              {{ lang.isRtl() ? 'إعادة إرسال الرمز خلال:' : 'Resend code in:' }} 
              <span class="text-accent font-extrabold">{{ timeLeft() }}s</span>
            </span>
          </div>
        } @else {
          <!-- Resend Trigger Call-to-action -->
          <button 
            (click)="triggerResend()"
            class="text-xs font-extrabold text-accent hover:text-accent-light hover:underline transition-colors cursor-pointer"
          >
            {{ lang.t('auth.resendOtp') }}
          </button>
        }
      </div>
    </div>
  `
})
export class OtpInputComponent implements OnInit, OnDestroy {
  readonly lang = inject(LanguageService);

  readonly otpComplete = output<string>();
  readonly resendTriggered = output<void>();

  // Element query references for autofocus and moving focus
  readonly boxRefs = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

  readonly timeLeft = signal<number>(60);
  readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);

  private timerInterval?: any;

  ngOnInit(): void {
    this.startCountdown();
    // Proactively autofocus first field after DOM resolves
    setTimeout(() => {
      this.focusBox(0);
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  private startCountdown(): void {
    this.timeLeft.set(60);
    this.stopCountdown();
    this.timerInterval = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) {
          this.stopCountdown();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  onInput(index: number, event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value.replace(/[^0-9]/g, ''); // Number only filter
    inputEl.value = value;

    const digits = [...this.otpDigits()];
    digits[index] = value;
    this.otpDigits.set(digits);

    if (value && index < 5) {
      this.focusBox(index + 1);
    }

    this.checkComplete();
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const digits = [...this.otpDigits()];
      
      // If active field is empty, move backward and clear previous box
      if (!digits[index] && index > 0) {
        digits[index - 1] = '';
        this.otpDigits.set(digits);
        
        const prevBox = this.boxRefs()[index - 1].nativeElement;
        prevBox.value = '';
        
        this.focusBox(index - 1);
      } else {
        // Just clear active
        digits[index] = '';
        this.otpDigits.set(digits);
      }
      this.checkComplete();
    }
  }

  private focusBox(index: number): void {
    const refs = this.boxRefs();
    if (refs && refs[index]) {
      refs[index].nativeElement.focus();
    }
  }

  private checkComplete(): void {
    const otp = this.otpDigits().join('');
    if (otp.length === 6) {
      this.otpComplete.emit(otp);
    }
  }

  triggerResend(): void {
    // Clear fields
    this.otpDigits.set(['', '', '', '', '', '']);
    this.boxRefs().forEach(ref => {
      ref.nativeElement.value = '';
    });
    
    this.resendTriggered.emit();
    this.startCountdown();
    this.focusBox(0);
  }
}
