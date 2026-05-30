import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { DataTableComponent, TableColumn } from '../../shared/table/table.component';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';

interface DeductionLog {
  ref: string;
  civilId: string;
  borrower: string;
  loanAmount: number;
  deductionAmount: number;
  type: 'Active Deduction' | 'Stop Directive';
  status: 'Approved & Processed' | 'Pending Review' | 'Rejected / Returned';
}

@Component({
  selector: 'app-bank-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, DataTableComponent, AppHeaderComponent, AppFooterComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>

      <main class="flex-grow p-6 md:p-8 bg-stone-50">
        <div class="mx-auto max-w-5xl">
          
          <!-- Breadcrumb Navigation -->
          <app-breadcrumb [items]="[{ label: lang.t('portal.bank') }]"></app-breadcrumb>

          <!-- Banner Header -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
              {{ lang.t('portal.bank') }}
            </h2>
            <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
              Authorized commercial bank interfaces to record loan deduction directives or stop requests.
            </p>
          </div>

          @if (!isLoggedIn()) {
            <!-- 1. Secured Bank Login Panel -->
            <div class="max-w-md mx-auto bg-white border border-accent/20 rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in-up">
              <div class="text-center mb-6">
                <h3 class="font-display text-base font-bold text-primary">Partner Bank Clearance Access</h3>
                <p class="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1">Sovereign Financial Gateway</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="login()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Representative Email</label>
                  <input type="email" formControlName="email" class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent" placeholder="e.g. rep@bankmuscat.om" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Secure Access Pin</label>
                  <input type="password" formControlName="pin" class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent font-mono text-center tracking-widest" placeholder="••••" maxLength="4" />
                </div>

                <button type="submit" [disabled]="loginForm.invalid" class="w-full mt-2 py-3 rounded-xl bg-accent text-primary hover:bg-accent-light font-extrabold text-xs transition-all shadow-md disabled:opacity-40 cursor-pointer">
                  Authenticate Bank Session
                </button>
              </form>
            </div>
          } @else {
            <!-- 2. Authenticated Dashboard with forms & grids -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
              
              <!-- Left Side Form Column (1 Column) -->
              <div class="lg:col-span-1 flex flex-col gap-6">
                
                <!-- Action Tab switch -->
                <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-3">
                  <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Filing Operations</span>
                  
                  <div class="flex flex-col gap-2">
                    <button 
                      (click)="activeForm.set('deduct')"
                      class="py-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer"
                      [ngClass]="activeForm() === 'deduct' ? 'bg-primary text-accent border-accent' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
                    >
                      Deduction Request
                    </button>
                    <button 
                      (click)="activeForm.set('stop')"
                      class="py-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer"
                      [ngClass]="activeForm() === 'stop' ? 'bg-primary text-accent border-accent' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
                    >
                      Stop Deduction Request
                    </button>
                  </div>
                </div>

                <!-- Form Panel 1: Apply Deduction -->
                @if (activeForm() === 'deduct') {
                  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 animate-fade-in-up">
                    <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 border-l-2 border-accent pl-2">Apply Loan Deduction</h4>
                    
                    <form [formGroup]="deductionForm" (ngSubmit)="submitDeduction()" class="flex flex-col gap-3.5">
                      <div class="flex flex-col gap-1">
                        <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Borrower Full Name</label>
                        <input type="text" formControlName="borrower" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent" placeholder="e.g. Salim Al-Harthy" />
                      </div>

                      <div class="flex flex-col gap-1">
                        <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Retiree Civil ID</label>
                        <input type="text" formControlName="civilId" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono font-bold text-center tracking-widest outline-none focus:ring-1 focus:ring-accent" placeholder="08412952" maxLength="8" />
                      </div>

                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Loan Principal</label>
                          <input type="number" formControlName="loanAmount" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono" placeholder="15000" />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Monthly Deduction</label>
                          <input type="number" formControlName="deductionAmount" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono" placeholder="250" />
                        </div>
                      </div>

                      <button type="submit" [disabled]="deductionForm.invalid" class="w-full mt-2 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-sm disabled:opacity-40 cursor-pointer">
                        File Deduction Directive
                      </button>
                    </form>
                  </div>
                } @else {
                  <!-- Form Panel 2: Stop Deduction -->
                  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 animate-fade-in-up">
                    <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 border-l-2 border-accent pl-2">Stop Loan Deduction</h4>
                    
                    <form [formGroup]="stopForm" (ngSubmit)="submitStop()" class="flex flex-col gap-3.5">
                      <div class="flex flex-col gap-1">
                        <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Loan Reference ID</label>
                        <input type="text" formControlName="loanRef" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-accent" placeholder="MSSPF/REQ/85910" />
                      </div>

                      <div class="flex flex-col gap-1">
                        <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Stoppage Date</label>
                        <input type="date" formControlName="stopDate" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none" />
                      </div>

                      <button type="submit" [disabled]="stopForm.invalid" class="w-full mt-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-40 cursor-pointer">
                        File Stop Directive
                      </button>
                    </form>
                  </div>
                }
              </div>

              <!-- Right Ledger History Table Column (2 Columns) -->
              <div class="lg:col-span-2 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Bank Clearance Tracking Ledger
                  </h3>
                  <button (click)="logout()" class="text-xs font-bold text-rose-500 hover:underline">Sign Out representative</button>
                </div>

                <app-data-table
                  [columns]="columns"
                  [data]="ledgerLogs()"
                  [showSearch]="true"
                  [pageSize]="5"
                ></app-data-table>
              </div>

            </div>
          }

        </div>
      </main>

      <app-footer></app-footer>
      <app-toast></app-toast>
    </div>
  `
})
export class BankComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly isLoggedIn = signal<boolean>(false);
  readonly activeForm = signal<'deduct' | 'stop'>('deduct');

  readonly loginForm: FormGroup;
  readonly deductionForm: FormGroup;
  readonly stopForm: FormGroup;

  readonly columns: TableColumn[] = [
    { key: 'ref', label: 'Directive Ref', sortable: true },
    { key: 'civilId', label: 'Civil ID', sortable: true },
    { key: 'borrower', label: 'Borrower Name', sortable: true },
    { key: 'deductionAmount', label: 'Monthly (OMR)', sortable: true, type: 'currency' },
    { key: 'type', label: 'Directive Type', sortable: true },
    { key: 'status', label: 'Ledger Status', sortable: true, type: 'badge' }
  ];

  readonly ledgerLogs = signal<DeductionLog[]>([
    {
      ref: 'MSSPF/REQ/85910',
      civilId: '08412952',
      borrower: 'Major General Salem Al-Harthy',
      loanAmount: 25000,
      deductionAmount: 250.000,
      type: 'Active Deduction',
      status: 'Pending Review'
    },
    {
      ref: 'MSSPF/REQ/81042',
      civilId: '05910482',
      borrower: 'Major Ahmed Al-Masroori',
      loanAmount: 18000,
      deductionAmount: 180.000,
      type: 'Stop Directive',
      status: 'Approved & Processed'
    }
  ]);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['rep@bankmuscat.om', [Validators.required, Validators.email]],
      pin: ['1234', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });

    this.deductionForm = this.fb.group({
      borrower: ['', Validators.required],
      civilId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      loanAmount: [10000, [Validators.required, Validators.min(1000)]],
      deductionAmount: [100, [Validators.required, Validators.min(10)]]
    });

    this.stopForm = this.fb.group({
      loanRef: ['', Validators.required],
      stopDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    this.isLoggedIn.set(true);
    this.notification.success('Bank representative session authenticated successfully.');
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.loginForm.reset({ email: 'rep@bankmuscat.om' });
  }

  submitDeduction(): void {
    if (this.deductionForm.invalid) return;

    const { borrower, civilId, loanAmount, deductionAmount } = this.deductionForm.value;
    const ref = `MSSPF/REQ/${Math.floor(10000 + Math.random() * 90000)}`;

    const newLog: DeductionLog = {
      ref,
      civilId,
      borrower,
      loanAmount,
      deductionAmount,
      type: 'Active Deduction',
      status: 'Pending Review'
    };

    this.ledgerLogs.update(logs => [newLog, ...logs]);
    this.notification.success(`Loan deduction request filed successfully. Ref: ${ref}`);
    this.deductionForm.reset({ loanAmount: 10000, deductionAmount: 100 });
  }

  submitStop(): void {
    if (this.stopForm.invalid) return;

    const { loanRef } = this.stopForm.value;
    const ref = `MSSPF/REQ/${Math.floor(10000 + Math.random() * 90000)}`;

    const newLog: DeductionLog = {
      ref,
      civilId: '08412952',
      borrower: 'Major General Salem Al-Harthy',
      loanAmount: 25000,
      deductionAmount: 250.000,
      type: 'Stop Directive',
      status: 'Pending Review'
    };

    this.ledgerLogs.update(logs => [newLog, ...logs]);
    this.notification.success(`Stop loan deduction directive filed successfully. Ref: ${ref}`);
    this.stopForm.reset({ stopDate: new Date().toISOString().split('T')[0] });
  }
}

// Router routing config export inline
export const bankRoutes = [
  { path: '', component: BankComponent }
];
