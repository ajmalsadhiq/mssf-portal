import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

interface FaqItem {
  id: string;
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.faq') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'الأسئلة الشائعة والإجابات الاسترشادية' : 'Frequently Asked Questions' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Quickly resolve administrative queries by reviewing official advisory details for retirees, legal heirs, and banks.
        </p>
      </div>

      <!-- Accordion Grid -->
      <div class="flex flex-col gap-4 mb-16">
        @for (item of faqs(); track item.id) {
          <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300">
            <!-- Accordion Header Button -->
            <button 
              (click)="toggleFaq(item.id)"
              class="w-full px-6 py-4 flex items-center justify-between text-stone-800 hover:bg-stone-50 transition-colors text-xs sm:text-sm font-bold text-left outline-none cursor-pointer"
              [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'"
            >
              <span>{{ lang.isRtl() ? item.qAr : item.qEn }}</span>
              
              <!-- Gold indicator arrow -->
              <svg 
                class="w-4 h-4 text-accent transition-transform duration-300 flex-shrink-0"
                [ngClass]="{'rotate-180': item.open}"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Collapsible Body Content -->
            @if (item.open) {
              <div class="px-6 pb-5 pt-1 text-xs text-stone-500 font-medium leading-relaxed border-t border-stone-100 bg-stone-50/20 animate-fade-in-up">
                {{ lang.isRtl() ? item.aAr : item.aEn }}
              </div>
            }
          </div>
        }
      </div>

    </div>
  `
})
export class FaqComponent {
  readonly lang = inject(LanguageService);

  readonly faqs = signal<FaqItem[]>([
    {
      id: 'faq-1',
      qEn: 'Who is eligible to draw pension benefits from the Military & Security Services Pension Fund?',
      qAr: 'من هي الفئات المستحقة لصرف المعاش التقاعدي من صندوق تقاعد الأجهزة العسكرية والأمنية؟',
      aEn: 'Eligible recipients include retired military and security personnel who have completed a minimum of 15 years of active service under Omani regulations, or those medically discharged. In the event of a retiree\'s passing, eligible legal heirs (surviving spouses, children, dependent parents) receive pension shares based on royal decree frameworks.',
      aAr: 'يستحق المعاش التقاعدي العسكريون ورجال الأمن الذين أكملوا مدة الخدمة الفعلية المقررة قانوناً (١٥ سنة على الأقل)، أو الذين يتم إنهاء خدماتهم لأسباب صحية وعجز مسبب عن العمل. وفي حالة الوفاة، ينتقل الحق في المعاش للورثة المستحقين (الأرامل، الأبناء والبنات، الوالدين المعالين) وفق الحصص المقررة بقانون الصندوق.',
      open: true
    },
    {
      id: 'faq-2',
      qEn: 'What is the schedule for monthly retiree pension disbursements?',
      qAr: 'ما هو التاريخ والموعد المحدد لصرف رواتب المتقاعدين شهرياً؟',
      aEn: 'Monthly military pensions are disbursed on the 18th to the 22nd of each Gregorian month, transferred securely via the Central Bank of Oman to registered commercial banks. If the disbursement date falls on a weekend or public holiday, transfers are proactively processed on the preceding working day.',
      aAr: 'يتم صرف معاشات المتقاعدين العسكريين بصفة دورية منتظمة ما بين تاريخ ١٨ وتاريخ ٢٢ من كل شهر ميلادي، حيث تودع المبالغ مباشرة في الحسابات البنكية للمستفيدين عبر نظام المقاصة التابع للبنك المركزي العماني. وإذا صادف يوم الصرف إجازة رسمية أو نهاية أسبوع، يتم تقديم الصرف لليوم العمل السابق.',
      open: false
    },
    {
      id: 'faq-3',
      qEn: 'How can a retiree update their bank account details (IBAN)?',
      qAr: 'كيف يمكن للمتقاعد تعديل وتحديث رقم الحساب البنكي (IBAN) الخاص به؟',
      aEn: 'Retirees can log in securely to the authenticated Retiree Portal using their Civil ID and SMS OTP. Under the "Bank Account" tab, input the new 24-character IBAN, upload the official bank confirmation letter, and confirm via a secondary security OTP. Updates made before the 15th of the month will be applied to that month\'s payout.',
      aAr: 'يمكن للمتقاعد تحديث بياناته البنكية بسهولة من خلال تسجيل الدخول الآمن بالرقم المدني لبوابة المتقاعدين، والتوجه لتبويب "بيانات الحساب البنكي" لإدخال رقم الآيبان الجديد المكون من ٢٤ حرفاً، وإرفاق رسالة تأكيد الحساب الصادرة من البنك، ومن ثم تأكيد الطلب برمز التحقق (OTP) المستلم هاتفياً لتفعيل الطلب.',
      open: false
    },
    {
      id: 'faq-4',
      qEn: 'What is the timeline for processing Funeral Expense Claims filed by visitors?',
      qAr: 'ما هي المدة والخطوات اللازمة لصرف مستحقات نفقات الجنازة والعزاء؟',
      aEn: 'Once a legal heir submits a claim through our multi-step Visitor Claims Wizard with required attachments (death certificate, heir decree, bank card, applicant Civil ID copy), the MSSPF verification team reviews it within 48 working hours. Approved claims disburse a fixed welfare benefit (500 OMR) directly to the applicant\'s IBAN.',
      aAr: 'عند قيام مقدم الطلب بإرسال ملف التعويضات الجنائزية ومصاريف الجنازة عبر معالج طلبات الزوار وإرفاق المستندات المطلوبة (شهادة الوفاة، إعلام حصر الإرث، بطاقة الحساب البنكي)، تقوم لجنة التدقيق بفحص الطلب والموافقة عليه خلال يومين عمل (٤٨ ساعة عمل)، ومن ثم إيداع المنحة البالغة ٥٠٠ ريال عماني بحساب المستفيد.',
      open: false
    },
    {
      id: 'faq-5',
      qEn: 'Are pension certificates digitally signed and verifiable?',
      qAr: 'هل الشهادات التقاعدية المستخرجة من البوابة تعتبر مستنداً رسمياً وموثقاً؟',
      aEn: 'Yes. All pension statement certificates generated under the Retiree Portal contain an official digital cryptographic signature and a unique QR verification code. Commercial banks, government departments, and ministries can instantly scan the QR code to verify the document\'s structural integrity and live salary details.',
      aAr: 'نعم، بكافة الأحوال. جميع الشهادات التقاعدية المستخرجة إلكترونياً من البوابة تكون مختومة رقمياً ومزودة برمز استجابة سريع (QR) مشفر وفريد. يمكن للبنوك والجهات الحكومية والوزارات مسح الرمز ضوئياً للتحقق الفوري المباشر من موثوقية المستند وقيمة المعاش الجاري دون الحاجة لأختام ورقية.',
      open: false
    }
  ]);

  toggleFaq(id: string): void {
    this.faqs.update(list => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, open: !item.open };
        }
        return item;
      });
    });
  }
}
