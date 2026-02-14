import { Component, inject, OnInit } from '@angular/core';
import { LoanDetailsService } from '../../services/loan-details.service';
import { AmortizationInstallment } from '../../domain/firebase-domain';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MonthlyInstallment } from '../../domain/installment-domain';

export interface AnalysisData extends AmortizationInstallment {
  interestImpact: number;
  tenureImpact: number;
  summary: {
    originalInterest: number;
    modifiedInterest: number;
    originalTenure: number;
    modifiedTenure: number;
  };
}

@Component({
  selector: 'amort-analysis-emi',
  imports: [CommonModule, TableModule],
  templateUrl: './analysis-emi.component.html',
  styleUrl: './analysis-emi.component.css'
})
export class AnalysisEmiComponent implements OnInit {
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  analysisData: AnalysisData[] = [];
  columns: any[] = [];

  ngOnInit(): void {
    const originalReport = this.loanDetailsService.getMonthlyInstallments();
    const clonedRows = this.loanDetailsService.clonedRows;

    this.analysisData = Object.keys(clonedRows).map(key => {
      const singleChange = { [key]: clonedRows[key] };
      const modifiedReport = this.loanDetailsService.getMonthlyInstallments();

      const originalInterest = originalReport.reduce((sum: number, item: MonthlyInstallment) => sum + item.interestPaid, 0);
      const modifiedInterest = modifiedReport.reduce((sum: number, item: MonthlyInstallment) => sum + item.interestPaid, 0);

      const interestImpact = originalInterest - modifiedInterest;
      const tenureImpact = originalReport.length - modifiedReport.length;

      return {
        ...clonedRows[key],
        interestImpact,
        tenureImpact,
        summary: {
          originalInterest,
          modifiedInterest,
          originalTenure: originalReport.length,
          modifiedTenure: modifiedReport.length
        }
      };
    });

    this.columns = [
      { field: 'key', header: 'Date' },
      { field: 'emiAmount', header: 'EMI Amount' },
      { field: 'partPaymentAmount', header: 'Part Payment' },
      { field: 'interestRate', header: 'Interest Rate' },
      { field: 'interestImpact', header: 'Interest Impact' },
      { field: 'tenureImpact', header: 'Tenure Impact (Months)' },
      { field: 'summary', header: 'Summary' }
    ];
  }
}
