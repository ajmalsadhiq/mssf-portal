import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly language = signal<'en' | 'ar'>('en');
  readonly isRtl = computed(() => this.language() === 'ar');

  private readonly dictionary: Record<string, { en: string; ar: string }> = {
    // Portals & Branding
    'app.title': { en: 'MSSPF Portal', ar: 'بوابة صندوق تقاعد الأجهزة العسكرية والأمنية' },
    'app.desc': { en: 'Military and Security Services Pension Fund', ar: 'صندوق تقاعد الأجهزة العسكرية والأمنية - سلطنة عمان' },
    'portal.public': { en: 'Public Website', ar: 'الموقع العام' },
    'portal.retiree': { en: 'Retiree Portal', ar: 'بوابة المتقاعدين' },
    'portal.visitor': { en: 'Visitor Portal', ar: 'بوابة الزوار' },
    'portal.company': { en: 'Company Registration', ar: 'تسجيل الشركات' },
    'portal.bank': { en: 'Bank Portal', ar: 'بوابة البنوك' },
    'portal.ministry': { en: 'Ministry Portal', ar: 'بوابة وزارة العمل' },
    'portal.court': { en: 'Court Portal', ar: 'بوابة الادعاء والمحاكم' },

    // Core Actions / Common Buttons
    'nav.home': { en: 'Home', ar: 'الرئيسية' },
    'nav.about': { en: 'About', ar: 'عن الصندوق' },
    'nav.services': { en: 'Services', ar: 'الخدمات الإلكترونية' },
    'nav.news': { en: 'News', ar: 'الأخبار' },
    'nav.jobs': { en: 'Job Opportunities', ar: 'الفرص الوظيفية' },
    'nav.calculator': { en: 'Calculator', ar: 'حاسبة التقاعد' },
    'nav.contact': { en: 'Contact Us', ar: 'اتصل بنا' },
    'nav.faq': { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    'btn.login': { en: 'Retiree Login', ar: 'دخول المتقاعدين' },
    'btn.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
    'btn.submit': { en: 'Submit Request', ar: 'إرسال الطلب' },
    'btn.cancel': { en: 'Cancel', ar: 'إلغاء' },
    'btn.next': { en: 'Next Step', ar: 'الخطوة التالية' },
    'btn.prev': { en: 'Previous Step', ar: 'الخطوة السابقة' },
    'btn.download': { en: 'Download PDF', ar: 'تحميل PDF' },
    'btn.view': { en: 'View Details', ar: 'عرض التفاصيل' },
    'btn.apply': { en: 'Apply Now', ar: 'تقدم الآن' },

    // Language Swapper
    'lang.toggle': { en: 'العربية (AR)', ar: 'English (EN)' },
    'lang.current': { en: 'English', ar: 'العربية' },

    // Public Home Page Hero
    'hero.title': { en: 'Dignified Service, Secured Future', ar: 'خدمة شريفة.. لمستقبل آمن' },
    'hero.subtitle': { en: 'Serving the military and security forces retirees of the Sultanate of Oman with trust, efficiency, and respect.', ar: 'نعمل برؤية راسخة وقيم عالية لتوفير رعاية كريمة وخدمات متميزة لحماة الوطن البواسل وعائلاتهم.' },
    'hero.cta': { en: 'Access Retiree Services', ar: 'الخدمات الإلكترونية للمتقاعدين' },
    'hero.stats.retirees': { en: 'Active Retirees', ar: 'متقاعد نشط' },
    'hero.stats.pensions': { en: 'Monthly Pensions Paid', ar: 'رواتب تقاعدية مدفوعة شهرياً' },
    'hero.stats.satisfaction': { en: 'Satisfaction Rate', ar: 'نسبة رضا المستفيدين' },

    // Pension Calculator Form
    'calc.salary': { en: 'Last Basic Salary (OMR)', ar: 'آخر راتب أساسي (ريال عماني)' },
    'calc.years': { en: 'Years of Service', ar: 'سنوات الخدمة' },
    'calc.rank': { en: 'Military Rank / Category', ar: 'الرتبة العسكرية / الفئة' },
    'calc.retDate': { en: 'Proposed Retirement Date', ar: 'تاريخ التقاعد المقترح' },
    'calc.estimate': { en: 'Estimated Monthly Pension', ar: 'الراتب التقاعدي التقديري' },
    'calc.disclaimer': { en: 'Note: This calculator is for estimation purposes only. Actual pension amounts are finalized upon formal retirement filing.', ar: 'ملاحظة: هذه الحاسبة مخصصة للأغراض التقديرية فقط. المبالغ النهائية تعتمد على ملف التقاعد الرسمي الصادر.' },

    // Retiree Auth / Login
    'auth.civilId': { en: 'Civil ID Number', ar: 'الرقم المدني' },
    'auth.requestOtp': { en: 'Send verification code (OTP)', ar: 'طلب رمز التحقق (OTP)' },
    'auth.otpPlaceholder': { en: 'Enter 6-digit OTP', ar: 'أدخل رمز التحقق المكون من 6 أرقام' },
    'auth.verify': { en: 'Verify & Access', ar: 'التحقق والدخول' },
    'auth.otpSent': { en: 'Verification OTP has been sent to your registered mobile number.', ar: 'تم إرسال رمز التحقق إلى رقم هاتفك المسجل.' },
    'auth.resendOtp': { en: 'Resend code', ar: 'إعادة إرسال الرمز' },
    'auth.visitorLink': { en: 'Continue as Visitor', ar: 'المتابعة كزائر' },
    'auth.facePlaceholder': { en: 'Face Recognition Verification (Secure Pass)', ar: 'التحقق البصري لبصمة الوجه (المرور الآمن)' },
    'auth.faceDesc': { en: 'Use front camera to authenticate instantly without OTP.', ar: 'استخدم الكاميرا الأمامية للمصادقة الفورية دون الحاجة لرمز تحقق.' },

    // Retiree Dashboard
    'dash.welcome': { en: 'Welcome back,', ar: 'مرحباً بك،' },
    'dash.rank': { en: 'Rank:', ar: 'الرتبة:' },
    'dash.lastPaid': { en: 'Last Pension Paid:', ar: 'آخر راتب مصروف:' },
    'dash.loyaltyTitle': { en: 'Military Loyalty Program', ar: 'برنامج الولاء العسكري (مزايا)' },
    'dash.loyaltyDesc': { en: 'Exclusive discounts at partner merchants, hotels, and retail outlets across Oman.', ar: 'خصومات حصرية في المتاجر، الفنادق، ومراكز التسوق الشريكة في سلطنة عمان.' },
    'dash.quick': { en: 'Quick Services', ar: 'خدمات سريعة' },
    'dash.recent': { en: 'Recent Requests', ar: 'الطلبات الأخيرة' },

    // Service Modules - Retiree
    'serv.appointments': { en: 'Appointment Booking', ar: 'حجز المواعيد' },
    'serv.certificates': { en: 'Pension Certificates', ar: 'الشهادات التقاعدية' },
    'serv.bank': { en: 'Bank Account IBAN', ar: 'الحساب البنكي (IBAN)' },
    'serv.profile': { en: 'Personal Information', ar: 'البيانات الشخصية' },
    'serv.chat': { en: 'Fund Officers Live Chat', ar: 'المحادثة الفورية مع موظفي الصندوق' },

    // Appointments
    'apt.book': { en: 'Book New Appointment', ar: 'حجز موعد جديد' },
    'apt.list': { en: 'Your Appointments', ar: 'مواعيدك المحجوزة' },
    'apt.type': { en: 'Appointment Channel', ar: 'قناة المقابلة' },
    'apt.type.inPerson': { en: 'In-Person (HQ Office)', ar: 'حضوري (المقر الرئيسي)' },
    'apt.type.phone': { en: 'Phone Consultation', ar: 'استشارة هاتفية' },
    'apt.slot': { en: 'Select Available Date & Slot', ar: 'اختر التاريخ والوقت المتاح' },
    'apt.success': { en: 'Appointment booked successfully. A confirmation SMS has been sent.', ar: 'تم حجز الموعد بنجاح. تم إرسال رسالة تأكيد نصية.' },

    // IBAN module
    'iban.current': { en: 'Current Registered IBAN', ar: 'الحساب البنكي المسجل حالياً' },
    'iban.update': { en: 'Update Bank Account Details', ar: 'تحديث بيانات الحساب البنكي' },
    'iban.new': { en: 'New IBAN Number', ar: 'رقم الآيبان (IBAN) الجديد' },
    'iban.bankName': { en: 'Bank Name', ar: 'اسم البنك' },
    'iban.warning': { en: 'Important: Changing IBAN after the 15th of the month will take effect in the following month.', ar: 'تنبيه مهم: تعديل الحساب بعد تاريخ 15 من الشهر سيتم تطبيقه في راتب الشهر التالي.' },

    // Profile update
    'profile.readonly': { en: 'Official records verified via Royal Oman Police integration (Read-Only).', ar: 'البيانات الرسمية موثقة من واقع سجلات الأحوال المدنية ببلدية عمان (قراءة فقط).' },
    'profile.phone': { en: 'Registered Mobile Number', ar: 'رقم الهاتف المسجل' },
    'profile.address': { en: 'Permanent Home Address', ar: 'العنوان السكني الدائم' },

    // Funeral Claim
    'funeral.wizard': { en: 'Funeral Expense Claim Wizard', ar: 'معالج طلب مستحقات مصاريف الجنازة' },
    'funeral.step1': { en: 'Deceased Details', ar: 'بيانات المتوفى' },
    'funeral.step2': { en: 'Applicant Details', ar: 'بيانات مقدم الطلب' },
    'funeral.step3': { en: 'Bank Information', ar: 'البيانات البنكية' },
    'funeral.step4': { en: 'Document Uploads', ar: 'رفع المستندات الرسمية' },
    'funeral.step5': { en: 'Review & Submit', ar: 'المراجعة والإرسال' },
    'funeral.saved': { en: 'Draft saved locally automatically.', ar: 'تم حفظ مسودة الطلب تلقائياً.' },

    // Legal Portals Common
    'legal.tracking': { en: 'Transaction Tracking Ledger', ar: 'سجل تتبع المعاملات' },
    'legal.deduction': { en: 'Submit Active Deduction Request', ar: 'تقديم طلب اقتطاع نشط' },
    'legal.stop': { en: 'Submit Stop Deduction Directive', ar: 'تقديم طلب إيقاف اقتطاع' },

    // Status
    'status.pending': { en: 'Pending Review', ar: 'قيد المراجعة' },
    'status.approved': { en: 'Approved & Processed', ar: 'تمت الموافقة والصرف' },
    'status.rejected': { en: 'Rejected / Returned', ar: 'مرفوض / مسترجع' }
  };

  constructor() {
    // Side effect to update the DOM direction and language attributes
    effect(() => {
      const currentLang = this.language();
      const isRtlVal = this.isRtl();

      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRtlVal ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
      }
    });
  }

  toggleLanguage(): void {
    this.language.update(lang => lang === 'en' ? 'ar' : 'en');
  }

  t(key: string): string {
    const translation = this.dictionary[key];
    if (!translation) return key;
    return this.language() === 'en' ? translation.en : translation.ar;
  }
}
