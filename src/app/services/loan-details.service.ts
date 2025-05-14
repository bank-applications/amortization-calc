import {Injectable} from '@angular/core';
import {LoanDetails} from "../domain/loan-details-domain";
import {BehaviorSubject} from "rxjs";
import {MonthlyInstallment} from "../domain/monthly-installment-domain";

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {

  amortisationReport$ = new BehaviorSubject<MonthlyInstallment[]>([]);

  private _loanDetails: LoanDetails = {
    principal: 0,
    roi: 0,
    tenure: 0,
    startDate: new Date()
  };

  constructor() {
  }

  get loanDetails(): LoanDetails {
    return this._loanDetails;
  }

  set loanDetails(value: LoanDetails) {
    this._loanDetails = value;
    this.loanCalculation();
  }

  loanCalculation(): void {
    const {principal, roi, tenure, startDate} = this.loanDetails;
    const monthlyRate = roi / 12 / 100;
    const tenureInMonths = tenure * 12;
    const emi = this.calculateEMI(principal, monthlyRate, tenureInMonths);
    const installments: MonthlyInstallment[] = [];

    let balance = principal;
    let currentDate = new Date(startDate);
    const today = new Date();

    for (let i = 1; i <= tenureInMonths; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      const partPayment = 0;
      const totalPaid = emi + partPayment;
      const endingBalance = Math.max(0, balance - principalPaid - partPayment);

      const status =
        currentDate < today ? 'PAID' :
          currentDate.toDateString() === today.toDateString() ? 'DUE' : 'UPCOMING';

      installments.push({
        dueDate: new Date(currentDate),
        incrementalMonth: i,
        startingBalance: Math.round(balance),
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interest),
        interestRate: parseFloat((monthlyRate * 100).toFixed(2)),
        emiAmount: Math.round(emi),
        partPaymentAmount: partPayment,
        totalPaid: Math.round(totalPaid),
        endingBalance: Math.round(endingBalance),
        paymentStatus: status,
        paymentDate: status === 'PAID' ? new Date(currentDate) : undefined,
        remarks: status === 'UPCOMING' ? 'Upcoming Due' : status === 'DUE' ? 'Due Today' : 'Paid'
      });

      balance = endingBalance;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    this.amortisationReport$.next(installments);
  }

  calculateEMI(principal: number, monthlyRate: number, tenure: number): number {
    if (monthlyRate === 0) return principal / tenure;
    const factor = Math.pow(1 + monthlyRate, tenure);
    return principal * monthlyRate * factor / (factor - 1);
  }

  isExactlyOneMonthApart(date1: Date, date2: Date): boolean {
    const adjusted = new Date(date1);
    adjusted.setMonth(adjusted.getMonth() + 1);

    return (
      adjusted.getFullYear() === date2.getFullYear() &&
      adjusted.getMonth() === date2.getMonth() &&
      adjusted.getDate() === date2.getDate()
    );
  }

  getReportColumns(): any[] {
    return [
      {field: 'incrementalMonth', displayName: 'Chronological Month'},
      {field: 'dueDate', displayName: 'Due Date'},
      {field: 'startingBalance', displayName: 'Starting Balance'},
      {field: 'principalPaid', displayName: 'Principal Paid'},
      {field: 'interestPaid', displayName: 'Interest Paid'},
      {field: 'interestRate', displayName: 'Interest Rate'},
      {field: 'emiAmount', displayName: 'EMI'},
      {field: 'partPaymentAmount', displayName: 'Part Payment Amount'},
      {field: 'totalPaid', displayName: 'Total Paid'},
      {field: 'endingBalance', displayName: 'Ending Balance'},
      {field: 'paymentStatus', displayName: 'Payment Status'},
      {field: 'paymentDate', displayName: 'Payment Date'},
      {field: 'remarks', displayName: 'Remarks'}
    ]
  }


}
