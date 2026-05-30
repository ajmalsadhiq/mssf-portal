import { Injectable, signal } from '@angular/core';

export interface PensionResult {
  estimatedPension: number;
  replacementRate: number;
  allowanceSum: number;
  grossPension: number;
  pensionTaxDeduction: number;
  netPension: number;
}

export interface RankConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  multiplier: number; // e.g., 0.04 (4% per year of service)
  maxReplacementRate: number; // e.g., 0.8 (80%)
  allowanceFixed: number; // OMR
}

@Injectable({
  providedIn: 'root'
})
export class PensionService {
  // Make ranks configurable so the admin can change multiplier ratios on the fly
  readonly ranks = signal<RankConfig[]>([
    { id: 'officer_senior', nameEn: 'Senior Officer (Colonel & Above)', nameAr: 'ضابط سينيور (عقيد فما فوق)', multiplier: 0.045, maxReplacementRate: 1.00, allowanceFixed: 150 },
    { id: 'officer_junior', nameEn: 'Junior Officer (Lieutenant to Lieutenant Colonel)', nameAr: 'ضابط جونيور (ملازم إلى مقدم)', multiplier: 0.042, maxReplacementRate: 0.90, allowanceFixed: 100 },
    { id: 'nco', nameEn: 'Non-Commissioned Officer (NCO)', nameAr: 'رتب أخرى (صف ضابط)', multiplier: 0.040, maxReplacementRate: 0.85, allowanceFixed: 75 },
    { id: 'enlisted', nameEn: 'Enlisted Personnel', nameAr: 'جنود / أفراد', multiplier: 0.038, maxReplacementRate: 0.80, allowanceFixed: 50 },
    { id: 'civilian', nameEn: 'Civilian Technical Staff', nameAr: 'مدنيين فنيين', multiplier: 0.035, maxReplacementRate: 0.80, allowanceFixed: 40 }
  ]);

  calculatePension(basicSalary: number, yearsOfService: number, rankId: string): PensionResult {
    const rank = this.ranks().find(r => r.id === rankId) || this.ranks()[2];
    
    // Pension multiplier math
    let replacementRate = yearsOfService * rank.multiplier;
    if (replacementRate > rank.maxReplacementRate) {
      replacementRate = rank.maxReplacementRate;
    }

    const estimatedPension = basicSalary * replacementRate;
    const allowanceSum = rank.allowanceFixed;
    const grossPension = estimatedPension + allowanceSum;
    
    // Local pension welfare contributions or tax (highly stylized Omani social tax, e.g. 1%)
    const pensionTaxDeduction = grossPension * 0.01;
    
    // Minimum pension guarantee in OMR
    const guaranteedMin = 300.000;
    let netPension = grossPension - pensionTaxDeduction;
    if (netPension < guaranteedMin && basicSalary > guaranteedMin) {
      netPension = guaranteedMin;
    }

    return {
      estimatedPension: Number(estimatedPension.toFixed(3)),
      replacementRate: Number((replacementRate * 100).toFixed(1)),
      allowanceSum: Number(allowanceSum.toFixed(3)),
      grossPension: Number(grossPension.toFixed(3)),
      pensionTaxDeduction: Number(pensionTaxDeduction.toFixed(3)),
      netPension: Number(netPension.toFixed(3))
    };
  }
}
