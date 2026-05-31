import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

interface SidebarItem {
  path: string;
  labelKey: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Hamburger Toggle Overlay -->
    <div class="lg:hidden fixed top-[84px] z-30 flex items-center p-2" [ngClass]="lang.isRtl() ? 'left-4' : 'right-4'">
      <button 
        (click)="isOpen.update(v => !v)"
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-accent shadow-lg border border-accent/20 transition-all hover:bg-primary-light"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          @if (isOpen()) {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          } @else {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          }
        </svg>
      </button>
    </div>

    <!-- Sidebar Element Wrapper -->
    <aside 
      class="fixed inset-y-0 top-20 z-20 flex flex-col border-accent/20 bg-primary text-stone-200 transition-all duration-300 shadow-xl overflow-y-auto"
      [ngClass]="{
        'w-64 lg:w-64': !isCollapsed(),
        'w-64 lg:w-20': isCollapsed(),
        'translate-x-0 lg:translate-x-0': isOpen(),
        'translate-x-full lg:translate-x-0': lang.isRtl() && !isOpen(),
        '-translate-x-full lg:translate-x-0': !lang.isRtl() && !isOpen(),
        'lg:relative': true,
        'right-0 border-l': lang.isRtl(),
        'left-0 border-r': !lang.isRtl()
      }"
    >
      <!-- Quick Officer Identity -->
      @if (!isCollapsed()) {
        <div class="p-6 border-b border-accent/15 flex flex-col items-center text-center animate-fade-in-up">
          <div class="h-16 w-16 rounded-full bg-accent-light text-primary border-2 border-accent/40 shadow-inner flex items-center justify-center font-bold text-lg mb-3">
            {{ auth.currentUser()?.fullNameEn?.substring(0, 2) }}
          </div>
          <h4 class="text-sm font-semibold text-accent leading-tight">
            {{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}
          </h4>
          <span class="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
            {{ lang.isRtl() ? auth.currentUser()?.rankAr : auth.currentUser()?.rankEn }}
          </span>
        </div>
      } @else {
        <div class="p-4 border-b border-accent/15 flex justify-center">
          <div class="h-10 w-10 rounded-full bg-accent-light text-primary flex items-center justify-center font-bold text-sm shadow-sm">
            {{ auth.currentUser()?.fullNameEn?.substring(0, 2) }}
          </div>
        </div>
      }

      <!-- Menu Items list -->
      <nav class="flex-1 px-3 py-4 flex flex-col gap-1.5">
        @for (item of items; track item.path) {
          <a 
            [routerLink]="item.path" 
            routerLinkActive="bg-accent text-primary font-bold shadow-md border-accent"
            [routerLinkActiveOptions]="{exact: item.path === '/retiree'}"
            class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-stone-300 hover:bg-primary-light/40 hover:text-white transition-all cursor-pointer border-l-4 border-transparent"
            [ngClass]="lang.isRtl() ? 'hover:border-r-accent hover:border-l-transparent' : 'hover:border-l-accent'"
            [title]="lang.t(item.labelKey)"
          >
            <!-- SVG Icon Renderer -->
            <div class="flex-shrink-0" [innerHTML]="item.icon"></div>
            
            @if (!isCollapsed()) {
              <span class="text-xs font-semibold leading-none truncate">{{ lang.t(item.labelKey) }}</span>
            }
          </a>
        }
      </nav>

      <!-- Desktop Collapse Toggle -->
      <div class="hidden lg:flex p-4 border-t border-accent/15 justify-end">
        <button 
          (click)="isCollapsed.update(v => !v)"
          class="p-2 rounded-lg bg-primary-light/30 border border-accent/15 text-accent hover:bg-primary-light/60 transition-all"
        >
          <svg class="h-4 w-4 transform transition-transform duration-300" [ngClass]="{'rotate-180': isCollapsed()}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>
    </aside>
  `
})
export class AppSidebarComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);

  readonly isOpen = signal<boolean>(false);
  readonly isCollapsed = signal<boolean>(false);

  readonly items: SidebarItem[] = [
    {
      path: '/retiree',
      labelKey: 'nav.home',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`
    },
    {
      path: '/retiree/appointments',
      labelKey: 'serv.appointments',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
    },
    {
      path: '/retiree/bank',
      labelKey: 'serv.bank',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`
    },
    {
      path: '/retiree/profile',
      labelKey: 'serv.profile',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
    },
    {
      path: '/retiree/certificates',
      labelKey: 'serv.certificates',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
    },
    {
      path: '/retiree/chat',
      labelKey: 'serv.chat',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`
    }
  ];
}
