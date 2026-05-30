import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader.component';
import { DataTableComponent, TableColumn } from '../../shared/table/table.component';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';

interface CourtExecutionLog {
  executionNo: string;
  department: string;
  respondentId: string;
  amount: number;
  type: 'Judicial Deduction' | 'Stop Directive';
  status: 'Approved & Processed' | 'Pending Review' | 'Rejected / Returned';
}

@Component({
  selector: 'app-court-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FileUploaderComponent, DataTableComponent, AppHeaderComponent, AppFooterComponent, NotificationToastComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>

      <main class="flex-grow p-6 md:p-8 bg-stone-50">
        <div class="mx-auto max-w-5xl">
          
          <!-- Breadcrumb Navigation -->
          <app-breadcrumb [items]="[{ label: lang.t('portal.court') }]"></app-breadcrumb>

          <!-- Banner Header -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
              {{ lang.t('portal.court') }}
            </h2>
            <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
              Secured judicial interface for Omani courts to file official child support, alimony, or execution legal deduction rules.
            </p>
          </div>

          <!-- Split Dashboard Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
            
            <!-- Left: Legal Forms Column (1 Column) -->
            <div class="lg:col-span-1 flex flex-col gap-6">
              
              <!-- Tab Switcher -->
              <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-3">
                <span class="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Judicial Mandates</span>
                
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

              <!-- Form 1: Court Deduction Request -->
              @if (activeForm() === 'deduct') {
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 animate-fade-in-up">
                  <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 border-l-2 border-accent pl-2">File Court Deduction</h4>
                  
                  <form [formGroup]="deductForm" (ngSubmit)="submitDeduction()" class="flex flex-col gap-3.5">
                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Execution Case Number</label>
                      <input type="text" formControlName="executionNo" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-accent" placeholder="MUS/EXEC/2026/109" />
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Court Department</label>
                      <select formControlName="courtDept" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white">
                        <option value="Muscat Court">Muscat Primary Execution Court</option>
                        <option value="Seeb Court">Al Seeb Primary Execution Court</option>
                        <option value="Salalah Court">Salalah Execution Court</option>
                      </select>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Respondent Civil ID</label>
                      <input type="text" formControlName="respondentId" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono text-center tracking-widest outline-none focus:ring-1 focus:ring-accent" placeholder="08412952" maxLength="8" />
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Monthly Alimony OMR</label>
                      <input type="number" formControlName="amount" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono" placeholder="300" />
                    </div>

                    <!-- Attachment Upload -->
                    <div class="flex flex-col gap-2">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Judicial Execution Decree copy</label>
                      <app-file-uploader
                        label="Court Decree PDF"
                        (fileSelected)="onDocSelected($event)"
                      ></app-file-uploader>
                    </div>

                    <button type="submit" [disabled]="deductForm.invalid || !docFile()" class="w-full mt-2 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer">
                      File Judicial Execution
                    </button>
                  </form>
                </div>
              } @else {
                <!-- Form 2: Court Stop Deduction Request -->
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 animate-fade-in-up">
                  <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 border-l-2 border-accent pl-2">Stop Court Deduction</h4>
                  
                  <form [formGroup]="stopForm" (ngSubmit)="submitStop()" class="flex flex-col gap-3.5">
                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Active Execution case</label>
                      <input type="text" formControlName="executionNo" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-accent" placeholder="MUS/EXEC/2026/109" />
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Stoppage Decree Date</label>
                      <input type="date" formControlName="stopDate" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs" />
                    </div>

                    <button type="submit" [disabled]="stopForm.invalid" class="w-full mt-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-40 cursor-pointer">
                      File Stop Directive
                    </button>
                  </form>
                </div>
              }

            </div>

            <!-- Right: Judicial Execution ledger logs (2 Columns) -->
            <div class="lg:col-span-2 flex flex-col gap-4">
              <h3 class="font-display text-xs font-bold text-stone-400 uppercase tracking-wider">
                Judicial Execution Ledgers History
              </h3>

              <app-data-table
                [columns]="columns"
                [data]="executionLogs()"
                [showSearch]="true"
                [pageSize]="5"
              ></app-data-table>
            </div>

          </div>

        </div>
      </main>

      <app-footer></app-footer>
      <app-toast></app-toast>
    </div>
  `
})
export class CourtComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly activeForm = signal<'deduct' | 'stop'>('deduct');
  readonly docFile = signal<File | null>(null);

  readonly deductForm: FormGroup;
  readonly stopForm: FormGroup;

  readonly columns: TableColumn[] = [
    { key: 'executionNo', label: 'Execution Case #', sortable: true },
    { key: 'department', label: 'Court Department', sortable: true },
    { key: 'respondentId', label: 'Respondent ID', sortable: true },
    { key: 'amount', label: 'Alimony Amount', sortable: true, type: 'currency' },
    { key: 'type', label: 'Directive Type', sortable: true },
    { key: 'status', label: 'Approval Status', sortable: true, type: 'badge' }
  ];

  readonly executionLogs = signal<CourtExecutionLog[]>([
    {
      executionNo: 'MUS/EXEC/2026/109',
      department: 'Muscat Primary Court',
      respondentId: '08412952',
      amount: 300.000,
      type: 'Judicial Deduction',
      status: 'Pending Review'
    },
    {
      executionNo: 'SEEB/EXEC/2024/859',
      department: 'Al Seeb Primary Court',
      respondentId: '04910582',
      amount: 150.000,
      type: 'Stop Directive',
      status: 'Approved & Processed'
    }
  ]);

  constructor() {
    this.deductForm = this.fb.group({
      executionNo: ['', Validators.required],
      courtDept: ['Muscat Court', Validators.required],
      respondentId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      amount: [200, [Validators.required, Validators.min(10)]]
    });

    this.stopForm = this.fb.group({
      executionNo: ['', Validators.required],
      stopDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  onDocSelected(file: File | null): void {
    this.docFile.set(file);
  }

  submitDeduction(): void {
    if (this.deductForm.invalid || !this.docFile()) return;

    const { executionNo, courtDept, respondentId, amount } = this.deductForm.value;

    const newLog: CourtExecutionLog = {
      executionNo,
      department: courtDept,
      respondentId,
      amount,
      type: 'Judicial Deduction',
      status: 'Pending Review'
    };

    this.executionLogs.update(logs => [newLog, ...logs]);
    this.notification.success(`Judicial deduction request filed successfully. Case: ${executionNo}`);
    this.deductForm.reset({ courtDept: 'Muscat Court' });
    this.docFile.set(null);
  }

  submitStop(): void {
    if (this.stopForm.invalid) return;

    const { executionNo } = this.stopForm.value;

    const newLog: CourtExecutionLog = {
      executionNo,
      department: 'Muscat Court',
      respondentId: '08412952',
      amount: 300.000,
      type: 'Stop Directive',
      status: 'Pending Review'
    };

    this.executionLogs.update(logs => [newLog, ...logs]);
    this.notification.success(`Stop judicial deduction directive filed successfully. Case: ${executionNo}`);
    this.stopForm.reset({ stopDate: new Date().toISOString().split('T')[0] });
  }
}

// Router routing config export inline
export const courtRoutes = [
  { path: '', component: CourtComponent }
];
