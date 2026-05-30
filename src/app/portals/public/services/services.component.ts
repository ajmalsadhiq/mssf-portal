import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/card/card.component';

interface SystemService {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  route: string;
  icon: string;
  image: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, CardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.services') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'بوابة الخدمات الرقمية المشتركة' : 'Digital Services Landing Hub' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Navigate directly to the verified module representing your specific pension request or governmental/judicial operations.
        </p>
      </div>

      <!-- Services Cards Grid (ALL 9 CORE CARD WORKFLOWS WITH GRAPHIC HEADERS) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        @for (srv of services; track srv.route) {
          <app-card 
            [title]="lang.isRtl() ? srv.titleAr : srv.titleEn"
            [description]="lang.isRtl() ? srv.descAr : srv.descEn"
            [icon]="srv.icon"
            [image]="srv.image"
            [route]="srv.route"
            [ctaText]="lang.isRtl() ? 'بدء الخدمة' : 'Launch Service'"
          ></app-card>
        }
      </div>

    </div>
  `
})
export class ServicesComponent {
  readonly lang = inject(LanguageService);

  readonly services: SystemService[] = [
    {
      titleEn: 'Retiree Appointment Booking',
      titleAr: 'حجز المواعيد للمتقاعدين',
      descEn: 'Schedule physical HQ meetings or book safe phone consultations with dedicated military pension advisers.',
      descAr: 'حجز ومراجعة المواعيد الحضورية بمقر الصندوق الرئيسي أو حجز استشارة هاتفية آمنة مع مستشاري شؤون المتقاعدين.',
      route: '/retiree/appointments',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400'
    },
    {
      titleEn: 'Official Pension Certificates',
      titleAr: 'شهادات المتقاعدين الرقمية',
      descEn: 'Instantly generate and download certified digital PDF/A pension statement sheets bearing security QR verification.',
      descAr: 'عرض واستخراج فوري لشهادات تفاصيل المعاش والرواتب التقاعدية المصادقة بشهادة توقيع رقمي ورمز التحقق (QR).',
      route: '/retiree/certificates',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400'
    },
    {
      titleEn: 'Funeral Expense Claim Wizard',
      titleAr: 'معالج صرف مستحقات مصاريف الجنازة',
      descEn: 'Visitor-accessible multi-step claim form to file for deceased officer welfare benefits and upload legal copies.',
      descAr: 'معالج إلكتروني عام ومبسط يتيح لورثة المتقاعدين المتوفين تقديم طلبات مستحقات نفقات الجنازة وإرفاق المستندات.',
      route: '/visitor',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?q=80&w=400'
    },
    {
      titleEn: 'Suggestions & Inquiries Filing',
      titleAr: 'المقترحات والاستفسارات الفورية',
      descEn: 'File formal ideas, feedback, or administrative inquiries to the fund support officer and track resolving milestones.',
      descAr: 'تقديم المقترحات والشكاوى والاستفسارات مباشرة إلى خدمة العملاء بالصندوق وتتبع حالة وتفاصيل الرد عليها.',
      route: '/visitor',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400'
    },
    {
      titleEn: 'Interactive Pension Calculator',
      titleAr: 'حاسبة التقاعد العسكري التقديرية',
      descEn: 'Recalculate dynamic estimates based on years of service and military rank categories.',
      descAr: 'محاكاة استباقية دقيقة لحساب المعاش الأساسي المستحق بالاستناد لآخر راتب وسنوات الخدمة وفئة الرتبة العسكرية.',
      route: '/calculator',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 11h.01M12 7h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400'
    },
    {
      titleEn: 'Company Registration Hub',
      titleAr: 'تسجيل وتصنيف الشركات التجارية',
      descEn: 'Register company parameters, CR numbers, commercial scopes, and supplier classifications for formal tenders.',
      descAr: 'تسجيل وتوثيق بيانات الشركات والموردين وتصنيفاتها التجارية تمهيداً للدخول في المناقصات التابعة للصندوق.',
      route: '/company',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400'
    },
    {
      titleEn: 'Commercial Bank Deduction Portal',
      titleAr: 'بوابة الاقتطاعات البنكية والمصرفية',
      descEn: 'Authorized interfaces for commercial banks to record monthly loan deduction directives or stops.',
      descAr: 'بوابة متكاملة لممثلي البنوك التجارية والائتمانية لطلب استحقاقات الاقتطاع الشهري وتوقيفها وتدقيق الحسابات.',
      route: '/bank',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=400'
    },
    {
      titleEn: 'Court Execution Directives',
      titleAr: 'بوابة الادعاء العام والمحاكم القضائية',
      descEn: 'Judicial portal for courts to file official child support, alimony, or execution legal deduction rules.',
      descAr: 'خدمة مخصصة للقضاة وممثلي دوائر التنفيذ لتسجيل أوامر الاقتطاع الجنائية أو المدنية والتحقق من تطبيق لوائح التنفيذ.',
      route: '/court',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400'
    },
    {
      titleEn: 'Ministry of Labor Pension Inquiry',
      titleAr: 'بوابة استعلام وزارة العمل الحكومية',
      descEn: 'Bilateral system query to search and verify active retiree classifications and social security benefits.',
      descAr: 'خدمة استعلامية موحدة ومؤمنة لوزارة العمل تمكنهم من البحث الفوري عن الحالة التقاعدية للمسجلين بالرقم المدني.',
      route: '/ministry',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400'
    }
  ];
}
