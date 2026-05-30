import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

interface Leader {
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  rankEn: string;
  rankAr: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('nav.about') }]"></app-breadcrumb>

      <!-- Banner Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-primary mb-3">
          {{ lang.isRtl() ? 'صندوق تقاعد الأجهزة العسكرية والأمنية' : 'Military & Security Services Pension Fund' }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto mb-4 rounded-full"></div>
        <p class="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Established by Royal Decree, our mission is to ensure reliable social security welfare, assets stewardship, and noble care for protectors of the Sultanate of Oman.
        </p>
      </div>

      <!-- Core Vision / Mission Luxury Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 relative overflow-hidden group hover:border-accent/40 transition-colors duration-300">
          <div class="absolute top-0 inset-x-0 h-1 bg-accent/40"></div>
          <div class="flex items-center gap-3 mb-4">
            <div class="h-10 w-10 rounded-xl bg-luxury-cream text-accent flex items-center justify-center border border-accent/10">
              <!-- Vision Eye SVG -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="font-display text-base font-bold text-primary">
              {{ lang.isRtl() ? 'رؤيتنا الاستراتيجية' : 'Our Strategic Vision' }}
            </h3>
          </div>
          <p class="text-xs text-stone-500 font-semibold leading-relaxed">
            To remain a world-class premier pension administration and a model sovereign wealth fund, providing exceptional secure coverage and dignified financial confidence for military and national security forces.
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 relative overflow-hidden group hover:border-accent/40 transition-colors duration-300">
          <div class="absolute top-0 inset-x-0 h-1 bg-accent/40"></div>
          <div class="flex items-center gap-3 mb-4">
            <div class="h-10 w-10 rounded-xl bg-luxury-cream text-accent flex items-center justify-center border border-accent/10">
              <!-- Flag Mission SVG -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21v8h-6l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
              </svg>
            </div>
            <h3 class="font-display text-base font-bold text-primary">
              {{ lang.isRtl() ? 'رسالتنا النبيلة' : 'Our Noble Mission' }}
            </h3>
          </div>
          <p class="text-xs text-stone-500 font-semibold leading-relaxed">
            To efficiently manage contributions and disburse pension values under rigid regulatory models, leveraging digital tools and smart sovereign asset investments to sustain Omani soldier welfare.
          </p>
        </div>
      </div>

      <!-- Leadership Board Grid -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h3 class="font-display text-lg font-bold text-primary">
            {{ lang.isRtl() ? 'مجلس الإدارة والقيادة التنفيذية' : 'Board of Directors & Executive Leadership' }}
          </h3>
          <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">Stewardship of Military Heritage</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (leader of leaders; track leader.nameEn) {
            <div class="bg-white rounded-xl border border-stone-200 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
              <!-- Golden corner accent -->
              <div class="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-accent/10 transition-transform group-hover:scale-150"></div>
              
              <!-- Placeholder Badge Symbol -->
              <div class="w-16 h-16 rounded-full bg-primary text-accent border border-accent/25 flex items-center justify-center font-bold text-lg shadow-md mb-4 group-hover:scale-105 transition-transform select-none">
                {{ leader.nameEn.split(' ')[2]?.charAt(0) || leader.nameEn.split(' ')[1]?.charAt(0) }}
              </div>

              <h4 class="text-xs font-bold text-primary leading-tight">
                {{ lang.isRtl() ? leader.nameAr : leader.nameEn }}
              </h4>
              <span class="text-[9px] text-stone-400 font-bold uppercase mt-1 leading-none tracking-wide">
                {{ lang.isRtl() ? leader.rankAr : leader.rankEn }}
              </span>
              <p class="text-[10px] text-stone-500 font-semibold leading-tight mt-3 pt-3 border-t border-stone-100 w-full">
                {{ lang.isRtl() ? leader.roleAr : leader.roleEn }}
              </p>
            </div>
          }
        </div>
      </section>

    </div>
  `
})
export class AboutComponent {
  readonly lang = inject(LanguageService);

  readonly leaders: Leader[] = [
    {
      nameEn: 'Lieutenant General Shihab bin Tariq',
      nameAr: 'الفريق أول شهاب بن طارق آل سعيد',
      roleEn: 'Chairman of the Board of Directors',
      roleAr: 'رئيس مجلس إدارة الصندوق الموقر',
      rankEn: 'Lieutenant General',
      rankAr: 'فريق أول'
    },
    {
      nameEn: 'Major General Hamed Al-Nabhani',
      nameAr: 'اللواء ركن حامد بن أحمد النبهاني',
      roleEn: 'Vice Chairman of the Board',
      roleAr: 'نائب رئيس مجلس الإدارة',
      rankEn: 'Major General',
      rankAr: 'لواء ركن'
    },
    {
      nameEn: 'Brigadier General Ahmed Al-Busaidi',
      nameAr: 'العميد أحمد بن سالم البوسعيدي',
      roleEn: 'Executive Director of Pension Affairs',
      roleAr: 'المدير التنفيذي لشؤون المتقاعدين والصرف',
      rankEn: 'Brigadier General',
      rankAr: 'عميد'
    },
    {
      nameEn: 'Colonel Khalid Al-Mamari',
      nameAr: 'العقيد خالد بن ناصر المعمري',
      roleEn: 'Chief of Sovereign Assets Investment',
      roleAr: 'رئيس لجنة استثمار أصول الصندوق السيادية',
      rankEn: 'Colonel',
      rankAr: 'عقيد'
    }
  ];
}
