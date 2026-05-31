import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DataTableComponent, TableColumn } from '../../../shared/table/table.component';
import { CalendarSlotPickerComponent } from '../../../shared/slot-picker/slot-picker.component';
import { AdminDataService } from '../../../core/services/admin-data.service';

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  officer: string;
  status: 'Approved & Processed' | 'Pending Review' | 'Rejected / Returned';
}

@Component({
  selector: 'app-retiree-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent, DataTableComponent, CalendarSlotPickerComponent],
  template: `
    <div class="flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('serv.appointments') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-4 animate-fade-in-up">
        <h2 class="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
          {{ lang.t('serv.appointments') }}
        </h2>
        <p class="text-[11px] text-stone-400 font-semibold leading-relaxed">
          Book and manage your official consultation schedules with military pension advisers.
        </p>
      </div>

      <!-- Main Action Tabs (History vs Book New) -->
      <div class="flex gap-3 border-b border-stone-200 pb-3 animate-fade-in-up">
        <button 
          (click)="activeView.set('list')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [ngClass]="activeView() === 'list' ? 'bg-primary text-accent shadow-sm' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'"
        >
          {{ lang.t('apt.list') }}
        </button>
        <button 
          (click)="activeView.set('book')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [ngClass]="activeView() === 'book' ? 'bg-primary text-accent shadow-sm' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'"
        >
          {{ lang.t('apt.book') }}
        </button>
      </div>

      <!-- Tab View 1: Active List -->
      @if (activeView() === 'list') {
        <div class="flex flex-col gap-4 animate-fade-in-up">
          <app-data-table
            [columns]="columns"
            [data]="appointments()"
            [showSearch]="false"
            [pageSize]="5"
          ></app-data-table>
        </div>
      } @else {
        <!-- Tab View 2: Book New Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          <!-- Channel & Department Setup Parameters -->
          <div class="lg:col-span-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-5">
            <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 border-l-2 border-accent pl-2" [ngClass]="lang.isRtl() ? 'border-r-2 border-l-0 pr-2 pl-0' : 'border-l-2 pl-2'">
              Appointment Setup
            </h4>

            <!-- Channel Selector in-person vs phone -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {{ lang.t('apt.type') }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  (click)="meetingChannel.set('in-person')"
                  class="py-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer"
                  [ngClass]="meetingChannel() === 'in-person' ? 'bg-primary text-accent border-accent' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
                >
                  {{ lang.t('apt.type.inPerson') }}
                </button>
                <button 
                  (click)="meetingChannel.set('phone')"
                  class="py-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer"
                  [ngClass]="meetingChannel() === 'phone' ? 'bg-primary text-accent border-accent' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
                >
                  {{ lang.t('apt.type.phone') }}
                </button>
              </div>
            </div>

            <!-- Pension Adviser Department -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Adviser Department</label>
              <select 
                [(ngModel)]="selectedDept"
                class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs outline-none bg-white font-medium focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="pension_calc">Pension Computations & Allowances</option>
                <option value="iban_welfare">IBAN Updates & ROP Verifications</option>
                <option value="claims_bereavement">Funeral Grants & Heir Claims</option>
                <option value="sovereign_investments">Loyalty Program Partner Inquiries</option>
              </select>
            </div>
          </div>

          <!-- Visual Slot Picker Widget -->
          <div class="lg:col-span-2">
            <app-calendar-slot-picker 
              (slotSelected)="onSlotSelected($event)"
            ></app-calendar-slot-picker>

            <!-- Book Confirm CTA Button -->
            @if (chosenSlot()) {
              <div class="mt-6 flex justify-end gap-3 animate-fade-in-up">
                <button 
                  (click)="chosenSlot.set(null)"
                  class="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
                <button 
                  (click)="confirmBooking()"
                  class="px-6 py-2 rounded-xl bg-accent hover:bg-accent-light text-primary text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  Confirm Booking ({{ chosenSlot()?.date }} @ {{ chosenSlot()?.time }})
                </button>
              </div>
            }
          </div>

        </div>
      }

    </div>
  `
})
export class AppointmentsComponent {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);
  readonly adminData = inject(AdminDataService);

  readonly activeView = signal<'list' | 'book'>('list');
  readonly meetingChannel = signal<'in-person' | 'phone'>('in-person');
  readonly chosenSlot = signal<{ date: string; time: string } | null>(null);

  selectedDept = 'pension_calc';

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'Appointment ID', sortable: true },
    { key: 'type', label: 'Meeting Channel', sortable: true },
    { key: 'date', label: 'Scheduled Date', sortable: true },
    { key: 'time', label: 'Time Slot', sortable: true },
    { key: 'officer', label: 'Assigned Adviser', sortable: true },
    { key: 'status', label: 'Approval Status', sortable: true, type: 'badge' }
  ];

  readonly appointments = computed(() => {
    return this.adminData.appointments()
      .filter(a => a.officerId === '08412952') // Filtered by Salim Al-Abri
      .map(a => ({
        id: `MSSPF/APT/${a.id.replace('apt-', '')}`,
        type: a.channel === 'In-Person' ? 'In-Person (HQ Office)' : 'Phone Consultation',
        date: a.date,
        time: a.timeSlot,
        officer: 'Officer Khalid Al-Masroori',
        status: a.status === 'Pending' 
          ? 'Pending Review' as const 
          : (a.status === 'Approved' ? 'Approved & Processed' as const : 'Rejected / Returned' as const)
      }));
  });

  onSlotSelected(slot: { date: string; time: string }): void {
    this.chosenSlot.set(slot);
  }

  confirmBooking(): void {
    const slot = this.chosenSlot();
    if (!slot) return;

    // Push new appointment to central AdminDataService shared signal
    this.adminData.addAppointment({
      officerId: '08412952',
      officerName: 'Salim Al-Abri',
      date: slot.date,
      timeSlot: slot.time,
      channel: this.meetingChannel() === 'in-person' ? 'In-Person' : 'Phone'
    });

    this.notification.success(this.lang.t('apt.success'));
    
    // Reset values
    this.chosenSlot.set(null);
    this.activeView.set('list'); // Return to list view
  }
}
