import { Component, OnInit, inject } from '@angular/core';
import { LoanDetailsService } from '../../services/loan-details.service';
import { LoanDetailsComponent } from "../loan-details/loan-details.component";
import { AmortisationReportComponent } from "../amortisation-report/amortisation-report.component";

@Component({
  selector: 'amort-amortisation-dashboard',
  standalone: true,
  templateUrl: './amortisation-dashboard.component.html',
  styleUrls: ['./amortisation-dashboard.component.css'],
  imports: [LoanDetailsComponent, AmortisationReportComponent]
})
export class AmortisationDashboardComponent implements OnInit {
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  ngOnInit(): void {
    this.loanDetailsService.generateAmortisationReport();
  }
}
