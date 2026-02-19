import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoanDetails } from '../domain/loan-details-domain';
import { MonthlyInstallment, YearlyInstallment } from '../domain/installment-domain';
import { AmortizationInstallment } from '../domain/firebase-domain';

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {
  amortisationReport$ = new BehaviorSubject<MonthlyInstallment[]>([]);
  private previousEndBalance = 0;
  private previousEmi = 0;
  private previousInterestRate = 0;


  clonedRows: { [s: string]: AmortizationInstallment } = {};

  private _loanDetails: LoanDetails = {
    principal: 0,
    roi: 0,
    tenure: 0,
    startDate: new Date()
  };

  constructor() { }

  get loanDetails(): LoanDetails {
    return this._loanDetails;
  }

  set loanDetails(value: LoanDetails) {
    this.previousEndBalance = 0;
    this._loanDetails = value;
    //this.generateAmortisationReport();
  }

  get emi(): number {
    if (this.loanDetails.principal <= 0 || this.loanDetails.tenure <= 0) {
      return 0;
    }
    return this.calculateEMI(this.loanDetails);
  }

  get totalInterest(): number {
    const report = this.amortisationReport$.getValue();
    return report.reduce((sum, item) => sum + item.interestPaid, 0);
  }

  get totalPayment(): number {
    const report = this.amortisationReport$.getValue();
    return report.reduce((sum, item) => sum + item.totalPaid, 0);
  }

  get remainingTenure(): number {
    const report = this.amortisationReport$.getValue();
    let endDate: Date;
    let startDate: Date;

    if (report && report.length > 0) {
      const lastInstallment = report[report.length - 1];
      endDate = new Date(lastInstallment.paymentDate ?? new Date());
      startDate = new Date(this.loanDetails.startDate);
    } else {
      const { startDate: sDate, tenure } = this.loanDetails;
      if (!sDate || tenure <= 0) return 0;
      startDate = new Date(sDate);
      if (isNaN(startDate.getTime())) return 0;
      endDate = new Date(startDate);
      endDate.setUTCFullYear(startDate.getUTCFullYear() + tenure);
    }

    const today = new Date();
    if (today > endDate) return 0;
    
    const effectiveStart = today < startDate ? startDate : today;
    const diffTime = endDate.getTime() - effectiveStart.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, parseFloat(diffYears.toFixed(1)));
  }

  getMonthlyInstallments(): MonthlyInstallment[] {
    return this.calculateAmortization(this._loanDetails, this.clonedRows);
  }

  calculateAmortization(loanDetails: LoanDetails, clonedRows: { [s: string]: AmortizationInstallment } = {}): MonthlyInstallment[] {
    const totalInstallments: MonthlyInstallment[] = [];
    
    // Initial values
    let previousEndBalance = loanDetails.principal;
    let previousEmi = this.calculateEMI(loanDetails);
    let previousInterestRate = loanDetails.roi;

    let i = 1;
    const maxMonths = 1200; // Safety limit of 100 years

    while (previousEndBalance > 0 && i <= maxMonths) {
      const currentMonth = new MonthlyInstallment();
      currentMonth.incrementalMonth = i;
      currentMonth.dueDate = i === 1 ? loanDetails.startDate : this.addMonths(loanDetails.startDate, i - 1);
      currentMonth.paymentDate = currentMonth.dueDate;
      currentMonth.startingBalance = i === 1 ? loanDetails.principal : previousEndBalance;

      const key = this.formatDateKey(currentMonth.paymentDate);
      const editedRecord = clonedRows[key];

      if (editedRecord) {
        currentMonth.emiAmount = editedRecord.emiAmount;
        currentMonth.interestRate = editedRecord.interestRate;
        currentMonth.partPaymentAmount = editedRecord.partPaymentAmount;
      } else {
        currentMonth.emiAmount = previousEmi;
        currentMonth.interestRate = previousInterestRate;
        currentMonth.partPaymentAmount = 0;
      }

      currentMonth.interestPaid = this.calculateInterest(currentMonth);

      // Recalculate EMI if interest > EMI (negative amortization protection)
      if (currentMonth.interestPaid > currentMonth.emiAmount) {
        currentMonth.emiAmount = this.calculateEMI({
          ...loanDetails,
          roi: currentMonth.interestRate,
          tenure: ((loanDetails.tenure * 12) - totalInstallments.length) / 12,
        } as LoanDetails);
      }

      currentMonth.principalPaid = this.calculatePrincipal(currentMonth);
      currentMonth.endingBalance = this.calculateEndingBalance(currentMonth);
      currentMonth.paymentStatus = this.getPaymentStatus(currentMonth.paymentDate);
      currentMonth.remarks = `Installment for month ${i}`;
      currentMonth.totalPaid = currentMonth.emiAmount + currentMonth.partPaymentAmount;

      previousEndBalance = currentMonth.endingBalance;
      previousEmi = currentMonth.emiAmount;
      previousInterestRate = currentMonth.interestRate;

      totalInstallments.push(currentMonth);

      if (currentMonth.endingBalance <= 0) {
        currentMonth.endingBalance = 0;
        break;
      }
      i++;
    }
    return totalInstallments;
  }

  generateAmortisationReport(): void {
    this.amortisationReport$.next([...this.getMonthlyInstallments()]);
  }


  getReportColumns(): { field: string, displayName: string }[] {
    return [
      { field: 'startingBalance', displayName: 'Starting Balance' },
      { field: 'principalPaid', displayName: 'Principal Paid' },
      { field: 'interestPaid', displayName: 'Interest Paid' },
      { field: 'emiAmount', displayName: 'EMI' },
      { field: 'partPaymentAmount', displayName: 'Part Payment' },
      { field: 'totalPaid', displayName: 'Total Paid' },
      { field: 'endingBalance', displayName: 'Ending Balance' },
    ]

  }


  /*
  ==========================================
  Monthly Install methods
  ==========================================
  */


  getMonthlyReportColumns(): any[] {
    return [
      { field: 'incrementalMonth', displayName: '# Month' },
      { field: 'paymentDate', displayName: 'Payment Date' },
      ...this.getReportColumns(),
      { field: 'interestRate', displayName: 'Interest Rate' },
      { field: 'paymentStatus', displayName: 'Status' },
      { field: 'dueDate', displayName: 'Due Date' },
      { field: 'remarks', displayName: 'Remarks' }
    ];
  }



  clear() {
    this.previousEndBalance = 0;
    this.previousEmi = 0;
    this.previousInterestRate = 0;
  }


  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + months);
    return result;
  }



  private calculateInterest(schedule: MonthlyInstallment): number {
    const monthlyRate = schedule.interestRate / 12 / 100;
    return (schedule.startingBalance - schedule.partPaymentAmount) * monthlyRate;
  }

  private calculatePrincipal(schedule: MonthlyInstallment): number {
    return schedule.emiAmount - schedule.interestPaid;
  }

  private calculateEndingBalance(schedule: MonthlyInstallment): number {
    return schedule.startingBalance - schedule.partPaymentAmount - schedule.principalPaid;
  }

  private calculateEMI(loan: LoanDetails): number {
    if (loan.roi === 0) {
      return loan.tenure > 0 ? Math.ceil(loan.principal / (loan.tenure * 12)) : 0;
    }
    const monthlyRate = loan.roi / 12 / 100;
    const totalMonths = loan.tenure * 12;
    const rateFactor = Math.pow(1 + monthlyRate, totalMonths);

    return Math.ceil(loan.principal * monthlyRate * (rateFactor / (rateFactor - 1)));
  }

  private getPaymentStatus(paymentDate: string | Date): 'PAID' | 'DUE' | 'UPCOMING' {
    const today = new Date();
    const payDate = new Date(paymentDate);
    
    const todayStr = today.toISOString().slice(0, 10);
    const payDateStr = payDate.toISOString().slice(0, 10);

    if (payDateStr === todayStr) return 'DUE';
    return payDateStr < todayStr ? 'PAID' : 'UPCOMING';
  }



  /*
  ==========================================
  Yearly calculations methods
  ==========================================
  */


  getYearlyReportColumns(): any[] {
    return [
      { field: 'fy', displayName: '# Financial Year' },
      { field: 'interestRate', displayName: 'Avg Interest Rate' },
      ...this.getReportColumns()
    ];
  }

  getFinancialYear = (currentEmiDate: Date): string => {
    const currentYear = currentEmiDate.getUTCMonth() < 3 ? currentEmiDate.getUTCFullYear() - 1 : currentEmiDate.getUTCFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };



  calculateAvg(yearlyData: YearlyInstallment, monthData: MonthlyInstallment) {
    return ((yearlyData.interestRate * yearlyData.fYearMonthlyData.length) + monthData.interestRate) / (yearlyData.fYearMonthlyData.length + 1) as number;
  }

  /*
========================
   row edit methods
   =========================
  */

  onRowEditInit(record: MonthlyInstallment) {
    const key = this.formatDateKey(record.paymentDate);
    if (key !== '') {
     this.clonedRows[key] = {
        key: key,
        emiAmount: record.emiAmount,
        partPaymentAmount: record.partPaymentAmount,
        interestRate: record.interestRate
      };
    }
  }

  onRowEditSave(record: MonthlyInstallment) {
    const key = this.formatDateKey(record.paymentDate);
    if (key !== '') {
      this.clonedRows[key] = {
        key: key,
        emiAmount: record.emiAmount,
        partPaymentAmount: record.partPaymentAmount,
        interestRate: record.interestRate
      };
    }
    this.generateAmortisationReport();
    this.cleanClonedRows();
  }

  // check if cloned rows are having any keys more than last payment date
  // if yes then remove those keys from cloned rows
  private cleanClonedRows(): void {
    // Get the latest payment date from the amortisation report
    const report = this.amortisationReport$.getValue();
    if (!report.length) return;

    const lastPaymentDate = report[report.length - 1].paymentDate;

    // Remove any clonedRows with a key greater than the last payment date
    Object.keys(this.clonedRows).forEach(key => {
      const keyDate = new Date(key);
      if (lastPaymentDate && keyDate > new Date(lastPaymentDate)) {
        delete this.clonedRows[key];
      }
    });
  }

  onRowEditCancel(record: MonthlyInstallment) {
    const key = this.formatDateKey(record.paymentDate);
    if (key !== '') {
      const record2 = { ...this.clonedRows[key] };
      delete this.clonedRows[key];
      return record2;
    }
    return null;
  }

  formatDateKey(date?: Date): string {
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toISOString().slice(0, 10)
      : '';
  }


}
