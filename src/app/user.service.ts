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

    this.ischeduleMap.set(33, { month: 33, interestRate: 0, emiPaid: 0, partPaymentPaid: 100000 });
    this.ischeduleMap.set(38, { month: 38, interestRate: 9.0, emiPaid: 0, partPaymentPaid: 500000 });
    this.ischeduleMap.set(50, { month: 50, interestRate: 10.0, emiPaid: 0, partPaymentPaid: 500000 });
    this.ischeduleMap.set(62, { month: 62, interestRate: 9.0, emiPaid: 0, partPaymentPaid: 500000 });
    this.ischeduleMap.set(74, { month: 74, interestRate: 11.0, emiPaid: 0, partPaymentPaid: 0 });
    this.ischeduleMap.set(86, { month: 86, interestRate: 0, emiPaid: 0, partPaymentPaid: 0 });










    
   }

   getIScheduleMap(): Map<number, ISchedule> {
    return this.ischeduleMap;
  }
}
