import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';

export interface PdfField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop Blur Overlay -->
    @if (isVisible()) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in-up"
        (click)="closeModal()"
      >
        <!-- Luxury Slide-in Certificate Window -->
        <div 
          class="relative w-full max-w-2xl bg-stone-100 rounded-2xl shadow-2xl border border-accent/25 flex flex-col p-6 max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
          [dir]="lang.isRtl() ? 'rtl' : 'ltr'"
        >
          <!-- Close Button -->
          <button 
            (click)="closeModal()" 
            class="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1"
            [ngClass]="lang.isRtl() ? 'left-4 right-auto' : 'right-4'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Drawer Header Title -->
          <div class="mb-4 text-center">
            <h3 class="text-xs font-bold uppercase tracking-wider text-accent">Document Preview Drawer</h3>
            <span class="text-[10px] text-stone-400 font-semibold">{{ pdfTitle() }}</span>
          </div>

          <!-- Document Canvas Sheet Mockup (LUXURY STYLE) -->
          <div class="bg-white border-4 border-double border-accent/30 p-8 rounded-xl relative shadow-md select-none overflow-hidden bg-[radial-gradient(#fbf9f6_1px,transparent_1px)] bg-[size:16px_16px]">
            
            <!-- Elegant MSSPF Watermark Overlay in center -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <svg class="w-72 h-72 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"></path>
              </svg>
            </div>

            <!-- Certificate Header -->
            <div class="flex items-center justify-between border-b border-accent/15 pb-6 mb-6">
              <div class="flex flex-col text-left" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
                <span class="font-display font-bold text-xs text-primary leading-tight">Military & Security Services</span>
                <span class="text-[9px] font-bold text-accent uppercase tracking-wider leading-tight">Pension Fund (MSSPF)</span>
              </div>
              
              <!-- Miniature Gold Logo Crest -->
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent p-1.5 shadow-sm border border-accent/20">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                  <path d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"></path>
                </svg>
              </div>

              <div class="flex flex-col text-right" [ngClass]="lang.isRtl() ? 'text-left' : 'text-right'">
                <span class="font-arabic font-extrabold text-xs text-primary leading-tight">صندوق تقاعد الأجهزة</span>
                <span class="font-arabic font-bold text-[9px] text-accent leading-tight">العسكرية والأمنية (سلطنة عمان)</span>
              </div>
            </div>

            <!-- Document Content Title -->
            <div class="text-center mb-8">
              <h2 class="font-display text-sm font-black tracking-wide text-primary border-b border-accent/10 pb-2 inline-block">
                {{ lang.isRtl() ? 'شهادة استحقاق راتب تقاعدي رسمي' : 'OFFICIAL PENSION ENTITLEMENT CERTIFICATE' }}
              </h2>
              <p class="text-[9px] text-stone-400 font-semibold mt-1">Ref: MSSPF/CERT/2026/{{ serialNumber }}</p>
            </div>

            <!-- Metadata Key-Value Field Grid -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-semibold mb-8">
              @for (field of fields(); track field.label) {
                <div class="flex flex-col border-b border-stone-100 pb-1.5 leading-tight">
                  <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">{{ field.label }}</span>
                  <span class="text-stone-800 font-bold text-xs">{{ field.value }}</span>
                </div>
              }
            </div>

            <!-- Certificate Footer (Signatures & Security Verification QR) -->
            <div class="flex items-end justify-between border-t border-accent/15 pt-6">
              <!-- Security QR Signature -->
              <div class="flex flex-col items-center gap-1.5">
                <div class="w-16 h-16 border-2 border-stone-200 p-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <!-- Custom Simulated QR Code Grid (SVG based) -->
                  <svg viewBox="0 0 24 24" class="w-14 h-14 text-stone-800">
                    <rect x="0" y="0" width="7" height="7" fill="currentColor"/>
                    <rect x="1" y="1" width="5" height="5" fill="white"/>
                    <rect x="2" y="2" width="3" height="3" fill="currentColor"/>
                    <rect x="17" y="0" width="7" height="7" fill="currentColor"/>
                    <rect x="18" y="1" width="5" height="5" fill="white"/>
                    <rect x="19" y="2" width="3" height="3" fill="currentColor"/>
                    <rect x="0" y="17" width="7" height="7" fill="currentColor"/>
                    <rect x="1" y="17" width="5" height="5" fill="white"/>
                    <rect x="2" y="17" width="3" height="3" fill="currentColor"/>
                    <rect x="9" y="9" width="3" height="3" fill="currentColor"/>
                    <rect x="14" y="9" width="2" height="2" fill="currentColor"/>
                    <rect x="9" y="14" width="2" height="2" fill="currentColor"/>
                    <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
                  </svg>
                </div>
                <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Scan to Verify Authenticity</span>
              </div>

              <!-- Luxury Signature Seal -->
              <div class="flex flex-col items-center text-center">
                <div class="relative w-16 h-16 rounded-full border-2 border-accent/40 bg-luxury-cream text-primary flex items-center justify-center font-bold text-[9px] uppercase tracking-wider shadow-inner font-display select-none">
                  <div class="absolute inset-1 rounded-full border border-dashed border-accent/30"></div>
                  <!-- Mini Crest inside Seal -->
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-accent opacity-20 absolute">
                    <path d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"></path>
                  </svg>
                  <span>MSSPF<br/>SEAL</span>
                </div>
                <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-2.5">Digital Fund Stamp</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Controls -->
          <div class="mt-6 flex items-center justify-end gap-3">
            <button 
              (click)="closeModal()"
              class="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {{ lang.t('btn.cancel') }}
            </button>
            <button 
              (click)="downloadCertificate()"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>{{ lang.t('btn.download') }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class PdfViewerComponent {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);

  readonly isVisible = input.required<boolean>();
  readonly pdfTitle = input.required<string>();
  readonly fields = input.required<PdfField[]>();

  readonly close = output<void>();

  readonly serialNumber = Math.floor(100000 + Math.random() * 900000);

  closeModal(): void {
    this.close.emit();
  }

  downloadCertificate(): void {
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم تحميل الشهادة التقاعدية بنجاح كملف PDF رقمي موثق.' 
        : 'Pension certificate downloaded successfully as a digitally signed PDF.'
    );
    this.closeModal();
  }
}
