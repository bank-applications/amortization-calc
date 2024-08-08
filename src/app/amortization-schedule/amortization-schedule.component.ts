import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { YearlyTotal } from '../domain/yearly-total';

@Component({
  selector: 'app-amortization-schedule',
  templateUrl: './amortization-schedule.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./amortization-schedule.component.css']
})
export class AmortizationScheduleComponent {
  @Input() schedule: any[] = [];
  @Input() yearlyTotals: YearlyTotal[] = [];
  collapsedYears: { [year: number]: boolean } = {};

  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }
}
