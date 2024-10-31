import { Injectable } from '@angular/core';
import { ISchedule } from './domain/amortization-domains';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private ischeduleMap: Map<number, ISchedule> = new Map<number, ISchedule>();


  constructor() {
    this.ischeduleMap.set(4, { month: 4, interestRate: 7.00, emiPaid: 0, partPaymentPaid: 0 });
    this.ischeduleMap.set(7, { month: 7, interestRate: 8.00, emiPaid: 0, partPaymentPaid: 0 });
    this.ischeduleMap.set(10, { month: 10, interestRate: 8.50, emiPaid: 40318, partPaymentPaid: 0 });
    this.ischeduleMap.set(13, { month: 13, interestRate: 9.10, emiPaid: 0, partPaymentPaid: 0 });
    this.ischeduleMap.set(16, { month: 16, interestRate: 8.35, emiPaid: 0, partPaymentPaid: 500000 });
    this.ischeduleMap.set(19, { month: 19, interestRate: 0, emiPaid: 0, partPaymentPaid: 200000 });
    this.ischeduleMap.set(20, { month: 20, interestRate: 0, emiPaid: 0, partPaymentPaid: 100000 });
    this.ischeduleMap.set(23, { month: 23, interestRate: 0, emiPaid: 0, partPaymentPaid: 100000 });
    this.ischeduleMap.set(26, { month: 26, interestRate: 0, emiPaid: 0, partPaymentPaid: 200000 });
    this.ischeduleMap.set(30, { month: 30, interestRate: 0, emiPaid: 0, partPaymentPaid: 300000 });
    this.ischeduleMap.set(32, { month: 32, interestRate: 0, emiPaid: 0, partPaymentPaid: 100000 });

    this.ischeduleMap.set(33, { month: 33, interestRate: 0, emiPaid: 0, partPaymentPaid: 300000 });

    // Assumptopns

    const partPay = 300000;
    //25-26
    this.ischeduleMap.set(49, { month: 49, interestRate: 0, emiPaid: 0, partPaymentPaid: partPay });
    //26-27
    this.ischeduleMap.set(61, { month: 61, interestRate: 0, emiPaid: 0, partPaymentPaid: partPay });
    //27-28
    this.ischeduleMap.set(73, { month: 73, interestRate: 0, emiPaid: 0, partPaymentPaid: partPay });
    //28-29
    this.ischeduleMap.set(85, { month: 85, interestRate: 0, emiPaid: 0, partPaymentPaid: partPay });


    // this.ischeduleMap.set(40, { month: 40, interestRate: 0, emiPaid: 50000, partPaymentPaid: 0 });
    // this.ischeduleMap.set(44, { month: 44, interestRate: 0, emiPaid: 0, partPaymentPaid: 200000 });
    // this.ischeduleMap.set(49, { month: 49, interestRate: 9.0, emiPaid: 0, partPaymentPaid: 300000 });

    // this.ischeduleMap.set(52, { month: 52, interestRate: 0, emiPaid: 0, partPaymentPaid: 200000 });
    // this.ischeduleMap.set(56, { month: 56, interestRate: 0, emiPaid: 0, partPaymentPaid: 0 });
    // this.ischeduleMap.set(60, { month: 60, interestRate: 9.0, emiPaid: 0, partPaymentPaid: 300000 });
    // this.ischeduleMap.set(63, { month: 63, interestRate: 0, emiPaid: 0, partPaymentPaid: 300000 });
    // this.ischeduleMap.set(67, { month: 67, interestRate: 0, emiPaid: 0, partPaymentPaid: 0 });











  }

  getIScheduleMap(): Map<number, ISchedule> {
    return this.ischeduleMap;
  }
}
