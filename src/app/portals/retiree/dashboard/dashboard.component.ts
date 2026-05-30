import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataTableComponent, TableColumn } from '../../../shared/table/table.component';

interface RequestItem {
  reference: string;
  service: string;
  date: string;
  status: 'Pending Review' | 'Approved & Processed' | 'Rejected / Returned';
}

@Component({
  selector: 'app-retiree-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
            {{ lang.t('dash.welcome') }} {{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}
          </h2>
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            {{ lang.isRtl() ? auth.currentUser()?.branchAr : auth.currentUser()?.branchEn }}
          </span>
        </div>

        <!-- System Clock / Verification stamp -->
        <div class="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-white border border-stone-200 p-3 self-start shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Last System Sync: Just Now</span>
        </div>
      </div>

      <!-- Core Identity Overview & Loyalty Widget Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Profile Summary Widget -->
        <div class="md:col-span-1 bg-white border border-stone-200 rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between animate-fade-in-up">
          <div class="absolute top-0 inset-x-0 h-1 bg-accent"></div>
          
          <div class="space-y-4">
            <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Official Profile Summary</span>
            
            <div class="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div class="w-11 h-11 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm shadow-sm select-none">
                {{ auth.currentUser()?.fullNameEn?.substring(0, 2) }}
              </div>
              <div class="flex flex-col truncate">
                <span class="text-xs font-bold text-primary truncate">{{ lang.isRtl() ? auth.currentUser()?.fullNameAr : auth.currentUser()?.fullNameEn }}</span>
                <span class="text-[9px] text-stone-400 font-bold uppercase">{{ lang.t('dash.rank') }} {{ lang.isRtl() ? auth.currentUser()?.rankAr : auth.currentUser()?.rankEn }}</span>
              </div>
            </div>

            <!-- Details list -->
            <div class="flex flex-col gap-2.5 text-xs font-semibold leading-none">
              <div class="flex justify-between border-b border-stone-50 pb-1.5">
                <span class="text-stone-400 uppercase tracking-wider text-[8px]">{{ lang.t('auth.civilId') }}</span>
                <span class="text-stone-700 font-mono">{{ auth.currentUser()?.civilId }}</span>
              </div>
              <div class="flex justify-between border-b border-stone-50 pb-1.5">
                <span class="text-stone-400 uppercase tracking-wider text-[8px]">{{ lang.t('dash.lastPaid') }}</span>
                <span class="text-emerald-700 font-bold">{{ auth.currentUser()?.lastPensionPaid | number:'1.3-3' }} OMR</span>
              </div>
            </div>
          </div>

          <a routerLink="profile" class="text-[10px] font-bold text-accent hover:text-accent-light uppercase tracking-wider mt-4 block">
            Update Address & Mobile &rarr;
          </a>
        </div>

        <!-- Loyalty Card Program Widget -->
        <div class="md:col-span-2 bg-gradient-to-br from-primary via-primary-light to-black text-white rounded-2xl border border-accent/25 shadow-md p-6 relative overflow-hidden flex flex-col justify-between animate-fade-in-up [animation-delay:100ms]">
          <!-- Luxury watermarked emblem inside loyalty card -->
          <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <svg class="w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"></path>
            </svg>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[9px] text-accent font-extrabold uppercase tracking-wider">
                {{ lang.t('dash.loyaltyTitle') }}
              </span>
              <!-- Tier Badge -->
              <span class="px-2.5 py-0.5 rounded-full bg-accent text-primary font-bold text-[9px] uppercase tracking-widest shadow-sm">
                {{ auth.currentUser()?.loyaltyTier }} Tier
              </span>
            </div>
            
            <h3 class="font-display text-sm font-black text-white leading-tight">
              Enjoy Exclusive Military Discounts
            </h3>
            
            <p class="text-stone-300 text-[10px] sm:text-xs leading-relaxed max-w-md font-medium">
              {{ lang.t('dash.loyaltyDesc') }}
            </p>
          </div>

          <!-- Points ledger -->
          <div class="flex items-end justify-between mt-6 pt-4 border-t border-accent/20">
            <div class="flex flex-col leading-none">
              <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mb-1">Available Loyalty Points</span>
              <span class="text-sm font-bold text-accent font-mono">{{ auth.currentUser()?.loyaltyPoints | number }} PTS</span>
            </div>
            
            <div class="text-[10px] text-stone-300 font-bold hover:text-accent transition-colors cursor-pointer uppercase tracking-wider">
              Browse Merchant Offers &rarr;
            </div>
          </div>
        </div>

      </div>

      <!-- Quick Services Grid -->
      <section class="mt-4 animate-fade-in-up [animation-delay:150ms]">
        <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          {{ lang.t('dash.quick') }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (serv of serviceCards; track serv.route) {
            <div 
              [routerLink]="serv.route"
              class="bg-white rounded-xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer select-none group"
            >
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-luxury-cream text-accent border border-accent/15 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all shadow-sm">
                <div class="w-4.5 h-4.5" [innerHTML]="serv.icon"></div>
              </div>
              <div class="flex flex-col truncate">
                <span class="text-xs font-bold text-primary leading-tight truncate">{{ lang.t(serv.labelKey) }}</span>
                <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">Click to Open</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Recent Requests DataTable Hook -->
      <section class="mt-4 animate-fade-in-up [animation-delay:200ms]">
        <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          {{ lang.t('dash.recent') }}
        </h3>

        <app-data-table
          [columns]="columns"
          [data]="recentRequests"
          [showSearch]="false"
          [pageSize]="5"
        ></app-data-table>
      </section>

    </div>
  `
})
export class DashboardComponent {
  readonly lang = inject(LanguageService);
  readonly auth = inject(AuthService);

  readonly serviceCards = [
    {
      route: 'appointments',
      labelKey: 'serv.appointments',
      icon: `<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
    },
    {
      route: 'bank',
      labelKey: 'serv.bank',
      icon: `<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`
    },
    {
      route: 'profile',
      labelKey: 'serv.profile',
      icon: `<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
    },
    {
      route: 'certificates',
      labelKey: 'serv.certificates',
      icon: `<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
    }
  ];

  readonly columns: TableColumn[] = [
    { key: 'reference', label: 'Reference ID', sortable: true },
    { key: 'service', label: 'Requested Service', sortable: true },
    { key: 'date', label: 'Submission Date', sortable: true },
    { key: 'status', label: 'Request Status', sortable: true, type: 'badge' }
  ];

  readonly recentRequests: RequestItem[] = [
    {
      reference: 'MSSPF/REQ/85910',
      service: 'IBAN Bank Update Request',
      date: '2026-05-27',
      status: 'Pending Review'
    },
    {
      reference: 'MSSPF/REQ/85124',
      service: 'Entitlement Certificate Issuance',
      date: '2026-05-24',
      status: 'Approved & Processed'
    },
    {
      reference: 'MSSPF/REQ/84992',
      service: 'General Pension Consultation Appointment',
      date: '2026-05-18',
      status: 'Approved & Processed'
    }
  ];
}
