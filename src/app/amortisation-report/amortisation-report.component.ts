import { Component, inject, OnInit } from '@angular/core';
import { LoanDetailsService } from "../services/loan-details.service";
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from "primeng/table";
import { Button } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { FormsModule } from "@angular/forms";

import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { cardStyles, tableStyles } from "./amortisation-report-table.styles";
import { Card } from "primeng/card";
import { MonthlyInstallment, YearlyInstallment } from '../domain/installment-domain';
import { CeilPipe } from "../ceil.pipe";

@Component({
  selector: 'amort-amortisation-report',
  imports: [
    TableModule,
    Button,
    Ripple,
    FormsModule,
    DatePipe,
    Card,
    CeilPipe
  ],
  templateUrl: './amortisation-report.component.html',
  styleUrl: './amortisation-report.component.css'
})
export class AmortisationReportComponent implements OnInit {
  YearlyInstallmentList: YearlyInstallment[] = [];

  reportMonthlyReportColumns: Column[] = [];
  reportYearlyReportColumns: Column[] = [];
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  expandedRows = {};
  protected readonly tableStyles = tableStyles;
  protected readonly cardStyles = cardStyles;
  customTableStyles = { 'min-width': '60rem', 'border': '1px solid #ffffff29', 'border-radius': '1px' };

  ngOnInit(): void {
    this.reportMonthlyReportColumns = this.loanDetailsService.getMonthlyReportColumns();
    this.reportYearlyReportColumns = this.loanDetailsService.getYearlyReportColumns();

    this.loanDetailsService.amortisationReport$.subscribe((res: MonthlyInstallment[]) => {
      console.log(`amortization report component recieved with size: ${res.length}`)

      //clear 
      this.YearlyInstallmentList = [];

      // segregate the montly installements by year
      res.forEach((monthData: MonthlyInstallment) => {
        const fyear: string = this.loanDetailsService.getFinancialYear(monthData.dueDate);
        const index = this.YearlyInstallmentList.findIndex(fYearData => fYearData.fy === fyear);
        let yearlyData = new YearlyInstallment();
        if (index !== -1) {
          yearlyData = this.YearlyInstallmentList[index];

          yearlyData.emiAmount += monthData.emiAmount;
          yearlyData.interestPaid += monthData.interestPaid;
          yearlyData.principalPaid += monthData.principalPaid;
          yearlyData.totalPaid += monthData.totalPaid;
          yearlyData.partPaymentAmount += monthData.partPaymentAmount;
          yearlyData.endingBalance = monthData.endingBalance;
          yearlyData.interestRate = this.loanDetailsService.calculateAvg(yearlyData, monthData);
          


        } else {
          yearlyData.fy = fyear;
          yearlyData.startingBalance = monthData.startingBalance;
          yearlyData.emiAmount = monthData.emiAmount;
          yearlyData.interestPaid = monthData.interestPaid;
          yearlyData.principalPaid = monthData.principalPaid;
          yearlyData.interestRate = monthData.interestRate;
          yearlyData.totalPaid = monthData.totalPaid;
          yearlyData.partPaymentAmount = monthData.partPaymentAmount;
          yearlyData.endingBalance = monthData.endingBalance;

          this.YearlyInstallmentList.push(yearlyData);
        }
        yearlyData.fYearMonthlyData.push(monthData);
      });

      console.log(this.YearlyInstallmentList)
    });
  }

  onRowExpand(event: TableRowExpandEvent) {
    const currentFY = event.data.fy;

    // Collapse all and expand only the current one
    this.expandedRows = this.YearlyInstallmentList.reduce((acc: { [key: string]: boolean }, row) => {
      acc[row.fy] = row.fy === currentFY;
      return acc;
    }, {});
    console.log(this.expandedRows);
  }

  onRowCollapse(event: TableRowCollapseEvent) {

  }

}


export interface Column {
  field: string,
  displayName: string,
}