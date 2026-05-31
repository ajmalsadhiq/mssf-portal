import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NewsService } from '../../../core/services/news.service';
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
export class NewsComponent implements OnInit, OnDestroy {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);
  private readonly newsService = inject(NewsService);

  readonly searchQuery = signal<string>('');
  readonly activeTab = signal<'all' | 'news' | 'publication'>('all');

  readonly articles = signal<Article[]>([]);
  private newsSubscription?: Subscription;

  ngOnInit(): void {
    // 1. Pre-populate instantly with high-fidelity dynamic fallback news if any
    this.loadNewsData();

    // 2. Asynchronously fetch live Omani/GCC headlines from Newsdata.io on load
    this.newsService.getLiveNews().subscribe(liveNews => {
      this.updateNewsList(liveNews);
    });

    // 3. Auto-refresh the live news feed every 5 minutes dynamically
    this.newsSubscription = interval(300000).subscribe(() => {
      this.newsService.getLiveNews().subscribe(liveNews => {
        this.updateNewsList(liveNews);
      });
    });
  }

  loadNewsData(): void {
    const fallbackNewsMapped: Article[] = this.newsService.getFallbackNews().map((art, idx) => ({
      id: `live-art-${idx}`,
      titleEn: art.titleEn,
      titleAr: art.titleAr,
      date: art.date,
      category: 'news' as const,
      descEn: art.descEn,
      descAr: art.descAr,
      imageWord: art.categoryEn.toUpperCase()
    }));
    this.articles.set(fallbackNewsMapped);
  }

  updateNewsList(liveNews: any[]): void {
    if (liveNews && liveNews.length > 0) {
      const liveNewsMapped: Article[] = liveNews.map((art, idx) => ({
        id: `live-art-${idx}`,
        titleEn: art.titleEn,
        titleAr: art.titleAr,
        date: art.date,
        category: 'news' as const,
        descEn: art.descEn,
        descAr: art.descAr,
        imageWord: art.categoryEn.toUpperCase()
      }));
      this.articles.set(liveNewsMapped);
    }
  }

  ngOnDestroy(): void {
    // Clean up timer subscription to prevent memory leaks
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
  }

  // Computed signal to filter articles locally
  readonly filteredArticles = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();
    let rows = this.articles();

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
