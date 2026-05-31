import { Component, inject, Input, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDataService, Retiree, Suggestion, Appointment, FuneralClaim, CompanyReg, NewsArticle, HotlineSettings } from '../../../core/services/admin-data.service';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  @Input() activeTab: 'dash' | 'retirees' | 'appointments' | 'claims' | 'companies' | 'court' | 'news' | 'hotline' | 'suggestions' | 'ibans' | 'bankDeductions' = 'dash';

  readonly lang = inject(LanguageService);
  readonly adminData = inject(AdminDataService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  // Search filter states
  readonly retireeQuery = signal<string>('');
  readonly appointmentQuery = signal<string>('');
  readonly claimQuery = signal<string>('');
  readonly companyQuery = signal<string>('');
  readonly ibanQuery = signal<string>('');
  readonly deductionQuery = signal<string>('');

  // Toggles for adding new items
  readonly showAddRetiree = signal<boolean>(false);
  readonly showAddNews = signal<boolean>(false);

  // Forms
  readonly retireeForm: FormGroup;
  readonly courtForm: FormGroup;
  readonly newsForm: FormGroup;
  readonly hotlineForm: FormGroup;

  // Initializing computed signals for searchable ledgers
  readonly filteredRetirees = computed(() => {
    const q = this.retireeQuery().toLowerCase().trim();
    const rows = this.adminData.retirees();
    if (!q) return rows;
    return rows.filter(r => 
      r.officerId.includes(q) || 
      r.fullNameEn.toLowerCase().includes(q) || 
      r.fullNameAr.toLowerCase().includes(q) || 
      r.branchEn.toLowerCase().includes(q) || 
      r.rankEn.toLowerCase().includes(q)
    );
  });

  readonly filteredAppointments = computed(() => {
    const q = this.appointmentQuery().toLowerCase().trim();
    const rows = this.adminData.appointments();
    if (!q) return rows;
    return rows.filter(a => 
      a.officerId.includes(q) || 
      a.officerName.toLowerCase().includes(q) || 
      a.channel.toLowerCase().includes(q) || 
      a.status.toLowerCase().includes(q)
    );
  });

  readonly filteredClaims = computed(() => {
    const q = this.claimQuery().toLowerCase().trim();
    const rows = this.adminData.funeralClaims();
    if (!q) return rows;
    return rows.filter(c => 
      c.deceasedId.includes(q) || 
      c.deceasedName.toLowerCase().includes(q) || 
      c.applicantName.toLowerCase().includes(q) || 
      c.relationship.toLowerCase().includes(q)
    );
  });

  readonly filteredCompanies = computed(() => {
    const q = this.companyQuery().toLowerCase().trim();
    const rows = this.adminData.companyRegistrations();
    if (!q) return rows;
    return rows.filter(c => 
      c.companyName.toLowerCase().includes(q) || 
      c.crNumber.includes(q) || 
      c.contactPerson.toLowerCase().includes(q)
    );
  });

  readonly filteredIbanRequests = computed(() => {
    const q = this.ibanQuery().toLowerCase().trim();
    const rows = this.adminData.ibanRequests();
    if (!q) return rows;
    return rows.filter(r => 
      r.officerId.includes(q) || 
      r.officerName.toLowerCase().includes(q) || 
      r.bankName.toLowerCase().includes(q) || 
      r.newIban.toLowerCase().includes(q)
    );
  });

  readonly filteredBankDeductions = computed(() => {
    const q = this.deductionQuery().toLowerCase().trim();
    const rows = this.adminData.bankDeductions();
    if (!q) return rows;
    return rows.filter(d => 
      d.civilId.includes(q) || 
      d.borrower.toLowerCase().includes(q) || 
      d.ref.toLowerCase().includes(q) || 
      d.bankName.toLowerCase().includes(q)
    );
  });

  constructor() {
    // 1. Add Retiree Form
    this.retireeForm = this.fb.group({
      officerId: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      fullNameEn: ['', Validators.required],
      fullNameAr: ['', Validators.required],
      rankEn: ['Major', Validators.required],
      rankAr: ['رائد', Validators.required],
      branchEn: ['Royal Army of Oman', Validators.required],
      branchAr: ['الجيش السلطاني العماني', Validators.required],
      basicSalary: [1000.000, [Validators.required, Validators.min(1)]],
      yearsOfService: [20, [Validators.required, Validators.min(1)]]
    });

    // 2. Court settings Form
    const court = this.adminData.courtSettings();
    this.courtForm = this.fb.group({
      muscatHoursEn: [court.muscatHoursEn, Validators.required],
      muscatHoursAr: [court.muscatHoursAr, Validators.required],
      seebHoursEn: [court.seebHoursEn, Validators.required],
      seebHoursAr: [court.seebHoursAr, Validators.required],
      maxDeductionPercent: [court.maxDeductionPercent, [Validators.required, Validators.min(1), Validators.max(50)]]
    });

    // 3. News Publish Form
    this.newsForm = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      categoryEn: ['Official Announcement', Validators.required],
      categoryAr: ['إعلان رسمي', Validators.required],
      descEn: ['', Validators.required],
      descAr: ['', Validators.required]
    });

    // 4. Hotline & System alerts Form
    const hotline = this.adminData.hotlineSettings();
    this.hotlineForm = this.fb.group({
      hotlineNo: [hotline.hotlineNo, [Validators.required, Validators.pattern(/^[0-9]{5,10}$/)]],
      alertBannerEn: [hotline.alertBannerEn, Validators.required],
      alertBannerAr: [hotline.alertBannerAr, Validators.required],
      isAlertActive: [hotline.isAlertActive]
    });
  }

  ngOnInit(): void {
    // Sync forms in case localstorage had different values
    const court = this.adminData.courtSettings();
    this.courtForm.patchValue({
      muscatHoursEn: court.muscatHoursEn,
      muscatHoursAr: court.muscatHoursAr,
      seebHoursEn: court.seebHoursEn,
      seebHoursAr: court.seebHoursAr,
      maxDeductionPercent: court.maxDeductionPercent
    });

    const hotline = this.adminData.hotlineSettings();
    this.hotlineForm.patchValue({
      hotlineNo: hotline.hotlineNo,
      alertBannerEn: hotline.alertBannerEn,
      alertBannerAr: hotline.alertBannerAr,
      isAlertActive: hotline.isAlertActive
    });
  }

  // Retiree Actions
  submitRetiree(): void {
    if (this.retireeForm.invalid) return;
    const val = this.retireeForm.value;
    
    // Pension Calculation logic: basic salary * yearsOfService * 0.0333 (approx 80% final basic salary for 24+ years)
    const factor = Math.min(0.8, val.yearsOfService * 0.033);
    const pensionAmt = Math.round(val.basicSalary * factor);

    this.adminData.addRetiree({
      officerId: val.officerId,
      fullNameEn: val.fullNameEn,
      fullNameAr: val.fullNameAr,
      rankEn: val.rankEn,
      rankAr: this.getArabicRank(val.rankEn),
      branchEn: val.branchEn,
      branchAr: this.getArabicBranch(val.branchEn),
      basicSalary: val.basicSalary,
      yearsOfService: val.yearsOfService,
      pensionAmount: pensionAmt,
      status: 'Active'
    });

    this.notification.success(
      this.lang.isRtl() 
        ? 'تم تسجيل المتقاعد العسكري الجديد بنجاح في قاعدة البيانات.' 
        : 'New retired military officer registered successfully in the database.'
    );

    this.retireeForm.reset({
      rankEn: 'Major',
      branchEn: 'Royal Army of Oman',
      basicSalary: 1000.000,
      yearsOfService: 20
    });
    this.showAddRetiree.set(false);
  }

  toggleRetireeStatus(officerId: string): void {
    this.adminData.toggleRetireeStatus(officerId);
    this.notification.info(
      this.lang.isRtl() 
        ? 'تم تحديث حالة المتقاعد بنجاح.' 
        : 'Retiree record status updated successfully.'
    );
  }

  // Appointment Actions
  acceptApt(id: string): void {
    this.adminData.acceptAppointment(id);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم قبول طلب الموعد وإرسال تأكيد المراجعة للمتقاعد.' 
        : 'Appointment request approved. Confirmation notification sent to retiree.'
    );
  }

  rejectApt(id: string): void {
    this.adminData.rejectAppointment(id);
    this.notification.warning(
      this.lang.isRtl() 
        ? 'تم رفض الموعد وتحديث سجل الطلبات.' 
        : 'Appointment request rejected and record logs updated.'
    );
  }

  // Claim Actions
  approveClaim(id: string): void {
    this.adminData.updateClaimStatus(id, 'Processed & Paid');
    this.notification.success(
      this.lang.isRtl() 
        ? 'تمت الموافقة على طلب مستحقات الجنازة وصرف المستحقات المالية للحساب البنكي.' 
        : 'Funeral claim approved. Grant aggregates successfully cleared and paid to IBAN.'
    );
  }

  rejectClaim(id: string): void {
    this.adminData.updateClaimStatus(id, 'Rejected');
    this.notification.warning(
      this.lang.isRtl() 
        ? 'تم رفض طلب مستحقات الجنازة.' 
        : 'Funeral claim application rejected and claimant notified.'
    );
  }

  // Company Supplier Actions
  approveCompany(id: string): void {
    this.adminData.updateCompanyStatus(id, 'Approved Supplier');
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم اعتماد الشركة كمورد مصنف للمشتريات العسكرية.' 
        : 'Company successfully approved as a certified military contractor/supplier.'
    );
  }

  rejectCompany(id: string): void {
    this.adminData.updateCompanyStatus(id, 'Rejected');
    this.notification.warning(
      this.lang.isRtl() 
        ? 'تم رفض طلب تسجيل الشركة الموردة.' 
        : 'Company supplier classification registration dossier rejected.'
    );
  }

  // Court Settings Actions
  saveCourtSettings(): void {
    if (this.courtForm.invalid) return;
    this.adminData.updateCourtSettings(this.courtForm.value);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم تحديث أوقات المحاكم وسياسة الاقتطاع بنجاح في بوابة المحاكم.' 
        : 'Court operating timings and deduction policy limits updated instantly on the Court Portal.'
    );
  }

  // News Publish Actions
  submitNews(): void {
    if (this.newsForm.invalid) return;
    const val = this.newsForm.value;
    
    this.adminData.publishNews({
      titleEn: val.titleEn,
      titleAr: val.titleAr,
      categoryEn: val.categoryEn,
      categoryAr: val.categoryAr,
      descEn: val.descEn,
      descAr: val.descAr,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    this.notification.success(
      this.lang.isRtl() 
        ? 'تم نشر الخبر وإضافته بنجاح للواجهة الرئيسية وشريط الأخبار.' 
        : 'News announcement successfully published to both homepage, news portal, and marquee ticker.'
    );

    this.newsForm.reset({
      categoryEn: 'Official Announcement',
      categoryAr: 'إعلان رسمي'
    });
    this.showAddNews.set(false);
  }

  retractNews(titleEn: string): void {
    this.adminData.deleteNews(titleEn);
    this.notification.info(
      this.lang.isRtl() 
        ? 'تم سحب الخبر وإلغاء نشره.' 
        : 'News announcement retracted and removed from all public layouts.'
    );
  }

  // Hotline & Alert Actions
  saveHotlineSettings(): void {
    if (this.hotlineForm.invalid) return;
    this.adminData.updateHotlineSettings(this.hotlineForm.value);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم حفظ إعدادات هاتف الخدمة وتحديث تنبيه النظام العام.' 
        : 'Hotline helpline contacts and system alert banner parameters saved successfully.'
    );
  }

  // Suggestion Actions
  dismissSuggestion(id: string): void {
    this.adminData.deleteSuggestion(id);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تم حفظ المقترح وأرشفته بنجاح.' 
        : 'Suggestion ticket archived successfully.'
    );
  }

  // IBAN Request Actions
  approveIban(id: string): void {
    this.adminData.approveIbanRequest(id);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تمت الموافقة على طلب تعديل الآيبان بنجاح.' 
        : 'IBAN modification request approved. Retiree core profile updated.'
    );
  }

  rejectIban(id: string): void {
    this.adminData.rejectIbanRequest(id);
    this.notification.warning(
      this.lang.isRtl() 
        ? 'تم رفض طلب تعديل الآيبان.' 
        : 'IBAN modification request rejected.'
    );
  }

  // Bank Loan Directive Actions
  approveBankDed(ref: string): void {
    this.adminData.approveBankDeduction(ref);
    this.notification.success(
      this.lang.isRtl() 
        ? 'تمت الموافقة على أمر الخصم البنكي بنجاح.' 
        : 'Bank loan deduction directive approved and ledger state updated.'
    );
  }

  rejectBankDed(ref: string): void {
    this.adminData.rejectBankDeduction(ref);
    this.notification.warning(
      this.lang.isRtl() 
        ? 'تم رفض طلب الخصم البنكي وإرجاعه.' 
        : 'Bank loan deduction directive rejected and returned.'
    );
  }

  // Static Helpers for Omani Military details
  private getArabicRank(en: string): string {
    const ranks: Record<string, string> = {
      'Lieutenant': 'ملازم',
      'Captain': 'نقيب',
      'Major': 'رائد',
      'Lieutenant Colonel': 'مقدم',
      'Colonel': 'عقيد',
      'Brigadier General': 'عميد',
      'Major General': 'لواء'
    };
    return ranks[en] || en;
  }

  private getArabicBranch(en: string): string {
    const branches: Record<string, string> = {
      'Royal Army of Oman': 'الجيش السلطاني العماني',
      'Royal Air Force of Oman': 'سلاح الجو السلطاني العماني',
      'Royal Navy of Oman': 'البحرية السلطانية العمانية',
      'Royal Guard of Oman': 'الحرس السلطاني العماني'
    };
    return branches[en] || en;
  }
}
