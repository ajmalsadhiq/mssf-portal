import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LanguageService } from './language.service';
import { AdminDataService } from './admin-data.service';

export interface LiveArticle {
  titleEn: string;
  titleAr: string;
  date: string;
  categoryEn: string;
  categoryAr: string;
  descEn: string;
  descAr: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly adminData = inject(AdminDataService);

  // Live Newsdata.io API Key provided by the user
  private readonly apiKey: string = 'pub_1ef36aa7455a4ae596ac0c06a54ea03e';

  /**
   * Fetches real-time headlines dynamically from Newsdata.io
   * Querying live articles related to Oman/GCC. Fully supports direct CORS localhost browser requests.
   */
  getLiveNews(): Observable<LiveArticle[]> {
    // 1. Get the admin published news articles
    const adminNews: LiveArticle[] = this.adminData.newsArticles().map(art => ({
      titleEn: art.titleEn,
      titleAr: art.titleAr,
      date: art.date,
      categoryEn: art.categoryEn,
      categoryAr: art.categoryAr,
      descEn: art.descEn,
      descAr: art.descAr
    }));

    if (!this.apiKey || this.apiKey === '' || this.apiKey.includes('YOUR_')) {
      return of([...adminNews, ...this.getFallbackNews()]);
    }

    // Dynamic search for articles about Oman to get highly localized, brand-aligned Omani headlines
    const url = `https://newsdata.io/api/1/latest?apikey=${this.apiKey}&q=Oman`;

    return this.http.get<any>(url).pipe(
      map(response => {
        // Newsdata.io uses 'status': 'success' and lists articles under 'results'
        if (!response || response.status !== 'success' || !response.results || response.results.length === 0) {
          return [...adminNews, ...this.getFallbackNews()];
        }

        // Take top 3 valid Omani/GCC headlines
        const apiNews = response.results.slice(0, 3).map((art: any) => {
          let cleanDesc = art.description 
            ? art.description.replace(/<[^>]*>/g, '').trim() 
            : '';
          if (cleanDesc.length > 140) {
            cleanDesc = cleanDesc.substring(0, 140) + '...';
          }

          const isAr = this.languageService.language() === 'ar';

          return {
            titleEn: art.title || 'Live Omani Update',
            titleAr: isAr ? art.title || 'تغطية إخبارية مباشرة' : art.title,
            date: new Date(art.pubDate || new Date()).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            categoryEn: art.source_id ? art.source_id.toUpperCase() : 'Newsdata.io',
            categoryAr: 'مباشر',
            descEn: cleanDesc || 'Click to view full live news publication coverage.',
            descAr: isAr ? cleanDesc : 'اضغط لمتابعة تفاصيل نشرة الأخبار الكاملة من المصدر.'
          };
        });

        return [...adminNews, ...apiNews];
      }),
      catchError(() => {
        // Safe robust return in case of offline states or exceeding API requests quota limits
        return of([...adminNews, ...this.getFallbackNews()]);
      })
    );
  }

  /**
   * Verified, beautiful local announcements for fallback and testing
   */
  public getFallbackNews(): LiveArticle[] {
    return [];
  }
}
