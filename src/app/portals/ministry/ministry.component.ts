import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';

interface InquiryResult {
  name: string;
  rank: string;
  civilId: string;
  pensionAmount: number;
  status: string;
}

@Component({
  selector: 'app-ministry-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, AppHeaderComponent, AppFooterComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>

      <main class="flex-grow p-6 md:p-8 bg-stone-50">
        <div class="mx-auto max-w-xl">
          
          <!-- Breadcrumb Navigation -->
          <app-breadcrumb [items]="[{ label: lang.t('portal.ministry') }]"></app-breadcrumb>

          <!-- Banner Header -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
              {{ lang.t('portal.ministry') }}
            </h2>
            <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
              Bilateral governmental lookup portal to verify active military retiree statuses.
            </p>
          </div>

          <!-- Card Content Body -->
          <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 animate-fade-in-up flex flex-col gap-6">
            
            <!-- Form View -->
            <div>
              <h3 class="font-display text-sm font-bold text-primary mb-1">Retiree Pension Inquiry</h3>
              <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Civil ID Verification Search</p>
            </div>

            <form [formGroup]="searchForm" (ngSubmit)="search()" class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Retiree Civil ID</label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    formControlName="civilId" 
                    class="flex-grow px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-mono font-bold text-center tracking-widest outline-none focus:ring-1 focus:ring-accent"
                    placeholder="08412952"
                    maxLength="8"
                  />
                  <button 
                    type="submit" 
                    [disabled]="searchForm.invalid"
                    class="px-5 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    Query Records
                  </button>
                </div>
                @if (searchForm.get('civilId')?.touched && searchForm.get('civilId')?.invalid) {
                  <span class="text-[9px] text-rose-500 font-bold uppercase mt-0.5">Please provide a valid 8-digit Civil ID number.</span>
                }
              </div>
            </form>

            <!-- Verification Results Display -->
            @if (hasSearched()) {
              <div class="animate-fade-in-up pt-6 border-t border-stone-100 flex flex-col gap-4">
                
                @if (result()) {
                  <!-- Success Verification Card -->
                  <div class="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 flex flex-col gap-3">
                    <div class="flex items-center gap-2 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Verified Record Found</span>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-semibold leading-none">
                      <div class="flex flex-col pb-1.5 border-b border-stone-200/40">
                        <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mb-1">Retiree Name</span>
                        <span class="text-stone-800 font-bold">{{ result()?.name }}</span>
                      </div>
                      <div class="flex flex-col pb-1.5 border-b border-stone-200/40">
                        <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mb-1">Military Rank</span>
                        <span class="text-stone-800 font-bold">{{ result()?.rank }}</span>
                      </div>
                      <div class="flex flex-col pb-1.5 border-b border-stone-200/40">
                        <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mb-1">Civil ID Number</span>
                        <span class="text-stone-800 font-mono">{{ result()?.civilId }}</span>
                      </div>
                      <div class="flex flex-col pb-1.5 border-b border-stone-200/40">
                        <span class="text-[8px] text-stone-400 font-bold uppercase tracking-wider mb-1">Monthly Pension</span>
                        <span class="text-emerald-700 font-bold font-mono">{{ result()?.pensionAmount | number:'1.3-3' }} OMR</span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <!-- Not Found Card -->
                  <div class="p-5 rounded-xl border border-rose-500/20 bg-rose-50/50 flex flex-col items-center justify-center text-center gap-3">
                    <div class="w-10 h-10 text-rose-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    </div>
                    <div class="space-y-1">
                      <h4 class="text-xs font-bold text-rose-950">Retiree Record Not Found</h4>
                      <p class="text-[10px] text-rose-800 font-semibold max-w-xs leading-relaxed">
                        No active military pension classifications match this Civil ID in the MSSPF database. Please verify inputs.
                      </p>
                    </div>
                  </div>
                }

              </div>
            }

          </div>

        </div>
      </main>

      <app-footer></app-footer>
      <app-toast></app-toast>
    </div>
  `
})
export class MinistryComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly searchForm: FormGroup;
  readonly hasSearched = signal<boolean>(false);
  readonly result = signal<InquiryResult | null>(null);

  constructor() {
    this.searchForm = this.fb.group({
      civilId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });
  }

  search(): void {
    if (this.searchForm.invalid) return;

    this.hasSearched.set(true);
    const { civilId } = this.searchForm.value;

    // Mock search logic: matches only if 08412952 (our retiree) or mock success otherwise
    if (civilId === '08412952') {
      this.result.set({
        name: 'Major General Salem Al-Harthy',
        rank: 'Major General (لواء)',
        civilId: '08412952',
        pensionAmount: 1845.500,
        status: 'Active'
      });
      this.notification.success('Retiree pension record retrieved successfully.');
    } else {
      this.result.set(null);
      this.notification.warning('Civil ID query returned no active military pension details.');
    }
  }
}

// Router routing config export inline
export const ministryRoutes = [
  { path: '', component: MinistryComponent }
];
