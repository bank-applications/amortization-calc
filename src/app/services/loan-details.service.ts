import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoanDetails } from '../domain/loan-details-domain';
import { MonthlyInstallment, YearlyInstallment } from '../domain/installment-domain';

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {
  amortisationReport$ = new BehaviorSubject<MonthlyInstallment[]>([]);
  private previousEndBalance = 0;
  private previousEmi = 0;
  private previousInterestRate = 0;


  clonedRows: { [s: string]: MonthlyInstallment } = {};

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

  generateAmortisationReport(): void {
    // clear local var
    this.clear();

    const totalInstallments: MonthlyInstallment[] = [];
    const currentMonth = this.firstMonth();
    totalInstallments.push(currentMonth);


    const totalMonths = this._loanDetails.tenure * 12;
    // calculate for next months
    for (let i = 2; i <= totalMonths; i++) {
      const nextMonth = new MonthlyInstallment();

      nextMonth.incrementalMonth = i;
      nextMonth.dueDate = this.addMonths(this._loanDetails.startDate, i - 1);
      nextMonth.paymentDate = nextMonth.dueDate;

      // set prev month calculated previousEndBalance  as current month starting balance
      nextMonth.startingBalance = this.previousEndBalance;

      // set edited values of emi, roi and partPayment otherwise set prev values for emi and roi and set partpay as zero
      const editedRecord = this.clonedRows[nextMonth.paymentDate ?.toDateString() as string];
      if (editedRecord) {
        const { emiAmount, interestRate, partPaymentAmount }: MonthlyInstallment = editedRecord;
        nextMonth.emiAmount = emiAmount;
        nextMonth.interestRate = interestRate;
        nextMonth.partPaymentAmount = partPaymentAmount;
      } else {
        nextMonth.emiAmount = this.previousEmi;
        nextMonth.interestRate = this.previousInterestRate
        nextMonth.partPaymentAmount = 0;
      }
      // calculated based on editable rows
      nextMonth.interestPaid = this.calculateInterest(nextMonth);
      // check interest calculated is more emi
      if (nextMonth.interestPaid > nextMonth.emiAmount) {
        nextMonth.emiAmount = this.calculateEMI({
          ...this.loanDetails,
          roi: nextMonth.interestRate,
          tenure: ((this.loanDetails.tenure * 12) - totalInstallments.length) / 12,
        } as LoanDetails)
      }
      nextMonth.principalPaid = this.calculatePrincipal(nextMonth);
      nextMonth.endingBalance = this.calculateEndingBalance(nextMonth);

      nextMonth.paymentStatus = this.getPaymentStatus(nextMonth.paymentDate);
      nextMonth.remarks = `Installment for month ${i}`;
      nextMonth.totalPaid = nextMonth.emiAmount + nextMonth.partPaymentAmount;

      // set values for next installment calculation
      this.previousEndBalance = nextMonth.endingBalance;
      this.previousEmi = nextMonth.emiAmount;
      this.previousInterestRate = nextMonth.interestRate;

      // Stop if loan is paid off
      if (nextMonth.endingBalance <= 0) {
        nextMonth.endingBalance = 0;
        totalInstallments.push(nextMonth);
        break;
      }

      totalInstallments.push(nextMonth);
    }


    this.amortisationReport$.next([...totalInstallments]);

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


  private firstMonth(): MonthlyInstallment {
    const firstMonth = new MonthlyInstallment();
    const loan = this._loanDetails;

    firstMonth.incrementalMonth = 1;
    firstMonth.dueDate = loan.startDate;
    firstMonth.paymentDate = loan.startDate;
    firstMonth.startingBalance = this.calculateStartingBalance();
    firstMonth.interestRate = loan.roi;
    firstMonth.emiAmount = this.calculateEMI(loan);
    firstMonth.partPaymentAmount = 0;
    firstMonth.totalPaid = firstMonth.emiAmount;
    firstMonth.interestPaid = this.calculateInterest(firstMonth);
    firstMonth.principalPaid = this.calculatePrincipal(firstMonth);
    firstMonth.endingBalance = this.calculateEndingBalance(firstMonth);
    firstMonth.paymentStatus = this.getPaymentStatus(firstMonth.paymentDate);
    firstMonth.remarks = 'First month payment.';

    // set first month values
    this.previousEndBalance = firstMonth.endingBalance;
    this.previousEmi = firstMonth.emiAmount;
    this.previousInterestRate = firstMonth.interestRate;
    return firstMonth;
  }

  clear() {
    this.previousEndBalance = 0;
    this.previousEmi = 0;
    this.previousInterestRate = 0;
  }


  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }


  private calculateStartingBalance(): number {
    return this.previousEndBalance || this._loanDetails.principal;
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
    const monthlyRate = loan.roi / 12 / 100;
    const totalMonths = loan.tenure * 12;
    const rateFactor = Math.pow(1 + monthlyRate, totalMonths);

    return Math.ceil(loan.principal * monthlyRate * (rateFactor / (rateFactor - 1)));
  }

  private getPaymentStatus(paymentDate: string | Date): 'PAID' | 'DUE' | 'UPCOMING' {
    const today = new Date();
    const payDate = new Date(paymentDate);
    today.setHours(0, 0, 0, 0);
    payDate.setHours(0, 0, 0, 0);

    if (payDate.getTime() === today.getTime()) return 'DUE';
    return payDate < today ? 'PAID' : 'UPCOMING';
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
    const currentYear = currentEmiDate.getMonth() < 3 ? currentEmiDate.getFullYear() - 1 : currentEmiDate.getFullYear();
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
    this.clonedRows[record.incrementalMonth as number] = { ...record };
  }

  onRowEditSave(record: MonthlyInstallment) {
    console.log('onRowEditSave called', record);
    this.clonedRows[record.paymentDate?.toDateString() as string] = record;
    this.generateAmortisationReport();
  }

  onRowEditCancel(record: MonthlyInstallment) {
    const record2 = { ...this.clonedRows[record.incrementalMonth as number] };
    delete this.clonedRows[record.incrementalMonth as number];
    return record2;
  }

}
