import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

interface Article {
  id: string;
  titleEn: string;
  titleAr: string;
  date: string;
  category: 'news' | 'publication';
  descEn: string;
  descAr: string;
  imageWord: string;
  downloadable?: boolean;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.news') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'المركز الإعلامي والإصدارات الدورية' : 'MSSPF Media Center & Publications' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Stay informed with official Royal military pension announcements, administrative updates, and annual performance publications.
        </p>
      </div>

      <!-- Controls: Category Filter Tabs & Search Bar -->
      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        <!-- Filter Tabs -->
        <div class="flex gap-2 w-full md:w-auto">
          <button 
            (click)="activeTab.set('all')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            [ngClass]="activeTab() === 'all' ? 'bg-primary text-accent shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'"
          >
            {{ lang.isRtl() ? 'الكل' : 'All' }}
          </button>
          <button 
            (click)="activeTab.set('news')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            [ngClass]="activeTab() === 'news' ? 'bg-primary text-accent shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'"
          >
            {{ lang.isRtl() ? 'الأخبار الصحفية' : 'News Articles' }}
          </button>
          <button 
            (click)="activeTab.set('publication')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            [ngClass]="activeTab() === 'publication' ? 'bg-primary text-accent shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'"
          >
            {{ lang.isRtl() ? 'الإصدارات والتقارير' : 'Publications & Reports' }}
          </button>
        </div>

        <!-- Search Bar input -->
        <div class="relative w-full md:w-80">
          <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400" [ngClass]="lang.isRtl() ? 'right-3 left-auto' : 'left-3'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input 
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="lang.isRtl() ? 'بحث في المركز الإعلامي...' : 'Search articles...'"
            class="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            [ngClass]="lang.isRtl() ? 'pr-9 pl-4' : 'pl-9 pr-4'"
          />
        </div>

      </div>

      <!-- Feed Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        @for (art of filteredArticles(); track art.id) {
          <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between p-6 hover:shadow-md transition-shadow animate-fade-in-up">
            <div>
              <div class="flex justify-between items-center mb-3">
                <span 
                  class="px-2 py-0.5 rounded font-bold text-[9px] uppercase"
                  [ngClass]="art.category === 'news' ? 'bg-amber-55 bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ art.category === 'news' ? (lang.isRtl() ? 'خبر' : 'News') : (lang.isRtl() ? 'تقرير' : 'Report') }}
                </span>
                <span class="text-[9px] text-stone-400 font-bold">{{ art.date }}</span>
              </div>

              <!-- Vector Symbolic Thumbnail Container -->
              <div class="h-32 w-full bg-luxury-cream rounded-lg mb-4 flex items-center justify-center text-accent/40 font-display font-black text-xs border border-accent/10">
                {{ art.imageWord }}
              </div>

              <h3 class="text-xs font-bold text-primary mb-2 line-clamp-2">
                {{ lang.isRtl() ? art.titleAr : art.titleEn }}
              </h3>
              <p class="text-[10px] text-stone-500 font-semibold leading-relaxed line-clamp-3">
                {{ lang.isRtl() ? art.descAr : art.descEn }}
              </p>
            </div>

            <!-- Actions footer -->
            <div class="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              @if (art.downloadable) {
                <button 
                  (click)="downloadReport(art)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-light text-primary text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ lang.isRtl() ? 'تحميل التقرير' : 'Download PDF' }}</span>
                </button>
              } @else {
                <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Press Article</span>
              }

              <!-- Share action trigger -->
              <button 
                (click)="shareArticle(art)"
                class="text-stone-400 hover:text-stone-700 transition-colors p-1"
                title="Share article"
              >
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742l4.773-2.386a2.007 2.007 0 11.884 1.768l-4.77 2.384a2.007 2.007 0 11-.887-1.766z"></path>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>

    </div>
  `
})
export class NewsComponent {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);

  readonly searchQuery = signal<string>('');
  readonly activeTab = signal<'all' | 'news' | 'publication'>('all');

  readonly articles: Article[] = [
    {
      id: 'art-1',
      titleEn: 'MSSPF Board Reviews Strategic Financial Performance and Assets Growth',
      titleAr: 'مجلس إدارة الصندوق يستعرض الأداء المالي واستراتيجيات نمو الأصول الاستثمارية',
      date: 'May 28, 2026',
      category: 'news',
      descEn: 'The board of directors convened a strategic session at the Muscat headquarters to analyze investment portfolios and check efficiency metrics.',
      descAr: 'عقد مجلس إدارة صندوق تقاعد الأجهزة العسكرية والأمنية اجتماعاً في مقر الصندوق بمسقط لمراجعة تقارير الاستثمار ونسب نمو الأصول.',
      imageWord: 'FINANCE UPDATE'
    },
    {
      id: 'art-2',
      titleEn: 'Official Digitalization Drive: Integrated Portal Services Formally Deployed',
      titleAr: 'صندوق التقاعد يطلق الحزمة المتكاملة للخدمات الإلكترونية والبوابات الرقمية المطورة',
      date: 'May 24, 2026',
      category: 'news',
      descEn: 'In alignment with Oman Vision 2040, MSSPF announces the formal expansion of its multi-portal web environments supporting banks, retirees, and judicial branches.',
      descAr: 'تماشياً مع رؤية عمان 2040، يعلن الصندوق رسمياً عن بدء تشغيل بوابات الربط الرقمي المحدثة المخصصة للمتقاعدين والبنوك والجهات القضائية.',
      imageWord: 'DIGITAL TECH'
    },
    {
      id: 'art-3',
      titleEn: 'MSSPF Annual Financial Stewardship Performance Review Report 2025',
      titleAr: 'التقرير السنوي لإدارة الأصول والأداء المالي لصندوق التقاعد للعام ٢٠٢٥',
      date: 'May 10, 2026',
      category: 'publication',
      descEn: 'The official certified report outlining pension assets performance, fund valuation updates, and legal contribution aggregates for the fiscal year 2025.',
      descAr: 'التقرير السنوي الموثق والمفصل المستعرض لنسب عوائد الاستثمارات السيادية وحجم المعاشات والالتزامات للعام المالي المنصرم 2025.',
      imageWord: 'ANNUAL REPORT 2025',
      downloadable: true
    },
    {
      id: 'art-4',
      titleEn: 'Important Advisory Regarding Military Funeral Claims Process',
      titleAr: 'تنبيه إرشادي هام حول شروط وإجراءات صرف مستحقات الجنازة والتعازي الاستثنائية',
      date: 'May 18, 2026',
      category: 'news',
      descEn: 'Claimants filing for military funeral benefits are advised to submit legal death certificates and bank cards directly through our unauthenticated visitor claim wizard.',
      descAr: 'يسترعي الصندوق عناية المواطنين بضرورة إرفاق شهادات الوفاة وحصر الإرث مباشرة من خلال معالج صرف مستحقات مصاريف الجنازة كزائر.',
      imageWord: 'ADVISORY BOARD'
    },
    {
      id: 'art-5',
      titleEn: 'MSSPF Legal Frameworks & Retiree Welfare Rights Executive Guide',
      titleAr: 'الدليل الإرشادي الشامل للوائح القانونية وحقوق المتقاعدين العسكريين وأسرهم',
      date: 'Apr 25, 2026',
      category: 'publication',
      descEn: 'A comprehensive handbook listing pension eligibility rules, ranking factors, calculation multipliers, and legal deduction thresholds for Omani officers.',
      descAr: 'كتيب توعوي متكامل يستعرض أحكام قانون تقاعد الأجهزة العسكرية وعلاوات التقاعد الثابتة وشروط الاستحقاق للورثة والمتقاعدين.',
      imageWord: 'WELFARE RIGHTS HANDBOOK',
      downloadable: true
    }
  ];

  // Computed signal to filter articles locally
  readonly filteredArticles = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();
    let rows = this.articles;

    // Tab category filter
    if (tab !== 'all') {
      rows = rows.filter(r => r.category === tab);
    }

    // Search query query
    if (query) {
      rows = rows.filter(r => {
        return r.titleEn.toLowerCase().includes(query) || 
               r.titleAr.toLowerCase().includes(query) || 
               r.descEn.toLowerCase().includes(query) || 
               r.descAr.toLowerCase().includes(query);
      });
    }

    return rows;
  });

  downloadReport(art: Article): void {
    this.notification.success(
      this.lang.isRtl() 
        ? `بدء تحميل الملف: ${art.titleAr} كملف PDF رقمي.` 
        : `Downloading document: ${art.titleEn} as an official PDF.`
    );
  }

  shareArticle(art: Article): void {
    const title = this.lang.isRtl() ? art.titleAr : art.titleEn;
    
    // Copy a simulated shareable URL to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://msspf.gov.om/news/${art.id}`);
    }

    this.notification.info(
      this.lang.isRtl()
        ? `تم نسخ رابط المشاركة بنجاح: ${title}`
        : `Shareable article link copied to clipboard: ${title}`
    );
  }
}
