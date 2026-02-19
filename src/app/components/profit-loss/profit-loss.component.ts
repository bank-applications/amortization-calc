import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDetailsService } from '../../services/loan-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit-loss.component.html',
  styleUrl: './profit-loss.component.css'
})
export class ProfitLossComponent implements OnInit, OnDestroy {
  loanService = inject(LoanDetailsService);
  
  modifiedRows: any[] = [];
  totalProfitLoss = 0;
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.loanService.amortisationReport$.subscribe(() => {
      this.calculateProfitLoss();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculateProfitLoss() {
    const currentSchedule = this.loanService.getMonthlyInstallments();
    // Calculate original schedule (without any edits) for comparison
    const originalSchedule = this.loanService.calculateAmortization(this.loanService.loanDetails, {});
    
    const modifications: any[] = [];
    
    // Calculate total interest saved over the entire loan duration
    const currentTotalInterest = currentSchedule.reduce((sum, item) => sum + item.interestPaid, 0);
    const originalTotalInterest = originalSchedule.reduce((sum, item) => sum + item.interestPaid, 0);
    this.totalProfitLoss = originalTotalInterest - currentTotalInterest;

    const allClonedRows = this.loanService.clonedRows;

    // Iterate through current schedule to find rows that were manually modified
    currentSchedule.forEach((currentItem, index) => {
      const key = this.loanService.formatDateKey(currentItem.paymentDate);
      
      // Check if this row exists in the clonedRows (meaning it was edited) or if it is the first month
      if (allClonedRows[key] || index === 0) {
        const originalItem = originalSchedule[index];
        const paymentDate = new Date(currentItem.paymentDate ?? new Date());
        
        // Calculate projected scenario:
        // What if we only apply edits up to this point and ignore any future edits?
        const tempClonedRows: { [s: string]: any } = {};
        Object.keys(allClonedRows).forEach(k => {
          if (k <= key) {
            tempClonedRows[k] = allClonedRows[k];
          }
        });

        const projectedSchedule = this.loanService.calculateAmortization(this.loanService.loanDetails, tempClonedRows);
        const projectedTotalInterest = projectedSchedule.reduce((sum, item) => sum + item.interestPaid, 0);
        const projectedTotalPayment = this.loanService.loanDetails.principal + projectedTotalInterest;
        const projectedProfitLoss = originalTotalInterest - projectedTotalInterest;
        
        const percentageChange = originalTotalInterest !== 0 ? (projectedProfitLoss / originalTotalInterest) * 100 : 0;
        const remainingMonths = Math.max(0, projectedSchedule.length - (index + 1));

        modifications.push({
          year: paymentDate.getFullYear(),
          month: paymentDate.toLocaleString('default', { month: 'short' }),
          emi: currentItem.emiAmount,
          interestRate: currentItem.interestRate,
          partPayment: currentItem.partPaymentAmount,
          totalPayment: projectedTotalPayment,
          totalInterest: projectedTotalInterest,
          profitLoss: projectedProfitLoss,
          percentageChange: percentageChange,
          remainingTenureLabel: this.formatTenure(remainingMonths),
          // Helper to check if interest rate was changed
          isRateChanged: originalItem ? currentItem.interestRate !== originalItem.interestRate : false,
          isPast: paymentDate < new Date()
        });
      }
    });

    this.modifiedRows = modifications;
  }

  formatTenure(months: number): string {
    if (months === 0) return '0 Months';
    const years = Math.floor(months / 12);
    const m = months % 12;

    let parts = [];
    if (years > 0) parts.push(`${years} Yr${years > 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} Mo${m > 1 ? 's' : ''}`);

    return parts.join(' ');
  }
}