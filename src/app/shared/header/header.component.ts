import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-accent/30 bg-primary/95 text-white luxury-glass-dark backdrop-blur-md shadow-lg">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-18 sm:h-20 items-center justify-between gap-4">
          <!-- Logo & Brand Title -->
          <div class="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-shrink-0" routerLink="/">
            <img src="/logo.png" alt="MSSPF Shield Logo" class="h-10 sm:h-12 w-auto object-contain filter drop-shadow" />
            <div class="flex flex-col">
              <span class="font-smart text-xs sm:text-sm font-extrabold tracking-wide text-accent leading-tight">
                {{ lang.t('app.title') }}
              </span>
              <span class="text-[9px] text-stone-300 md:text-[10px] leading-tight font-medium max-w-[140px] sm:max-w-xs md:max-w-sm truncate">
                {{ lang.t('app.desc') }}
              </span>
            </div>
          </div>

          <!-- Main Desktop Nav (Hidden on mobile/tablet) -->
          <nav class="hidden lg:flex items-center gap-4 xl:gap-5.5 text-xs xl:text-sm font-semibold tracking-wide">
            <a routerLink="/" routerLinkActive="text-accent border-b-2 border-accent" [routerLinkActiveOptions]="{exact: true}" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.home') }}</a>
            <a routerLink="/about" routerLinkActive="text-accent border-b-2 border-accent" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.about') }}</a>
            <a routerLink="/services" routerLinkActive="text-accent border-b-2 border-accent" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.services') }}</a>
            <a routerLink="/news" routerLinkActive="text-accent border-b-2 border-accent" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.news') }}</a>
            <a routerLink="/calculator" routerLinkActive="text-accent border-b-2 border-accent" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.calculator') }}</a>
            <a routerLink="/faq" routerLinkActive="text-accent border-b-2 border-accent" class="hover:text-accent-light py-2 transition-all duration-200">{{ lang.t('nav.faq') }}</a>
          </nav>

          <!-- System Utilities / Actions -->
          <div class="hidden lg:flex items-center gap-3.5 flex-shrink-0">
            <!-- Portal Gateway Selector Dropdown -->
            <div class="relative">
              <button 
                (click)="portalMenuOpen.update(v => !v)"
                class="flex items-center gap-2 rounded-lg border border-accent/40 bg-primary-light/90 px-3.5 py-2 text-xs font-bold text-accent hover:bg-primary-light hover:border-accent transition-all duration-200 shadow-sm cursor-pointer"
              >
                <span>Portal Gateways</span>
                <svg class="h-3.5 w-3.5 transform transition-transform duration-200" [ngClass]="{'rotate-180': portalMenuOpen()}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              @if (portalMenuOpen()) {
                <div class="absolute right-0 mt-2.5 w-64 rounded-xl border border-accent/20 bg-primary/98 shadow-2xl luxury-glass-dark py-2.5 text-stone-200 z-50 text-xs text-left" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
                  <div class="px-4 py-1.5 border-b border-accent/10 text-stone-400 font-extrabold uppercase tracking-wider text-[10px]">Select System Portal</div>
                  <a (click)="closePortalMenu()" routerLink="/" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-accent mr-2 ml-2"></span>
                    {{ lang.t('portal.public') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/retiree" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.retiree') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/visitor" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.visitor') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/company" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.company') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/bank" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.bank') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/ministry" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.ministry') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/court" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-600 mr-2 ml-2"></span>
                    {{ lang.t('portal.court') }}
                  </a>
                  <a (click)="closePortalMenu()" routerLink="/admin" class="flex items-center px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold border-t border-accent/10 bg-primary-light/35">
                    <span class="w-2.5 h-2.5 rounded-full bg-accent mr-2 ml-2"></span>
                    {{ lang.t('portal.admin') }}
                  </a>
                </div>
              }
            </div>

            <!-- Language Switcher Button -->
            <button 
              (click)="lang.toggleLanguage()"
              class="flex items-center gap-2 rounded-lg border border-accent/20 bg-primary-light/50 px-3.5 py-2 text-xs text-stone-200 hover:bg-primary-light/80 hover:border-accent/40 transition-all duration-200 font-bold cursor-pointer"
            >
              <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m0 0l-3-3m3 3l-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ lang.t('lang.toggle') }}</span>
            </button>

            <!-- Authentication Controls -->
            @if (auth.isAuthenticated()) {
              <!-- Authed Profile Summary -->
              <div class="relative">
                <button 
                  (click)="profileMenuOpen.update(v => !v)"
                  class="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 hover:bg-emerald-950/80 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <div class="w-7 h-7 rounded-full bg-accent text-primary flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    {{ auth.currentUser()?.fullNameEn?.substring(0, 2) }}
                  </div>
                  <span class="text-xs text-emerald-200 font-bold max-w-[120px] truncate">
                    {{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}
                  </span>
                </button>

                @if (profileMenuOpen()) {
                  <div class="absolute right-0 mt-2.5 w-52 rounded-xl border border-accent/20 bg-primary/98 shadow-2xl luxury-glass-dark py-2.5 text-stone-200 z-50 text-xs text-left" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
                    <a (click)="closeProfileMenu()" routerLink="/retiree" class="block px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">Retiree Dashboard</a>
                    <a (click)="closeProfileMenu()" routerLink="/retiree/profile" class="block px-4 py-2.5 hover:bg-accent/10 hover:text-accent transition-colors font-semibold">My Profile</a>
                    <button (click)="logout()" class="w-full text-left px-4 py-2.5 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors font-semibold border-t border-accent/10 cursor-pointer">
                      {{ lang.t('btn.logout') }}
                    </button>
                  </div>
                }
              </div>
            } @else {
              <!-- Login CTA Link -->
              <a 
                routerLink="/retiree/login"
                class="rounded-lg bg-accent px-4 py-2 text-xs font-black text-primary hover:bg-accent-light hover:shadow-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
              >
                {{ lang.t('btn.login') }}
              </a>
            }
          </div>

          <!-- Mobile Hamburger Toggle (Visible on Mobile/Tablet) -->
          <div class="flex items-center gap-2 lg:hidden">
            <!-- Language switcher for quick mobile access -->
            <button 
              (click)="lang.toggleLanguage()"
              class="flex items-center justify-center p-2 rounded-lg bg-primary-light/50 border border-accent/15 text-accent hover:bg-primary-light transition-colors"
              title="Toggle Language"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m0 0l-3-3m3 3l-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>

            <!-- Main burger toggle -->
            <button 
              (click)="mobileMenuOpen.set(true)"
              class="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-primary-light/75 text-accent hover:bg-primary-light hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer Overlay & Content -->
      @if (mobileMenuOpen()) {
        <div class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <!-- Backdrop backdrop shadow -->
          <div (click)="mobileMenuOpen.set(false)" class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"></div>

          <!-- Drawer panel -->
          <div class="relative w-full max-w-xs bg-primary text-white border-l border-accent/20 p-6 flex flex-col justify-between shadow-2xl animate-fade-in-up duration-200 z-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
            <!-- Close icon and header -->
            <div>
              <div class="flex items-center justify-between border-b border-accent/15 pb-4 mb-5">
                <img src="/logo.png" alt="MSSPF Logo" class="h-10 w-auto object-contain" />
                <button 
                  (click)="mobileMenuOpen.set(false)"
                  class="rounded-lg p-1.5 border border-accent/20 bg-stone-900/10 text-stone-400 hover:text-white hover:bg-stone-900/20 transition-all cursor-pointer"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Main Navigation Links in Drawer -->
              <nav class="flex flex-col gap-4 text-sm font-semibold tracking-wide">
                <a (click)="mobileMenuOpen.set(false)" routerLink="/" routerLinkActive="text-accent bg-accent/5 pl-2" [routerLinkActiveOptions]="{exact: true}" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.home') }}</a>
                <a (click)="mobileMenuOpen.set(false)" routerLink="/about" routerLinkActive="text-accent bg-accent/5 pl-2" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.about') }}</a>
                <a (click)="mobileMenuOpen.set(false)" routerLink="/services" routerLinkActive="text-accent bg-accent/5 pl-2" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.services') }}</a>
                <a (click)="mobileMenuOpen.set(false)" routerLink="/news" routerLinkActive="text-accent bg-accent/5 pl-2" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.news') }}</a>
                <a (click)="mobileMenuOpen.set(false)" routerLink="/calculator" routerLinkActive="text-accent bg-accent/5 pl-2" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.calculator') }}</a>
                <a (click)="mobileMenuOpen.set(false)" routerLink="/faq" routerLinkActive="text-accent bg-accent/5 pl-2" class="hover:text-accent py-2 border-b border-accent/5 transition-all">{{ lang.t('nav.faq') }}</a>
              </nav>

              <!-- Portal Gateways in Drawer -->
              <div class="mt-8">
                <span class="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block mb-3 border-b border-accent/10 pb-1">System Portal Gateways</span>
                <div class="flex flex-col gap-1 text-xs">
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-accent mr-2 ml-2"></span>
                    {{ lang.t('portal.public') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/retiree" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.retiree') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/visitor" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-sky-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.visitor') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/company" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-amber-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.company') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/bank" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-indigo-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.bank') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/ministry" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-rose-500 mr-2 ml-2"></span>
                    {{ lang.t('portal.ministry') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/court" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold">
                    <span class="w-2 h-2 rounded-full bg-red-600 mr-2 ml-2"></span>
                    {{ lang.t('portal.court') }}
                  </a>
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/admin" class="flex items-center py-2 px-3 hover:bg-accent/10 rounded-lg hover:text-accent transition-colors font-semibold border-t border-accent/10 bg-primary-light/35">
                    <span class="w-2 h-2 rounded-full bg-accent mr-2 ml-2"></span>
                    {{ lang.t('portal.admin') }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Footer area of mobile drawer -->
            <div class="mt-8 border-t border-accent/15 pt-4">
              @if (auth.isAuthenticated()) {
                <div class="flex items-center gap-3 mb-4 p-2.5 bg-primary-light/40 border border-emerald-500/10 rounded-xl">
                  <div class="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    {{ auth.currentUser()?.fullNameEn?.substring(0, 2) }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs text-stone-200 font-bold truncate">
                      {{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}
                    </span>
                    <span class="text-[10px] text-emerald-400 font-bold">Retiree Connected</span>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <a (click)="mobileMenuOpen.set(false)" routerLink="/retiree" class="w-full py-2.5 bg-primary-light hover:bg-primary-light/80 text-white rounded-lg text-center font-bold text-xs shadow-sm transition-all">
                    Dashboard
                  </a>
                  <button (click)="logout(); mobileMenuOpen.set(false)" class="w-full py-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 rounded-lg text-center font-bold text-xs border border-rose-500/20 transition-all cursor-pointer">
                    {{ lang.t('btn.logout') }}
                  </button>
                </div>
              } @else {
                <a 
                  (click)="mobileMenuOpen.set(false)"
                  routerLink="/retiree/login"
                  class="block w-full py-3 bg-accent text-primary rounded-xl text-center font-black text-xs shadow-lg transition-all"
                >
                  {{ lang.t('btn.login') }}
                </a>
              }
            </div>
          </div>
        </div>
      }
    </header>
  `
})
export class AppHeaderComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly portalMenuOpen = signal<boolean>(false);
  readonly profileMenuOpen = signal<boolean>(false);
  readonly mobileMenuOpen = signal<boolean>(false);

  closePortalMenu(): void {
    this.portalMenuOpen.set(false);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  logout(): void {
    this.closeProfileMenu();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

