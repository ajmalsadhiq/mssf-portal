import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-primary text-stone-300 border-t border-accent/20">
      <!-- High-end Gold Line Divider Accent -->
      <div class="h-1 bg-gradient-to-r from-secondary via-accent to-secondary"></div>

      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Column 1: Info and Brand -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center gap-2.5">
              <img src="/logo.png" alt="MSSPF Shield Logo" class="h-9 w-auto object-contain filter drop-shadow" />
              <span class="font-display font-bold text-accent text-sm leading-tight tracking-wide">
                {{ lang.t('app.title') }}
              </span>
            </div>
            <p class="text-[11px] text-stone-400 leading-relaxed font-medium">
              Dedicated to serving military and security personnel with luxury-grade efficiency, secured transparency, and respectful appreciation.
            </p>
          </div>

          <!-- Column 2: Public Quick Sitemap -->
          <div>
            <h5 class="text-xs font-bold text-accent uppercase tracking-wider mb-4 border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">
              Useful Links
            </h5>
            <ul class="space-y-2 text-xs font-medium">
              <li><a routerLink="/" class="hover:text-white transition-colors">Home</a></li>
              <li><a routerLink="/about" class="hover:text-white transition-colors">About MSSPF</a></li>
              <li><a routerLink="/services" class="hover:text-white transition-colors">Services Landing</a></li>
              <li><a routerLink="/calculator" class="hover:text-white transition-colors">Pension Calculator</a></li>
              <li><a routerLink="/faq" class="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <!-- Column 3: Portal Gateways -->
          <div>
            <h5 class="text-xs font-bold text-accent uppercase tracking-wider mb-4 border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">
              Portals Gateway
            </h5>
            <ul class="space-y-2 text-xs font-medium">
              <li><a routerLink="/retiree" class="hover:text-white transition-colors text-emerald-400">Retiree Dashboard</a></li>
              <li><a routerLink="/visitor" class="hover:text-white transition-colors text-sky-400">Visitor Claims</a></li>
              <li><a routerLink="/company" class="hover:text-white transition-colors text-amber-400">Company Registration</a></li>
              <li><a routerLink="/bank" class="hover:text-white transition-colors text-indigo-400">Partner Bank Portal</a></li>
              <li><a routerLink="/court" class="hover:text-white transition-colors text-red-400">Court Executions Portal</a></li>
            </ul>
          </div>

          <!-- Column 4: Hotline & Support -->
          <div class="space-y-4">
            <h5 class="text-xs font-bold text-accent uppercase tracking-wider mb-3 border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">
              MSSPF Contact Info
            </h5>
            <div class="flex flex-col gap-2.5 text-xs font-medium">
              <a href="tel:80077777" class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>Hotline: 800-77777 (Toll Free)</span>
              </a>
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Working Hours: 07:30 AM - 02:30 PM</span>
              </div>
              <a href="mailto:info&#64;msspf.gov.om" class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>Email: info&#64;msspf.gov.om</span>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-accent/15 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-400 font-semibold gap-3">
          <span>&copy; {{ currentYear }} Military and Security Services Pension Fund. All Rights Reserved.</span>
          <span>Sultanate of Oman - Muscat Governorate</span>
        </div>
      </div>
    </footer>
  `
})
export class AppFooterComponent {
  readonly lang = inject(LanguageService);
  readonly currentYear = new Date().getFullYear();
}
