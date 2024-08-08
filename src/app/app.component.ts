import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoanCalculatorComponent } from "./loan-calculator/loan-calculator.component";
import { FilterByYearPipe } from './filter-by-year.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, DashboardComponent, LoanCalculatorComponent],
  providers: [FilterByYearPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amortization-calc';
}
