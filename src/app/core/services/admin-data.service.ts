import { Injectable, signal, effect } from '@angular/core';

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

export interface Appointment {
  id: string;
  officerId: string;
  officerName: string;
  date: string;
  timeSlot: string;
  channel: 'In-Person' | 'Phone';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Retiree {
  officerId: string;
  fullNameEn: string;
  fullNameAr: string;
  rankEn: string;
  rankAr: string;
  branchEn: string;
  branchAr: string;
  basicSalary: number;
  yearsOfService: number;
  pensionAmount: number;
  status: 'Active' | 'Suspended';
  iban?: string;
}

export interface FuneralClaim {
  id: string;
  deceasedId: string;
  deceasedName: string;
  applicantName: string;
  applicantPhone: string;
  relationship: string;
  iban: string;
  heirCert: string;
  deathCert: string;
  applicantId: string;
  bankCard: string;
  date: string;
  status: 'Pending Review' | 'Processed & Paid' | 'Rejected';
}

export interface CompanyReg {
  id: string;
  companyName: string;
  crNumber: string;
  crExpiry: string;
  contactPerson: string;
  phone: string;
  email: string;
  categories: string[];
  crFileName: string;
  date: string;
  status: 'Pending Review' | 'Approved Supplier' | 'Rejected';
}

export interface CourtSettings {
  muscatHoursEn: string;
  muscatHoursAr: string;
  seebHoursEn: string;
  seebHoursAr: string;
  maxDeductionPercent: number;
  lastUpdated: string;
}

export interface NewsArticle {
  titleEn: string;
  titleAr: string;
  date: string;
  categoryEn: string;
  categoryAr: string;
  descEn: string;
  descAr: string;
}

export interface HotlineSettings {
  hotlineNo: string;
  alertBannerEn: string;
  alertBannerAr: string;
  isAlertActive: boolean;
}

export interface IbanRequest {
  id: string;
  officerId: string;
  officerName: string;
  bankName: string;
  newIban: string;
  letterFileName: string;
  date: string;
  status: 'Pending Review' | 'Approved & Processed' | 'Rejected';
}

export interface BankDeduction {
  ref: string;
  civilId: string;
  borrower: string;
  loanAmount: number;
  deductionAmount: number;
  type: 'Active Deduction' | 'Stop Directive';
  status: 'Approved & Processed' | 'Pending Review' | 'Rejected / Returned';
  bankName: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  // Active Signals representing administrative queues
  readonly suggestions = signal<Suggestion[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly retirees = signal<Retiree[]>([]);
  readonly funeralClaims = signal<FuneralClaim[]>([]);
  readonly companyRegistrations = signal<CompanyReg[]>([]);
  readonly courtSettings = signal<CourtSettings>({
    muscatHoursEn: '08:00 AM - 02:00 PM',
    muscatHoursAr: '٠٨:٠٠ ص - ٠٢:٠٠ م',
    seebHoursEn: '08:00 AM - 02:00 PM',
    seebHoursAr: '٠٨:٠٠ ص - ٠٢:٠٠ م',
    maxDeductionPercent: 25,
    lastUpdated: 'May 31, 2026'
  });
  readonly newsArticles = signal<NewsArticle[]>([]);
  readonly hotlineSettings = signal<HotlineSettings>({
    hotlineNo: '80077777',
    alertBannerEn: 'System upgrade scheduled for June 5th, 2026. Al Retiree Portal access will experience short disruptions between 2:00 AM and 4:00 AM.',
    alertBannerAr: 'تحديث مجدول للنظام في 5 يونيو 2026. ستتأثر خدمات بوابة المتقاعدين بفترات انقطاع قصيرة بين الساعة 2:00 صباحاً و 4:00 صباحاً.',
    isAlertActive: false
  });

  // Cross-portal Signals
  readonly ibanRequests = signal<IbanRequest[]>([]);
  readonly bankDeductions = signal<BankDeduction[]>([]);

  constructor() {
    this.loadState();

    // Set up effects to automatically sync state modifications to LocalStorage
    effect(() => {
      localStorage.setItem('msspf_admin_suggestions', JSON.stringify(this.suggestions()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_appointments', JSON.stringify(this.appointments()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_retirees', JSON.stringify(this.retirees()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_claims', JSON.stringify(this.funeralClaims()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_companies', JSON.stringify(this.companyRegistrations()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_court', JSON.stringify(this.courtSettings()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_news', JSON.stringify(this.newsArticles()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_hotline', JSON.stringify(this.hotlineSettings()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_ibans', JSON.stringify(this.ibanRequests()));
    });
    effect(() => {
      localStorage.setItem('msspf_admin_bank_deductions', JSON.stringify(this.bankDeductions()));
    });
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;

    // 1. Suggestions
    const rawSuggestions = localStorage.getItem('msspf_admin_suggestions');
    if (rawSuggestions) {
      this.suggestions.set(JSON.parse(rawSuggestions));
    } else {
      this.suggestions.set([
        {
          id: 'sug-1',
          name: 'Hassan Al-Mamari',
          email: 'hassan.m@oman.om',
          phone: '+968 99341258',
          subject: 'Direct IBAN Modification Option',
          message: 'Can you enable direct bank verification for bank detail updates so we do not have to upload physical cards?',
          date: 'May 28, 2026'
        },
        {
          id: 'sug-2',
          name: 'Amina Al-Farsi',
          email: 'amina.farsi@outlook.com',
          phone: '+968 91238596',
          subject: 'Appointment slot timing range',
          message: 'It would be helpful to have afternoon appointment slots from 2:00 PM to 4:00 PM for retired officers living far from Muscat.',
          date: 'May 30, 2026'
        }
      ]);
    }

    // 2. Appointments
    const rawApts = localStorage.getItem('msspf_admin_appointments');
    if (rawApts) {
      this.appointments.set(JSON.parse(rawApts));
    } else {
      this.appointments.set([
        {
          id: 'apt-101',
          officerId: '08412952',
          officerName: 'Salim Al-Abri',
          date: 'Jun 05, 2026',
          timeSlot: '10:00 AM - 10:30 AM',
          channel: 'In-Person',
          status: 'Pending'
        },
        {
          id: 'apt-102',
          officerId: '08412952',
          officerName: 'Salim Al-Abri',
          date: 'Jun 08, 2026',
          timeSlot: '02:00 PM - 02:30 PM',
          channel: 'Phone',
          status: 'Approved'
        }
      ]);
    }

    // 3. Retirees
    const rawRetirees = localStorage.getItem('msspf_admin_retirees');
    if (rawRetirees) {
      this.retirees.set(JSON.parse(rawRetirees));
    } else {
      this.retirees.set([
        {
          officerId: '08412952',
          fullNameEn: 'Salim Al-Abri',
          fullNameAr: 'سالم العبري',
          rankEn: 'Lieutenant Colonel',
          rankAr: 'مقدم',
          branchEn: 'Royal Army of Oman',
          branchAr: 'الجيش السلطاني العماني',
          basicSalary: 1200.000,
          yearsOfService: 24,
          pensionAmount: 960.000,
          status: 'Active',
          iban: 'OM42 ROPB 0000 1234 5678 0001'
        },
        {
          officerId: '04910582',
          fullNameEn: 'Khalfan Al-Busaidi',
          fullNameAr: 'خلفان البوسعيدي',
          rankEn: 'Colonel',
          rankAr: 'عقيد',
          branchEn: 'Royal Air Force of Oman',
          branchAr: 'سلاح الجو السلطاني العماني',
          basicSalary: 1800.000,
          yearsOfService: 28,
          pensionAmount: 1620.000,
          status: 'Active',
          iban: 'OM12 NBOB 0000 9999 8888 0012'
        },
        {
          officerId: '03829401',
          fullNameEn: 'Mohammed Al-Balushi',
          fullNameAr: 'محمد البلوشي',
          rankEn: 'Major General',
          rankAr: 'لواء',
          branchEn: 'Royal Navy of Oman',
          branchAr: 'البحرية السلطانية العمانية',
          basicSalary: 3200.000,
          yearsOfService: 32,
          pensionAmount: 3040.000,
          status: 'Active',
          iban: 'OM55 BANK 0000 8888 7777 9999'
        }
      ]);
    }

    // 4. Funeral Claims
    const rawClaims = localStorage.getItem('msspf_admin_claims');
    if (rawClaims) {
      this.funeralClaims.set(JSON.parse(rawClaims));
    } else {
      this.funeralClaims.set([
        {
          id: 'claim-301',
          deceasedId: '02849501',
          deceasedName: 'Saeed Al-Harthy',
          applicantName: 'Fahad Saeed Al-Harthy',
          applicantPhone: '+968 95839204',
          relationship: 'Son / الابن',
          iban: 'OM48BANK0000000102948501',
          heirCert: 'heir_certificate.pdf',
          deathCert: 'death_certificate.pdf',
          applicantId: 'applicant_civil_id.pdf',
          bankCard: 'bank_card.pdf',
          date: 'May 27, 2026',
          status: 'Pending Review'
        }
      ]);
    }

    // 5. Companies
    const rawCompanies = localStorage.getItem('msspf_admin_companies');
    if (rawCompanies) {
      this.companyRegistrations.set(JSON.parse(rawCompanies));
    } else {
      this.companyRegistrations.set([
        {
          id: 'corp-201',
          companyName: 'Al-Tasnim Logistics & Security',
          crNumber: '1049285',
          crExpiry: '2029-12-31',
          contactPerson: 'Salim Al-Harthy',
          phone: '+968 24409999',
          email: 'tenders@tasnim.om',
          categories: ['HQ Facilities & Maintenance', 'Tactical Communications Systems'],
          crFileName: 'cr_registration_tasnim.pdf',
          date: 'May 29, 2026',
          status: 'Pending Review'
        }
      ]);
    }

    // 6. Court Settings
    const rawCourt = localStorage.getItem('msspf_admin_court');
    if (rawCourt) {
      this.courtSettings.set(JSON.parse(rawCourt));
    }

    // 7. News
    const rawNews = localStorage.getItem('msspf_admin_news');
    if (rawNews) {
      this.newsArticles.set(JSON.parse(rawNews));
    } else {
      this.newsArticles.set([
        {
          titleEn: 'MSSPF Board Reviews Pension Assets and Investment Allocations',
          titleAr: 'مجلس إدارة صندوق تقاعد الأجهزة العسكرية يستعرض أصول الاستثمار وتوزيع الثروات',
          date: 'May 28, 2026',
          categoryEn: 'Board News',
          categoryAr: 'أخبار المجلس',
          descEn: 'The MSSPF board of directors held its second fiscal quarterly review meeting of 2026 to discuss global sovereign assets yield indexes and welfare coverage programs.',
          descAr: 'عقد مجلس إدارة صندوق تقاعد الأجهزة العسكرية والأمنية اجتماعه الدوري الثاني للعام المالي ٢٠٢٦ لمراجعة محافظ الاستثمار ونسب نمو الصناديق السيادية.'
        }
      ]);
    }

    // 8. Hotline Settings
    const rawHotline = localStorage.getItem('msspf_admin_hotline');
    if (rawHotline) {
      this.hotlineSettings.set(JSON.parse(rawHotline));
    }

    // 9. IBAN requests
    const rawIbans = localStorage.getItem('msspf_admin_ibans');
    if (rawIbans) {
      this.ibanRequests.set(JSON.parse(rawIbans));
    } else {
      this.ibanRequests.set([
        {
          id: 'iban-501',
          officerId: '08412952',
          officerName: 'Salim Al-Abri',
          bankName: 'Bank Muscat',
          newIban: 'OM42 ROPB 0000 1234 5678 0001',
          letterFileName: 'iban_verification_letter.pdf',
          date: 'May 27, 2026',
          status: 'Pending Review'
        }
      ]);
    }

    // 10. Bank Deductions
    const rawDeductions = localStorage.getItem('msspf_admin_bank_deductions');
    if (rawDeductions) {
      this.bankDeductions.set(JSON.parse(rawDeductions));
    } else {
      this.bankDeductions.set([
        {
          ref: 'BM/DED/2026/842',
          civilId: '08412952',
          borrower: 'Salim Al-Abri',
          loanAmount: 15000.000,
          deductionAmount: 200.000,
          type: 'Active Deduction',
          status: 'Pending Review',
          bankName: 'Bank Muscat',
          date: 'May 29, 2026'
        }
      ]);
    }
  }

  // Suggestion Actions
  addSuggestion(sug: Omit<Suggestion, 'id' | 'date'>): void {
    const newSug: Suggestion = {
      ...sug,
      id: `sug-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.suggestions.update(s => [newSug, ...s]);
  }

  deleteSuggestion(id: string): void {
    this.suggestions.update(s => s.filter(x => x.id !== id));
  }

  // Appointment Actions
  addAppointment(apt: Omit<Appointment, 'id' | 'status'>): void {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending'
    };
    this.appointments.update(a => [newApt, ...a]);
  }

  acceptAppointment(id: string): void {
    this.appointments.update(items =>
      items.map(item => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  }

  rejectAppointment(id: string): void {
    this.appointments.update(items =>
      items.map(item => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
  }

  // Funeral Claim Actions
  addFuneralClaim(claim: Omit<FuneralClaim, 'id' | 'date' | 'status'>): void {
    const newClaim: FuneralClaim = {
      ...claim,
      id: `claim-${Math.floor(300 + Math.random() * 700)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Review'
    };
    this.funeralClaims.update(c => [newClaim, ...c]);
  }

  updateClaimStatus(id: string, status: 'Pending Review' | 'Processed & Paid' | 'Rejected'): void {
    this.funeralClaims.update(items =>
      items.map(item => (item.id === id ? { ...item, status } : item))
    );
  }

  // Company Actions
  addCompanyRegistration(comp: Omit<CompanyReg, 'id' | 'date' | 'status'>): void {
    const newComp: CompanyReg = {
      ...comp,
      id: `corp-${Math.floor(200 + Math.random() * 800)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Review'
    };
    this.companyRegistrations.update(c => [newComp, ...c]);
  }

  updateCompanyStatus(id: string, status: 'Pending Review' | 'Approved Supplier' | 'Rejected'): void {
    this.companyRegistrations.update(items =>
      items.map(item => (item.id === id ? { ...item, status } : item))
    );
  }

  // Court Settings
  updateCourtSettings(settings: CourtSettings): void {
    this.courtSettings.set({
      ...settings,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  }

  // News Actions
  publishNews(article: NewsArticle): void {
    this.newsArticles.update(articles => [article, ...articles]);
  }

  deleteNews(titleEn: string): void {
    this.newsArticles.update(articles => articles.filter(a => a.titleEn !== titleEn));
  }

  // Hotline Actions
  updateHotlineSettings(settings: HotlineSettings): void {
    this.hotlineSettings.set(settings);
  }

  // Retiree Management Actions
  addRetiree(retiree: Retiree): void {
    this.retirees.update(r => [...r, retiree]);
  }

  toggleRetireeStatus(officerId: string): void {
    this.retirees.update(items =>
      items.map(item => (item.officerId === officerId ? { ...item, status: item.status === 'Active' ? 'Suspended' as const : 'Active' as const } : item))
    );
  }

  // IBAN request actions
  addIbanRequest(req: Omit<IbanRequest, 'id' | 'date' | 'status'>): void {
    const newReq: IbanRequest = {
      ...req,
      id: `iban-${Math.floor(500 + Math.random() * 500)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };
    this.ibanRequests.update(items => [newReq, ...items]);
  }

  approveIbanRequest(id: string): void {
    const requests = this.ibanRequests();
    const req = requests.find(r => r.id === id);
    if (!req) return;

    // 1. Update request status
    this.ibanRequests.update(items =>
      items.map(item => (item.id === id ? { ...item, status: 'Approved & Processed' as const } : item))
    );

    // 2. Overwrite retiree IBAN in retirees signal database!
    this.retirees.update(items =>
      items.map(item => (item.officerId === req.officerId ? { ...item, iban: req.newIban } : item))
    );
  }

  rejectIbanRequest(id: string): void {
    this.ibanRequests.update(items =>
      items.map(item => (item.id === id ? { ...item, status: 'Rejected' as const } : item))
    );
  }

  // Bank Deduction Actions
  addBankDeduction(ded: Omit<BankDeduction, 'ref' | 'date' | 'status'>): void {
    const newDed: BankDeduction = {
      ...ded,
      ref: `${ded.bankName.substring(0, 2).toUpperCase()}/${ded.type === 'Active Deduction' ? 'DED' : 'STP'}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };
    this.bankDeductions.update(items => [newDed, ...items]);
  }

  approveBankDeduction(ref: string): void {
    this.bankDeductions.update(items =>
      items.map(item => (item.ref === ref ? { ...item, status: 'Approved & Processed' as const } : item))
    );
  }

  rejectBankDeduction(ref: string): void {
    this.bankDeductions.update(items =>
      items.map(item => (item.ref === ref ? { ...item, status: 'Rejected / Returned' as const } : item))
    );
  }
}
