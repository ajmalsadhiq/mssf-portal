import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../shared/header/header.component';
import { AppFooterComponent } from '../../shared/footer/footer.component';
import { LanguageService } from '../../core/services/language.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NotificationToastComponent } from '../../shared/toast/toast.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AppHeaderComponent, 
    AppFooterComponent, 
    AdminDashboardComponent,
    NotificationToastComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col justify-between" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      <app-header></app-header>
      
      <!-- Secure Admin Authentication Overlay -->
      <div *ngIf="!isAuthenticated()" class="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(#C39B62_1px,transparent_1px)] bg-[size:24px_24px] bg-stone-900 min-h-[calc(100vh-160px)]">
        <div class="w-full max-w-md bg-stone-950/90 border border-accent/30 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-md relative overflow-hidden animate-fade-in-up">
          
          <!-- Decorative luxury overlay gradient -->
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>

          <!-- Logo & Header -->
          <div class="text-center space-y-2 relative z-10">
            <div class="w-16 h-16 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner">
              👑
            </div>
            <h3 class="font-display text-base font-black text-accent tracking-wider uppercase">
              {{ lang.isRtl() ? 'صندوق تقاعد الأجهزة العسكرية والأمنية' : 'Military & Security Pension Fund' }}
            </h3>
            <span class="text-[9px] text-stone-400 font-bold uppercase tracking-widest block">
              {{ lang.isRtl() ? 'بوابة التحكم الإداري الآمن' : 'Administrative Override Command Center' }}
            </span>
            <div class="w-16 h-0.5 bg-accent/60 mx-auto mt-2 rounded-full"></div>
          </div>

          <!-- Credentials Prompt Form -->
          <form (ngSubmit)="login()" class="flex flex-col gap-4 relative z-10 mt-2">
            
            <!-- Username Input -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                {{ lang.isRtl() ? 'اسم المستخدم' : 'Administrative Username' }}
              </label>
              <input 
                type="text" 
                [(ngModel)]="usernameField"
                name="username"
                required
                class="w-full px-4 py-3 border border-stone-800 rounded-xl text-xs font-semibold outline-none bg-stone-900/60 text-white placeholder-stone-600 focus:ring-1 focus:ring-accent focus:border-accent tracking-wide transition-all"
                [placeholder]="lang.isRtl() ? 'أدخل اسم المستخدم الإداري' : 'e.g. admin'"
              />
            </div>

            <!-- Password Input -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                {{ lang.isRtl() ? 'كلمة المرور الإدارية' : 'Security Password' }}
              </label>
              <input 
                type="password" 
                [(ngModel)]="passwordField"
                name="password"
                required
                class="w-full px-4 py-3 border border-stone-800 rounded-xl text-xs font-mono font-black outline-none bg-stone-900/60 text-white placeholder-stone-600 focus:ring-1 focus:ring-accent focus:border-accent tracking-widest transition-all"
                placeholder="••••••••"
              />
            </div>

            <!-- Warning/Disclaimer -->
            <div class="p-3 bg-rose-950/20 border border-rose-500/15 rounded-xl text-[9px] text-rose-400 leading-normal font-semibold">
              ⚠️ {{ lang.isRtl() ? 'تحذير: هذا النظام مخصص للاستخدام الرسمي فقط. يتم رصد وتدقيق كافة عمليات الدخول إلكترونياً.' : 'ATTENTION: This is a restricted military database system. All authentication attempts and dashboard actions are logged and audited.' }}
            </div>

            <!-- Login CTA -->
            <button 
              type="submit"
              [disabled]="!usernameField || !passwordField"
              class="w-full py-3.5 rounded-xl bg-accent text-primary hover:bg-accent-light font-black text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              {{ lang.isRtl() ? 'تسجيل الدخول الآمن' : 'Authorize Secure Session' }}
            </button>
          </form>

        </div>
      </div>

      <!-- Split Command Center Structure (Authorized View) -->
      <div *ngIf="isAuthenticated()" class="flex-grow flex relative">
        
        <!-- Administrative Sidebar Panel (Left) -->
        <aside class="w-64 bg-primary text-stone-200 border-accent/20 flex flex-col gap-1.5 p-4 shrink-0" [ngClass]="lang.isRtl() ? 'border-l' : 'border-r'">
          
          <!-- Command Header Title -->
          <div class="p-4 border-b border-accent/15 mb-4 text-center">
            <h3 class="font-display text-sm font-black text-accent tracking-wider uppercase">Command Center</h3>
            <span class="text-[9px] text-stone-400 font-semibold">MSSPF Admin Suite</span>
          </div>

          <!-- Navigation Command Buttons -->
          <button 
            (click)="activeTab.set('dash')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'dash' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            📊 {{ lang.isRtl() ? 'لوحة المراقبة' : 'Dashboard Overview' }}
          </button>
          
          <button 
            (click)="activeTab.set('retirees')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'retirees' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            🪖 {{ lang.isRtl() ? 'دليل المتقاعدين' : 'Retirees Directory' }}
          </button>

          <button 
            (click)="activeTab.set('appointments')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'appointments' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            📅 {{ lang.isRtl() ? 'مراجعة المواعيد' : 'Appointments Review' }}
          </button>

          <button 
            (click)="activeTab.set('ibans')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'ibans' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            💳 {{ lang.isRtl() ? 'طلبات تعديل الآيبان' : 'IBAN Change Requests' }}
          </button>

          <button 
            (click)="activeTab.set('bankDeductions')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'bankDeductions' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            🏦 {{ lang.isRtl() ? 'خصومات القروض المصرفية' : 'Bank Loan Directives' }}
          </button>

          <button 
            (click)="activeTab.set('claims')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'claims' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            🕊️ {{ lang.isRtl() ? 'مستحقات الجنازة' : 'Funeral Claims' }}
          </button>

          <button 
            (click)="activeTab.set('companies')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'companies' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            🏢 {{ lang.isRtl() ? 'تسجيل الشركات' : 'Supplier Registrations' }}
          </button>

          <button 
            (click)="activeTab.set('court')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'court' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            ⚖️ {{ lang.isRtl() ? 'مواعيد المحاكم' : 'Court Portals Settings' }}
          </button>

          <button 
            (click)="activeTab.set('news')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'news' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            📰 {{ lang.isRtl() ? 'إدارة الأخبار' : 'Press News Manager' }}
          </button>

          <button 
            (click)="activeTab.set('hotline')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'hotline' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            📞 {{ lang.isRtl() ? 'الهاتف والطوارئ' : 'Hotline & System Alerts' }}
          </button>

          <button 
            (click)="activeTab.set('suggestions')" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold hover:bg-primary-light/45 transition-colors cursor-pointer text-left w-full"
            [ngClass]="activeTab() === 'suggestions' ? 'bg-accent text-primary font-bold shadow-md' : 'text-stone-300'"
          >
            💬 {{ lang.isRtl() ? 'المقترحات والآراء' : 'Suggestions & Feedback' }}
          </button>

          <!-- Secure Log Out Action -->
          <div class="mt-auto pt-4 border-t border-accent/15">
            <button 
              (click)="logout()" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer text-left w-full"
            >
              🔒 {{ lang.isRtl() ? 'تسجيل الخروج الآمن' : 'End Secure Session' }}
            </button>
          </div>

        </aside>

        <!-- Command Panel Central Area (Right) -->
        <main class="flex-grow p-6 md:p-8 bg-stone-50 overflow-x-hidden min-h-[calc(100vh-80px)]">
          <div class="mx-auto max-w-5xl">
            <app-admin-dashboard [activeTab]="activeTab()"></app-admin-dashboard>
          </div>
        </main>

      </div>

      <app-footer></app-footer>
      <app-toast></app-toast>
    </div>
  `
})
export class AdminShellComponent {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);

  readonly isAuthenticated = signal<boolean>(false);
  readonly activeTab = signal<'dash' | 'retirees' | 'appointments' | 'claims' | 'companies' | 'court' | 'news' | 'hotline' | 'suggestions' | 'ibans' | 'bankDeductions'>('dash');

  usernameField = '';
  passwordField = '';

  login(): void {
    if (this.usernameField.trim() === 'admin' && this.passwordField === 'msspf@2026') {
      this.isAuthenticated.set(true);
      this.notification.success(
        this.lang.isRtl() 
          ? 'تم التحقق من الصلاحيات وتأمين الجلسة بنجاح.' 
          : 'Administrative override credentials authorized. Secure command session established.'
      );
      this.usernameField = '';
      this.passwordField = '';
    } else {
      this.notification.error(
        this.lang.isRtl() 
          ? 'خطأ: اسم المستخدم أو كلمة المرور غير صحيحة.' 
          : 'Access Denied: Invalid administrative username or security password.'
      );
      this.passwordField = '';
    }
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.activeTab.set('dash');
    this.notification.info(
      this.lang.isRtl() 
        ? 'تم إنهاء الجلسة الإدارية وإغلاق البوابة بنجاح.' 
        : 'Administrative session terminated. Override credentials revoked.'
    );
  }
}
