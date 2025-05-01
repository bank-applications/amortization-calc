import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoanCalculatorComponent } from "./loan-calculator/loan-calculator.component";
import { FilterByYearPipe } from './filter-by-year.pipe';
import {HeaderComponent} from "./header/header.component";
import {BodyComponent} from "./body/body.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, BodyComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Home loan Amortization Calculator';
}
