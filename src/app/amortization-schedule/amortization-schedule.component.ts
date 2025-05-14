import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Schedule, YearlyTotal } from '../domain/amortization-domains';

@Component({
  selector: 'app-amortization-schedule',
  templateUrl: './amortization-schedule.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./amortization-schedule.component.css']
})
export class AmortizationScheduleComponent implements OnInit {
  @Input() schedule: any[] = [];
  @Input() yearlyTotals: YearlyTotal[] = [];
  collapsedYears: { [year: number]: boolean } = {};
  expandedIndex: number | null = null;


  ngOnInit(): void {
    const yearlyMap: Map<number, YearlyTotal> = new Map<number, YearlyTotal>(); // Use a dictionary for aggregation
    this.schedule.forEach((sc: Schedule) => {
      const year = parseInt(sc.year.split('-')[0]);
      let currentYear: YearlyTotal = yearlyMap.get(year) ?? {
        year: year,
        startingBalance: sc.startingBalance,
        totalPrincipalPaid: 0,
        totalInterestPaid: 0,
        totalEmiPaid: 0,
        totalPartPaymentPaid: 0,
        interestRate: 0,
        endingBalance: 0,
        months: []
      };

      // set fields
      currentYear.totalPrincipalPaid += sc.principalPaid;
      currentYear.totalInterestPaid += sc.interestPaid;
      currentYear.totalEmiPaid += sc.emiPaid;
      currentYear.totalPartPaymentPaid += sc.partPaymentPaid;
      currentYear.endingBalance = sc.endingBalance;
      currentYear.interestRate = sc.interestRate;
      currentYear.months.push(sc);
      yearlyMap.set(year, currentYear);
    });
    this.yearlyTotals = [...yearlyMap.values()];
  }

  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }

  toggleMonthlyData(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if already expanded
    } else {
      this.expandedIndex = index; // Expand the selected row
    }
  }
}
