import { Component, inject, OnInit } from '@angular/core';
import { LoanDetailsService } from "../../services/loan-details.service";
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from "primeng/table";
import { Button } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { FormsModule } from "@angular/forms";

import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { cardStyles, tableStyles } from "./amortisation-report-table.styles";
import { Card } from "primeng/card";
import { ToolbarModule } from "primeng/toolbar";
import { MonthlyInstallment, YearlyInstallment } from '../../domain/installment-domain';
import { FireBaseService } from '../../services/fire-base.service';

@Component({
  selector: 'amort-amortisation-report',
  imports: [
    TableModule,
    Button,
    Ripple,
    FormsModule,
    DatePipe,
    Card,
    ToolbarModule
  ],
  templateUrl: './amortisation-report.component.html',
  styleUrl: './amortisation-report.component.css'
})
export class AmortisationReportComponent implements OnInit {
  YearlyInstallmentList: YearlyInstallment[] = [];


  reportMonthlyReportColumns: Column[] = [];
  reportYearlyReportColumns: Column[] = [];
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  fireBaseServices: FireBaseService = inject(FireBaseService);

  expandedRows = {};
  protected readonly tableStyles = tableStyles;
  protected readonly cardStyles = cardStyles;
  customTableStyles = { 'min-width': '60rem', 'border': '1px solid #ffffff29', 'border-radius': '1px' };

  ngOnInit(): void {
    this.reportMonthlyReportColumns = this.loanDetailsService.getMonthlyReportColumns();
    this.reportYearlyReportColumns = this.loanDetailsService.getYearlyReportColumns();

    this.loanDetailsService.amortisationReport$.subscribe((res: MonthlyInstallment[]) => {

      console.log(res);

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

    });
  }

  onRowExpand(event: TableRowExpandEvent) {
    const currentFY = event.data.fy;

    // Collapse all and expand only the current one
    this.expandedRows = this.YearlyInstallmentList.reduce((acc: { [key: string]: boolean }, row) => {
      acc[row.fy] = row.fy === currentFY;
      return acc;
    }, {});
  }

  onRowCollapse(event: TableRowCollapseEvent) {

  }

  onRowEditInit(record: MonthlyInstallment) {
    this.loanDetailsService.onRowEditInit(record);
  }

  onRowEditSave(record: MonthlyInstallment) {
    this.loanDetailsService.onRowEditSave(record);
  }

  onRowEditCancel(record: MonthlyInstallment, index: number, fyear: string) {
    console.log('onRowEditCancel called', record, index);
    const yearIndex = this.YearlyInstallmentList.findIndex(yData => yData.fy === fyear);
    if (yearIndex != -1) {
      this.YearlyInstallmentList[yearIndex].fYearMonthlyData[index] = this.loanDetailsService.onRowEditCancel(record)?? record;
    }
  }

  saveChanges(event: Event) {
    this.fireBaseServices.saveChanges(event, this.YearlyInstallmentList);
  }

  exportCSV(event: Event) {
    this.fireBaseServices.exportCSV(event, this.YearlyInstallmentList);
  }

}


export interface Column {
  field: string,
  displayName: string,
}

export interface EditMonthlyRow {
  interestRate: number,
  emi: number;
  partPayment: number;
  month: number;
} 