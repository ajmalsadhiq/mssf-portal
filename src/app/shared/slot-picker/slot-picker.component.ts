import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface DaySchedule {
  dateString: string; // e.g., '2026-06-01'
  displayDayEn: string; // e.g., 'Mon'
  displayDayAr: string;
  displayDate: string; // e.g., 'Jun 1'
  slots: TimeSlot[];
}

@Component({
  selector: 'app-calendar-slot-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Select Date Heading -->
      <div>
        <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
          {{ lang.t('apt.slot') }}
        </h4>
        
        <!-- Next Days Horizontal Slide Carousel -->
        <div class="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
          @for (day of calendarDays(); track day.dateString) {
            <button 
              (click)="selectDay(day)"
              class="flex flex-col items-center justify-center min-w-[70px] p-3 rounded-xl border transition-all cursor-pointer shadow-sm"
              [ngClass]="{
                'bg-accent text-primary border-accent scale-105 font-bold': selectedDay()?.dateString === day.dateString,
                'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100': selectedDay()?.dateString !== day.dateString
              }"
            >
              <span class="text-[10px] uppercase font-bold tracking-wider mb-1">
                {{ lang.isRtl() ? day.displayDayAr : day.displayDayEn }}
              </span>
              <span class="text-sm font-display font-black leading-none">
                {{ day.displayDate }}
              </span>
            </button>
          }
        </div>
      </div>

      <!-- Select Time Grid -->
      @if (selectedDay()) {
        <div class="animate-fade-in-up">
          <h5 class="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">
            {{ lang.isRtl() ? 'الأوقات المتاحة للمقابلة:' : 'Available Time Slots:' }}
          </h5>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            @for (slot of selectedDay()?.slots; track slot.time) {
              <button 
                [disabled]="!slot.isAvailable"
                (click)="selectSlot(slot.time)"
                class="px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center"
                [ngClass]="{
                  'bg-primary text-accent border-accent font-extrabold shadow-md': selectedTime() === slot.time,
                  'bg-white border-stone-200 text-stone-700 hover:border-accent hover:bg-stone-50 cursor-pointer': selectedTime() !== slot.time && slot.isAvailable,
                  'bg-stone-100 border-stone-100 text-stone-300 cursor-not-allowed opacity-50': !slot.isAvailable
                }"
              >
                {{ slot.time }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class CalendarSlotPickerComponent {
  readonly lang = inject(LanguageService);

  readonly slotSelected = output<{ date: string; time: string }>();

  readonly calendarDays = signal<DaySchedule[]>([]);
  readonly selectedDay = signal<DaySchedule | null>(null);
  readonly selectedTime = signal<string>('');

  constructor() {
    this.generateCalendarDays();
  }

  private generateCalendarDays(): void {
    const schedules: DaySchedule[] = [];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentDate = new Date();
    // Exclude weekends (Friday and Saturday in Oman)
    let addedCount = 0;
    while (addedCount < 7) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      
      if (dayOfWeek !== 5 && dayOfWeek !== 6) { // 5 = Fri, 6 = Sat
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Mock slots for each day
        const slots: TimeSlot[] = [
          { time: '08:30 AM', isAvailable: Math.random() > 0.3 },
          { time: '09:30 AM', isAvailable: Math.random() > 0.2 },
          { time: '10:30 AM', isAvailable: Math.random() > 0.4 },
          { time: '11:30 AM', isAvailable: Math.random() > 0.1 },
          { time: '12:30 PM', isAvailable: Math.random() > 0.3 },
          { time: '01:30 PM', isAvailable: Math.random() > 0.5 }
        ];

        schedules.push({
          dateString,
          displayDayEn: daysEn[dayOfWeek],
          displayDayAr: daysAr[dayOfWeek],
          displayDate: `${monthsEn[currentDate.getMonth()]} ${currentDate.getDate()}`,
          slots
        });
        
        addedCount++;
      }
    }

    this.calendarDays.set(schedules);
    this.selectedDay.set(schedules[0]); // Select first day by default
  }

  selectDay(day: DaySchedule): void {
    this.selectedDay.set(day);
    this.selectedTime.set(''); // Reset time
  }

  selectSlot(time: string): void {
    this.selectedTime.set(time);
    const day = this.selectedDay();
    if (day) {
      this.slotSelected.emit({
        date: day.dateString,
        time: time
      });
    }
  }
}
