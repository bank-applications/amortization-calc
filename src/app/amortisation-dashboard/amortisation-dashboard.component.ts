import {Component, OnInit} from '@angular/core';
import {LoanDetailsComponent} from "../loan-details/loan-details.component";
import {AmortisationReportComponent} from "../amortisation-report/amortisation-report.component";
import {LoanDetailsService} from "../services/loan-details.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'amort-amortisation-dashboard',
  standalone: true,
  imports: [
    LoanDetailsComponent,
    AmortisationReportComponent,
    NgIf
  ],
  templateUrl: './amortisation-dashboard.component.html',
  styleUrl: './amortisation-dashboard.component.css'
})
export class AmortisationDashboardComponent implements OnInit {
  displayReport = false;

  constructor(private loanDetailsService: LoanDetailsService) {
  }

  ngOnInit() {
    this.loanDetailsService.amortisationReport$.subscribe((res) => {
      this.displayReport = res.length > 0;
    })
  }

}
