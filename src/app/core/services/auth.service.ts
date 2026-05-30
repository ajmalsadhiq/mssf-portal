import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface RetireeProfile {
  civilId: string;
  fullNameEn: string;
  fullNameAr: string;
  rankEn: string;
  rankAr: string;
  branchEn: string;
  branchAr: string;
  mobile: string;
  addressEn: string;
  addressAr: string;
  lastPensionPaid: number;
  iban: string;
  loyaltyTier: 'Gold' | 'Silver' | 'Bronze';
  loyaltyPoints: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<RetireeProfile | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  
  // Tracking intermediate state during OTP login
  readonly verificationCivilId = signal<string | null>(null);

  private readonly mockRetiree: RetireeProfile = {
    civilId: '08412952',
    fullNameEn: 'Major General Salem Al-Harthy',
    fullNameAr: 'اللواء سالم الحارثي',
    rankEn: 'Major General',
    rankAr: 'لواء',
    branchEn: 'Royal Army of Oman',
    branchAr: 'الجيش السلطاني العماني',
    mobile: '+968 9988 7766',
    addressEn: 'Villa 102, Way 2035, Al Khuwair, Muscat',
    addressAr: 'فيلا ١٠٢، سكة ٢٠٣٥، الخوير، مسقط',
    lastPensionPaid: 1845.500,
    iban: 'OM42 ROPB 0000 1234 5678 0001',
    loyaltyTier: 'Gold',
    loyaltyPoints: 12500
  };

  requestOtp(civilId: string): Observable<boolean> {
    this.verificationCivilId.set(civilId);
    // Simulate API delay for SMS OTP dispatch
    return of(true).pipe(delay(800));
  }

  verifyOtp(otp: string): Observable<boolean> {
    return of(otp === '123456' || otp.length === 6).pipe(
      delay(800),
      tap(isValid => {
        if (isValid) {
          // Log in with our premium mock retiree
          this.currentUser.set({
            ...this.mockRetiree,
            civilId: this.verificationCivilId() || this.mockRetiree.civilId
          });
        }
      })
    );
  }

  authenticateWithFace(): Observable<boolean> {
    return of(true).pipe(
      delay(1500),
      tap(() => {
        this.currentUser.set(this.mockRetiree);
      })
    );
  }

  updateProfileMobile(mobile: string): void {
    const user = this.currentUser();
    if (user) {
      this.currentUser.set({ ...user, mobile });
    }
  }

  updateProfileAddress(addressEn: string, addressAr: string): void {
    const user = this.currentUser();
    if (user) {
      this.currentUser.set({ ...user, addressEn, addressAr });
    }
  }

  updateIBAN(iban: string): void {
    const user = this.currentUser();
    if (user) {
      this.currentUser.set({ ...user, iban });
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.verificationCivilId.set(null);
  }
}
