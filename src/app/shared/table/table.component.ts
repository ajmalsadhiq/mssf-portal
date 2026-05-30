import { Component, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'date' | 'currency' | 'action';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="w-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      <!-- Search & Controls Header -->
      @if (showSearch()) {
        <div class="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between gap-4">
          <div class="relative flex-1 max-w-sm">
            <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400" [ngClass]="lang.isRtl() ? 'right-3 left-auto' : 'left-3'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input 
              type="text" 
              [placeholder]="lang.isRtl() ? 'بحث سريع...' : 'Search records...'" 
              [value]="searchTerm()"
              (input)="onSearchInput($event)"
              class="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl bg-white text-xs font-medium focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              [ngClass]="lang.isRtl() ? 'pr-9 pl-4' : 'pl-9 pr-4'"
            />
          </div>
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Total: {{ filteredData().length }} Rows
          </span>
        </div>
      }

      <!-- Responsive Table Viewport -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" [dir]="lang.isRtl() ? 'rtl' : 'ltr'" [ngClass]="lang.isRtl() ? 'text-right' : 'text-left'">
          <thead class="bg-primary/95 text-white font-display text-[11px] uppercase tracking-wider">
            <tr>
              @for (col of columns(); track col.key) {
                <th 
                  (click)="toggleSort(col)"
                  class="px-6 py-4 font-bold border-b border-accent/20 transition-colors select-none"
                  [ngClass]="{
                    'cursor-pointer hover:bg-primary-light/50': col.sortable,
                    'text-right': lang.isRtl(),
                    'text-left': !lang.isRtl()
                  }"
                >
                  <div class="flex items-center gap-1">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <svg 
                        class="w-3 h-3 text-accent transition-transform" 
                        [ngClass]="{
                          'opacity-40': sortColumn() !== col.key,
                          'rotate-180': sortColumn() === col.key && sortDirection() === 'desc'
                        }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          
          <tbody class="divide-y divide-stone-100 text-xs font-semibold text-stone-700">
            @for (row of paginatedData(); track $index) {
              <tr class="hover:bg-luxury-cream/50 transition-colors">
                @for (col of columns(); track col.key) {
                  <td class="px-6 py-4 whitespace-nowrap leading-relaxed">
                    @if (col.type === 'badge') {
                      <app-status-badge [status]="row[col.key]"></app-status-badge>
                    } @else if (col.type === 'currency') {
                      <span class="text-primary font-bold">{{ row[col.key] | number:'1.3-3' }} OMR</span>
                    } @else {
                      {{ row[col.key] }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Gorgeous Luxury Empty State Illustrated -->
      @if (filteredData().length === 0) {
        <div class="flex flex-col items-center justify-center p-12 text-center bg-stone-50/50">
          <div class="w-16 h-16 text-stone-300 mb-4 animate-pulse-gold">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h4 class="text-sm font-bold text-stone-700 leading-tight mb-1">
            {{ lang.isRtl() ? 'لم يتم العثور على أي سجلات' : 'No records found' }}
          </h4>
          <p class="text-[11px] text-stone-400 font-semibold max-w-xs">
            {{ lang.isRtl() ? 'يرجى تغيير معايير البحث أو تجربة تصفية قيم مغايرة.' : 'Try adjusting your search criteria or checking alternative tabs.' }}
          </p>
        </div>
      }

      <!-- Pagination Footer Controls -->
      @if (filteredData().length > pageSize()) {
        <div class="px-6 py-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Page {{ currentPage() }} of {{ maxPage() }}
          </span>
          <div class="flex items-center gap-2">
            <button 
              (click)="prevPage()"
              [disabled]="currentPage() === 1"
              class="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-[10px] font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              {{ lang.isRtl() ? 'السابق' : 'Previous' }}
            </button>
            <button 
              (click)="nextPage()"
              [disabled]="currentPage() === maxPage()"
              class="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-[10px] font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              {{ lang.isRtl() ? 'التالي' : 'Next' }}
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class DataTableComponent {
  readonly lang = inject(LanguageService);

  readonly columns = input.required<TableColumn[]>();
  readonly data = input.required<any[]>();
  readonly showSearch = input<boolean>(true);
  readonly pageSize = input<number>(5);

  readonly searchTerm = signal<string>('');
  readonly sortColumn = signal<string>('');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal<number>(1);

  // Computed data streams
  readonly filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const rows = this.data();
    
    if (!term) return rows;

    return rows.filter(row => {
      return Object.keys(row).some(key => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(term);
      });
    });
  });

  readonly sortedData = computed(() => {
    const rows = [...this.filteredData()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (!col) return rows;

    return rows.sort((a, b) => {
      let aVal = a[col];
      let bVal = b[col];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  readonly paginatedData = computed(() => {
    const rows = this.sortedData();
    const size = this.pageSize();
    const start = (this.currentPage() - 1) * size;
    return rows.slice(start, start + size);
  });

  readonly maxPage = computed(() => {
    return Math.ceil(this.filteredData().length / this.pageSize()) || 1;
  });

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1); // Reset to page 1
  }

  toggleSort(col: TableColumn): void {
    if (!col.sortable) return;

    if (this.sortColumn() === col.key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(col.key);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.maxPage()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
