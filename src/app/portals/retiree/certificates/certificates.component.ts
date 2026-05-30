import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { PdfViewerComponent, PdfField } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { DataTableComponent, TableColumn } from '../../../shared/table/table.component';

interface CertType {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

interface CertHistory {
  ref: string;
  title: string;
  date: string;
  format: string;
}

@Component({
  selector: 'app-retiree-certificates',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, PdfViewerComponent, DataTableComponent],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('serv.certificates') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('serv.certificates') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          Instantly generate and verify digital QR-coded Omani military pension statement certificates.
        </p>
      </div>

      <!-- Certificate Grid Options -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up">
        @for (cert of certTypes; track cert.id) {
          <div 
            (click)="previewCert(cert.id)"
            class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-accent/40 hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            <!-- Ribbon decoration -->
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="mb-4">
              <!-- Cert Vector badge icon -->
              <div class="h-10 w-10 bg-luxury-cream text-accent border border-accent/15 flex items-center justify-center rounded-xl group-hover:bg-accent group-hover:text-primary transition-colors shadow-sm mb-4">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>

              <h4 class="text-xs font-bold text-primary group-hover:text-accent transition-colors leading-tight mb-2">
                {{ lang.isRtl() ? cert.titleAr : cert.titleEn }}
              </h4>
              <p class="text-[10px] text-stone-400 font-semibold leading-relaxed">
                {{ lang.isRtl() ? cert.descAr : cert.descEn }}
              </p>
            </div>

            <span class="text-[9px] font-bold text-accent group-hover:text-accent-light uppercase tracking-wider block mt-4 select-none">
              Generate Preview &rarr;
            </span>
          </div>
        }
      </div>

      <!-- History of Downloads DataTable -->
      <section class="animate-fade-in-up">
        <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          Certificate Downloads Ledger History
        </h3>

        <app-data-table
          [columns]="columns"
          [data]="historyLogs"
          [showSearch]="false"
          [pageSize]="3"
        ></app-data-table>
      </section>

      <!-- Slide-out PDF Preview modal hook -->
      <app-pdf-viewer
        [isVisible]="pdfViewerOpen()"
        [pdfTitle]="activeCertTitle()"
        [fields]="activeCertFields()"
        (close)="pdfViewerOpen.set(false)"
      ></app-pdf-viewer>

    </div>
  `
})
export class CertificatesComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);

  readonly pdfViewerOpen = signal<boolean>(false);
  readonly activeCertTitle = signal<string>('');
  readonly activeCertFields = signal<PdfField[]>([]);

  readonly certTypes: CertType[] = [
    {
      id: 'pension_entitled',
      titleEn: 'Pension Entitlement Statement',
      titleAr: 'شهادة بيان المعاش التقاعدي',
      descEn: 'Displays verified basic monthly pension, allowance structures, bank details, and active ROP credentials.',
      descAr: 'توضح تفاصيل الراتب التقاعدي الأساسي المعتمد، العلاوات الثابتة، رقم الحساب البنكي، والبيانات العسكرية الموثقة.'
    },
    {
      id: 'heir_share',
      titleEn: 'Heir Share Settlement Certificate',
      titleAr: 'شهادة بيان أنصبة ورثة المتقاعد',
      descEn: 'Formal documentation detailing authorized shares for eligible surviving spouses and children.',
      descAr: 'شهادة رسمية معتمدة تحدد أسماء الورثة المستحقين للحصص التقاعدية وقيمة النصيب التفصيلي لكل وريث مسجل.'
    },
    {
      id: 'settlement_pension',
      titleEn: 'Pension Welfare Settlement Certificate',
      titleAr: 'شهادة إشعار تسوية معاش نهائية',
      descEn: 'Official legal confirmation showing retirement base multipliers, total service years, and lump sum aggregates.',
      descAr: 'بيان توثيقي يثبت تسوية المستحقات المالية ونهاية الخدمة، مبيناً سنوات الخدمة ومضاعف احتساب المعاش والمنح.'
    }
  ];

  readonly columns: TableColumn[] = [
    { key: 'ref', label: 'Certificate Reference', sortable: true },
    { key: 'title', label: 'Certificate Type', sortable: true },
    { key: 'date', label: 'Download Date', sortable: true },
    { key: 'format', label: 'Format Type', sortable: true }
  ];

  readonly historyLogs: CertHistory[] = [
    {
      ref: 'MSSPF/CERT/85124',
      title: 'Pension Entitlement Statement',
      date: '2026-05-24',
      format: 'PDF / QR-Secured'
    },
    {
      ref: 'MSSPF/CERT/81093',
      title: 'Pension Welfare Settlement Certificate',
      date: '2025-11-18',
      format: 'PDF / QR-Secured'
    }
  ];

  previewCert(id: string): void {
    const user = this.auth.currentUser();
    if (!user) return;

    const cert = this.certTypes.find(c => c.id === id);
    if (!cert) return;

    this.activeCertTitle.set(this.lang.isRtl() ? cert.titleAr : cert.titleEn);

    // Build fields dynamically depending on type
    const fields: PdfField[] = [
      { label: 'Retiree Full Name', value: this.lang.isRtl() ? user.fullNameAr : user.fullNameEn },
      { label: 'Civil ID Number', value: user.civilId },
      { label: 'Military Rank / Branch', value: `${this.lang.isRtl() ? user.rankAr : user.rankEn} - ${this.lang.isRtl() ? user.branchAr : user.branchEn}` }
    ];

    if (id === 'pension_entitled') {
      fields.push(
        { label: 'Net Monthly Pension', value: `${user.lastPensionPaid.toFixed(3)} OMR` },
        { label: 'Bank Name & Account', value: `Bank Muscat - ${user.iban.substring(user.iban.length - 8)}` },
        { label: 'Verification Method', value: 'Royal Oman Police & Central Bank Integration' }
      );
    } else if (id === 'heir_share') {
      fields.push(
        { label: 'Approved Heir Count', value: '3 Eligible Claimants' },
        { label: 'Total Heir Pension Value', value: `${(user.lastPensionPaid * 0.85).toFixed(3)} OMR` },
        { label: 'Disbursement Status', value: 'Active monthly division rules applied' }
      );
    } else {
      fields.push(
        { label: 'Base Retirement Multiplier', value: '4.2% per year of service' },
        { label: 'Total Years of Service', value: '24 Years, 6 Months' },
        { label: 'Gratuity Lump Sum Payout', value: '18,500.000 OMR (Processed)' }
      );
    }

    this.activeCertFields.set(fields);
    this.pdfViewerOpen.set(true);
  }
}
