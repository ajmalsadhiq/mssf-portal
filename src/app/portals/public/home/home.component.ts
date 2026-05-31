import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { NewsService } from '../../../core/services/news.service';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { CardComponent } from '../../../shared/card/card.component';
import { PensionCalculatorComponent } from '../../../shared/pension-calc/pension-calc.component';

interface QuickService {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  route: string;
  icon: string;
  image: string;
}

interface NewsCard {
  titleEn: string;
  titleAr: string;
  date: string;
  categoryEn: string;
  categoryAr: string;
  descEn: string;
  descAr: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, PensionCalculatorComponent],
  template: `
    <div class="flex flex-col w-full min-h-screen" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- System-wide Warning Alert Banner (Admin Controlled) -->
      @if (adminData.hotlineSettings().isAlertActive) {
        <div class="w-full bg-rose-600 text-white font-semibold text-xs px-4 py-3 flex items-center justify-center gap-2 border-b border-rose-700 animate-pulse relative z-30 select-none">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span class="text-center">{{ lang.isRtl() ? adminData.hotlineSettings().alertBannerAr : adminData.hotlineSettings().alertBannerEn }}</span>
        </div>
      }
      
      <!-- 1. Breathtaking Luxurious Hero Banner with Oman stock background image & brown hue overlay -->
      <section class="relative w-full py-24 sm:py-36 overflow-hidden text-white border-b border-accent/25 flex items-center justify-center bg-cover bg-center bg-no-repeat" style="background-image: url('/oman_bg.png');">
        <!-- Brownish military hue overlay to guarantee text legibility -->
        <div class="absolute inset-0 bg-primary/85 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-transparent"></div>
        
        <!-- Elegant subtle graphic overlay shapes -->
        <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6 z-10 animate-fade-in-up">

          <!-- Fixed Dual-Language Hero Headline -->
          <div class="flex flex-col items-center gap-3 max-w-4xl text-center">
            <h1 class="font-smart text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-wide">
              Military & Security Services Pension Fund
            </h1>
            <h2 class="font-arabic text-2xl sm:text-4xl lg:text-5xl font-bold leading-normal text-accent-light" [dir]="'rtl'">
              صندوق تقاعد الأجهزة العسكرية والأمنية
            </h2>
          </div>

          <!-- Hero Subtitle (Dynamic based on language selection) -->
          <p class="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl font-semibold mt-2">
            {{ lang.t('hero.subtitle') }}
          </p>

          <!-- Actions CTAs -->
          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <a 
              routerLink="/retiree"
              class="px-7 py-4 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-sm transition-all shadow-lg transform hover:-translate-y-0.5"
            >
              {{ lang.t('hero.cta') }}
            </a>
            <a 
              routerLink="/services"
              class="px-7 py-4 rounded-xl border border-accent/40 bg-white/5 hover:bg-white/10 text-stone-200 font-extrabold text-sm transition-all shadow-md"
            >
              {{ lang.t('nav.services') }}
            </a>
          </div>
        </div>
      </section>

      <!-- 1b. Premium Gold-Bordered Scrolling News Ticker (Pulsing live badge + hover-to-pause marquee) -->
      <div class="w-full bg-primary-light/95 border-b border-accent/25 py-2.5 overflow-hidden relative z-20 flex items-center h-10 select-none">
        <div class="absolute left-0 top-0 bottom-0 bg-accent text-primary px-3.5 flex items-center font-smart text-[10px] font-black uppercase tracking-wider z-30 shadow-md">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-1.5 ml-1.5 inline-block"></span>
          <span>{{ lang.isRtl() ? 'مباشر' : 'Live Ticker' }}</span>
        </div>
        <div class="marquee-container flex items-center gap-12 whitespace-nowrap pl-[110px] animate-marquee font-smart text-xs font-semibold text-stone-200">
          @for (item of latestNews(); track item.titleEn) {
            <span class="inline-flex items-center gap-2">
              <span class="text-accent">•</span>
              <span>{{ lang.isRtl() ? item.titleAr : item.titleEn }}</span>
            </span>
          }
          <!-- Repeated list to ensure seamless infinite looping -->
          @for (item of latestNews(); track item.titleEn + '-dup') {
            <span class="inline-flex items-center gap-2">
              <span class="text-accent">•</span>
              <span>{{ lang.isRtl() ? item.titleAr : item.titleEn }}</span>
            </span>
          }
        </div>
      </div>

      <!-- 2. Core System Features / Integration Pillars for Launch Readiness -->
      <section class="py-12 bg-white border-b border-stone-100 shadow-sm relative z-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-stone-100 last:border-0" [ngClass]="lang.isRtl() ? 'md:border-l md:border-r-0' : 'md:border-r md:border-l-0'">
              <div class="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                <!-- ROP Sync Lock Icon -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="font-body text-sm font-bold text-primary mb-1 uppercase tracking-wide">
                {{ lang.isRtl() ? 'ربط السجل المدني (شرطة عمان السلطانية)' : 'ROP Civil ID Sync' }}
              </h3>
              <p class="text-xs text-stone-500 font-medium leading-relaxed max-w-xs">
                {{ lang.isRtl() ? 'مصادقة ثنائية مباشرة مع شرطة عمان السلطانية للتحقق الفوري من هوية المتقاعدين وبياناتهم.' : 'Bilateral authentication integrated directly with ROP for instant identity verification and profile sync.' }}
              </p>
            </div>

            <div class="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-stone-100 last:border-0" [ngClass]="lang.isRtl() ? 'md:border-l md:border-r-0' : 'md:border-r md:border-l-0'">
              <div class="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                <!-- Bank Clearing Icon -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-body text-sm font-bold text-primary mb-1 uppercase tracking-wide">
                {{ lang.isRtl() ? 'تسوية الاقتطاعات المصرفية للبنوك' : 'Bank Clearing Settlement' }}
              </h3>
              <p class="text-xs text-stone-500 font-medium leading-relaxed max-w-xs">
                {{ lang.isRtl() ? 'منظومة آلية بالكامل لتسوية طلبات اقتطاعات القروض متكاملة مع البنوك العمانية المرخصة.' : 'Direct settlement automated clearance pathways integrated with all licensed Omani commercial banks.' }}
              </p>
            </div>

            <div class="flex flex-col items-center text-center p-6">
              <div class="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                <!-- Scale of Justice / Gavel Icon -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
              </div>
              <h3 class="font-body text-sm font-bold text-primary mb-1 uppercase tracking-wide">
                {{ lang.isRtl() ? 'تكامل الأوامر القضائية (المحاكم)' : 'Judicial Compliance Link' }}
              </h3>
              <p class="text-xs text-stone-500 font-medium leading-relaxed max-w-xs">
                {{ lang.isRtl() ? 'منصة مخصصة لتتبع الاقتطاعات القضائية كالنفقة بالتنسيق الكامل مع السلطات القضائية.' : 'Specialized portal linkages to record active judicial execution orders and deduction clearances.' }}
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- 3. Quick Electronic Services Grid -->
      <section class="py-16 sm:py-24 bg-stone-50/50">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <h2 class="font-display text-3xl sm:text-4xl font-bold text-primary mb-3">
              {{ lang.isRtl() ? 'بوابات الخدمات الإلكترونية المتكاملة' : 'Integrated Electronic Portals' }}
            </h2>
            <p class="text-sm text-stone-500 font-semibold leading-relaxed">
              Access the specific operational gateway tailored to your profile classification.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (service of quickServices; track service.route) {
              <app-card 
                [title]="lang.isRtl() ? service.titleAr : service.titleEn"
                [description]="lang.isRtl() ? service.descAr : service.descEn"
                [icon]="service.icon"
                [image]="service.image"
                [route]="service.route"
                [ctaText]="lang.isRtl() ? 'الدخول للبوابة' : 'Access Portal'"
              ></app-card>
            }
          </div>
        </div>
      </section>

      <!-- 4. Pension Calculator Shortcut Section -->
      <section class="py-16 bg-white border-t border-b border-stone-100">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs text-accent font-extrabold uppercase tracking-wider">Quick Calculation Tool</span>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-primary mt-1">
              {{ lang.isRtl() ? 'حاسبة الراتب التقاعدي التقديرية' : 'Pension Entitlement Estimator' }}
            </h2>
          </div>
          <app-pension-calculator></app-pension-calculator>
        </div>
      </section>

      <!-- 5. Latest News Section -->
      <section class="py-16 sm:py-24 bg-stone-50/50">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-end mb-12 border-b border-stone-200/60 pb-4">
            <div>
              <h2 class="font-display text-2xl sm:text-3xl font-bold text-primary">
                {{ lang.isRtl() ? 'آخر الأخبار والإعلانات الرسمية' : 'Latest News & Official Announcements' }}
              </h2>
            </div>
            <a routerLink="/news" class="text-sm font-bold text-accent hover:text-accent-light flex items-center gap-1">
              <span>View All</span>
              <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (news of latestNews(); track news.titleEn) {
              <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between p-6 hover:shadow-md transition-shadow">
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <span class="px-2.5 py-1 rounded bg-accent/10 text-accent font-extrabold text-[11px] uppercase">
                      {{ lang.isRtl() ? news.categoryAr : news.categoryEn }}
                    </span>
                    <span class="text-xs text-stone-400 font-bold">{{ news.date }}</span>
                  </div>
                  <h3 class="text-sm font-bold text-primary mb-2 line-clamp-2">
                    {{ lang.isRtl() ? news.titleAr : news.titleEn }}
                  </h3>
                  <p class="text-xs text-stone-500 font-semibold leading-relaxed line-clamp-3">
                    {{ lang.isRtl() ? news.descAr : news.descEn }}
                  </p>
                </div>
                <a routerLink="/news" class="mt-4 text-xs font-bold text-accent hover:text-accent-light inline-flex items-center gap-1">
                  <span>Read Article</span>
                  <svg class="w-3.5 h-3.5 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 6. Contacts Hotline & Help Call-out -->
      <section class="py-16 bg-primary text-white border-t border-accent/25 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-light via-primary to-black opacity-95"></div>
        
        <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6 z-10">
          <h2 class="font-display text-xl sm:text-3xl font-black text-accent">
            {{ lang.isRtl() ? 'هل لديك أي استفسار أو اقتراح؟' : 'Need Assistance or Have an Inquiry?' }}
          </h2>
          <p class="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Our specialized Military Pension support desk is available to address queries, verify records, and guide legal claimant steps.
          </p>
          <div class="flex flex-wrap justify-center gap-4 mt-2">
            <a [href]="'tel:' + adminData.hotlineSettings().hotlineNo" class="px-5 py-3 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-xs transition-all shadow-md flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>Call Hotline ({{ formatHotline(adminData.hotlineSettings().hotlineNo) }})</span>
            </a>
            <a routerLink="/contact" class="px-5 py-3 rounded-xl border border-accent/40 bg-white/5 hover:bg-white/10 text-stone-200 font-extrabold text-xs transition-all shadow-sm">
              {{ lang.t('nav.contact') }}
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly newsService = inject(NewsService);
  readonly adminData = inject(AdminDataService);

  formatHotline(no: string): string {
    if (no.length === 8) {
      return no.substring(0, 3) + '-' + no.substring(3);
    }
    return no;
  }

  readonly quickServices: QuickService[] = [
    {
      titleEn: 'Retiree Authenticated Portal',
      titleAr: 'بوابة المتقاعدين الإلكترونية',
      descEn: 'Secure login via Civil ID and OTP authentication. Update IBAN accounts, request certificates, and book appointments.',
      descAr: 'بوابة المتقاعدين الرسمية والمحمية بالمصادقة برمز المرور. تتيح تحديث الحساب البنكي، استخراج الشهادات، حجز المواعيد.',
      route: '/retiree',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400'
    },
    {
      titleEn: 'Unauthenticated Visitor Portal',
      titleAr: 'بوابة الزوار والجمهور العام',
      descEn: 'File active inquiries or launch the step-by-step Funeral Expense Claims Wizard without credentials.',
      descAr: 'خدمات سريعة ومتاحة للجميع دون تسجيل دخول. تقديم المقترحات وإرسال معالج مستحقات مصاريف الجنازة خطوة بخطوة.',
      route: '/visitor',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400'
    },
    {
      titleEn: 'Company Registration Portal',
      titleAr: 'بوابة تسجيل وتوثيق الشركات',
      descEn: 'Submit registration dossiers for military contractors, service companies, and suppliers.',
      descAr: 'خدمة مخصصة لتمكين الشركات والمقاولين المتعاملين مع الأجهزة العسكرية والأمنية من التسجيل وتوثيق شهادات التصنيف التجارية.',
      route: '/company',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400'
    },
    {
      titleEn: 'Partner Bank Gateway',
      titleAr: 'بوابة البنوك التجارية والمصارف',
      descEn: 'Dedicated interface for Omani commercial banks to file retiree loan deduction directives.',
      descAr: 'بوابة آمنة للبنوك التجارية بالسلطنة لإدارة طلبات اقتطاع أقساط القروض التقاعدية وطلب إيقافها وتتبع نتائج المراجعة.',
      route: '/bank',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400'
    },
    {
      titleEn: 'Ministry of Labor Integration',
      titleAr: 'بوابة وزارة العمل (الاستعلام الحكومي)',
      descEn: 'Bilateral administrative gateway to query active retiree lists and verify pension benefit aggregates.',
      descAr: 'بوابة تكاملية مخصصة للجهات الحكومية والوزارات الشريكة للاستعلام عن استحقاقات المتقاعدين والتحقق الثنائي الفوري.',
      route: '/ministry',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400'
    },
    {
      titleEn: 'Court & Judicial Executions',
      titleAr: 'بوابة السلطات القضائية والمحاكم',
      descEn: 'Dedicated judicial interface to record active court execution numbers and deduction levels.',
      descAr: 'خدمة مخصصة لتمكين دوائر المحاكم القضائية بالسلطنة من رفع لوائح التنفيذ القانونية وتطبيق الاقتطاعات وتتبعها.',
      route: '/court',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400'
    }
  ];

  readonly latestNews = signal<NewsCard[]>([]);
  private newsSubscription?: Subscription;

  ngOnInit(): void {
    // 1. Pre-populate instantly with high-fidelity Omani fallback news so the page is never empty
    this.latestNews.set(this.newsService.getFallbackNews());

    // 2. Fetch live Omani/GCC headlines from Newsdata.io on load
    this.loadLiveNews();

    // 3. Auto-refresh the live news feed every 5 minutes dynamically
    this.newsSubscription = interval(300000).subscribe(() => {
      this.loadLiveNews();
    });
  }

  loadLiveNews(): void {
    this.newsService.getLiveNews().subscribe(news => {
      if (news && news.length > 0) {
        this.latestNews.set(news);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up timer subscription to prevent background memory leaks
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
  }
}
