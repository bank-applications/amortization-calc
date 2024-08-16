import { Injectable } from '@angular/core';
import { ISchedule } from './domain/amortization-domains';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private ischeduleMap: Map<number, ISchedule> = new Map<number, ISchedule>();


  constructor() {
    this.ischeduleMap.set(10, { month: 10, interestRate: 5.0, emiPaid: 1000, partPaymentPaid: 200 });
    this.ischeduleMap.set(20, { month: 20, interestRate: 5.0, emiPaid: 1000, partPaymentPaid: 250 });
    
   }

   getIScheduleMap(): Map<number, ISchedule> {
    return this.ischeduleMap;
  }
}
