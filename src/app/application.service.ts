import { Injectable } from '@angular/core';
import { ISchedule, LoanForm, Schedule } from './domain/amortization-domains';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  getDefaultValue(controlName: string): any {
    switch (controlName) {
      case 'principal':
        return 0;
      case 'annualRate':
        return 0;
      case 'years':
        return 0;
      case 'startDate':
        return new Date().toISOString().substring(0, 10);
      default:
        return '';
    }
  }


  getFinancialYear = (currentEmiDate: Date): string => {
    const currentYear = currentEmiDate.getMonth() < 3 ? currentEmiDate.getFullYear() - 1 : currentEmiDate.getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }

  getCurrentMonthSchedule(prevSchedule: Schedule, loanForm: LoanForm, ischeduleMap: Map<number, ISchedule>): Schedule {

    const sDate = new Date(loanForm.startDate);
    sDate.setMonth(sDate.getMonth() + prevSchedule.month )
    const year = this.getFinancialYear(sDate);
    const monthName = this.getMonthName(sDate.getMonth());
    const month = this.getCurrentMonth(prevSchedule);
    const startingBalance = this.getStartingBalance(prevSchedule, loanForm.principal);
    const emiPaid = this.getEmi(prevSchedule, loanForm, ischeduleMap.get(month) );
    const currentSchedule: Schedule = {
      ...prevSchedule, month, year, monthName, startingBalance, emiPaid
    };

    this.setEndBalance(currentSchedule, loanForm, ischeduleMap.get(month) );
    return currentSchedule;

  }
  setEndBalance(currentSchedule: Schedule, loanForm: LoanForm, iSchedule?: ISchedule) {

    // SET PART PAYMENT
    currentSchedule.partPaymentPaid = iSchedule?.partPaymentPaid ?? 0;

    // set annual-interest
    currentSchedule.interestRate = iSchedule?.interestRate ?? (currentSchedule.interestRate != 0 ? currentSchedule.interestRate : loanForm.annualRate);
    // calculate and set interest amount paid
    const roi: number = currentSchedule.interestRate / 12 / 100;
    currentSchedule.interestPaid = (currentSchedule.startingBalance - currentSchedule.partPaymentPaid) * roi;
    // check if interest to be paid more that emi
    if (currentSchedule.interestPaid > currentSchedule.emiPaid) {
      currentSchedule.emiPaid = this.calculateEmi(currentSchedule.interestRate, loanForm.years, loanForm.principal);
    }
    // set principal amount
    currentSchedule.principalPaid = currentSchedule.emiPaid - currentSchedule.interestPaid;
    // set endBalance
    currentSchedule.endingBalance = (currentSchedule.startingBalance - currentSchedule.partPaymentPaid) - currentSchedule.principalPaid;

  }

  getCurrentMonth(prevSchedule: Schedule) {
    return (prevSchedule.month + 1);
  }

  getStartingBalance(prevSchedule: Schedule, principal: number) {
    return prevSchedule.endingBalance == 0 ? principal : prevSchedule.endingBalance
  }

  getEmi(prevSchedule: Schedule, loanForm: LoanForm, iSchedule?: ISchedule) {
    return iSchedule && iSchedule.emiPaid ?
      iSchedule.emiPaid :
      (prevSchedule.emiPaid == 0 ?
        this.calculateEmi(loanForm.annualRate, loanForm.years, loanForm.principal) :
        prevSchedule.emiPaid
      );
  }


  calculateEmi = (interestRate: number, loanPeriod: number, loanAmount: number) => {
    const roi: number = interestRate / 12 / 100;
    const nom: number = 12 * loanPeriod;
    const rateVariable: number = Math.pow(1 + roi, nom);
    return Math.round(
      loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
  }

}
