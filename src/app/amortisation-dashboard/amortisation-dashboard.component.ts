import { Component } from '@angular/core';
import {LoanDetailsComponent} from "../loan-details/loan-details.component";
import {AmortisationReportComponent} from "../amortisation-report/amortisation-report.component";

@Component({
  selector: 'amort-amortisation-dashboard',
  standalone: true,
  imports: [
    LoanDetailsComponent,
    AmortisationReportComponent
  ],
  templateUrl: './amortisation-dashboard.component.html',
  styleUrl: './amortisation-dashboard.component.css'
})
export class AmortisationDashboardComponent {

}
