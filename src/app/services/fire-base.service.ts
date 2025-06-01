import { inject, Injectable } from '@angular/core';
import { LoanDetailsService } from './loan-details.service';

@Injectable({
  providedIn: 'root'

})
export class FireBaseService {

  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);


  constructor() { }


  saveChanges(event: Event, yearlyInstallmentList: any[]): void {
    Object.entries(this.loanDetailsService.clonedRows).forEach(([key, value]) => {
      console.log(`Key: ${key}, Value:`, value);
    });
  }

  exportCSV(event: Event, yearlyInstallmentList: any[]): void {
    // Implement your logic to export data as CSV, e.g., using a library or custom logic
    console.log('Exporting to CSV:', yearlyInstallmentList);
    console.log('event:', event);

  }
}
