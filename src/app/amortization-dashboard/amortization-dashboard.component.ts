import { Component } from '@angular/core';
import {LoanDetailsComponent} from "../loan-details/loan-details.component";

@Component({
  selector: 'amort-amortization-dashboard',
  standalone: true,
  imports: [
    LoanDetailsComponent
  ],
  templateUrl: './amortization-dashboard.component.html',
  styleUrl: './amortization-dashboard.component.css'
})
export class AmortizationDashboardComponent {

}
