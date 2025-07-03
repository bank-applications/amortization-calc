import { Component, inject, OnInit } from '@angular/core';
import { LoanDetailsComponent } from "../loan-details/loan-details.component";
import { AmortisationReportComponent } from "../amortisation-report/amortisation-report.component";
import { ChartModule } from 'primeng/chart';
import { LoanDetailsService } from '../../services/loan-details.service';
import { MonthlyInstallment } from '../../domain/installment-domain';
import { MeterGroup } from 'primeng/metergroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'amort-amortisation-dashboard',
  standalone: true,
  imports: [
    LoanDetailsComponent,
    AmortisationReportComponent,
    ChartModule,
    MeterGroup,
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './amortisation-dashboard.component.html',
  styleUrl: './amortisation-dashboard.component.css'
})
export class AmortisationDashboardComponent implements OnInit {

  principalPaid: number = 0;
  interestPaid: number = 0;
  principalToBePaid: number = 0;
  interestToBePaid: number = 0;
  totalTenure: number = 0;
  completedTenure: number = 0;




  pieChartLoaded: boolean = false;


  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  data = {
    labels: ['PrincipalPaid','InterestPaid', 'InterestToBePaid', 'PrincipalToBePaid'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Amortisation Summary',
        fill: true,
        backgroundColor: ['#4CAF50', '#4CAF50', '#FFC107', '#FFC107'], // green, orange, green red, red orange
        hoverBackgroundColor: ['#388E3C', '#FF3D00', '#FF3D00', '#FFA000'] // principalPaid: dark green, interestPaid: red, interestToBePaid: red, principalToBePaid: dark orange
      }
    ]
  };
  options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Amount Summary',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          }
        }
      }
    }
  };

  tenureData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [0, 0],
        label: 'Amortisation Summary',
        fill: true,
        backgroundColor: ['#4CAF50', '#FFC107'], // green for completed, orange for remaining
        hoverBackgroundColor: ['#388E3C', '#FFA000'] // dark green for completed, dark orange for remaining
      }
    ]
  }
  tenureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tenure Summary'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            // Custom: Show principal/interest paid when hovering 'Completed'
            if (label === 'Completed') {
              return [
                `Completed: ${value} Months`,
                `Principal Paid: ₹${this.data.datasets[0].data[0].toLocaleString('en-IN')}`,
                `Interest Paid: ₹${this.data.datasets[0].data[1].toLocaleString('en-IN')}`
              ];
            }
            if (label === 'Remaining') {
              return [
                `Remaining: ${value} Months`,
                `Principal To Be Paid: ₹${this.data.datasets[0].data[3].toLocaleString('en-IN')}`,
                `Interest To Be Paid: ₹${this.data.datasets[0].data[2].toLocaleString('en-IN')}`
              ];
            }
            return `${value} Months`;
          },
          title: (context: any) => {
            // Custom title for tooltip
            return context[0]?.label === 'Completed' ? 'Completed Tenure Details' : 'Remaining Tenure Details';
          }
        }
      }
    }
  }

  ngOnInit(): void {

    this.totalTenure = (this.loanDetailsService.loanDetails?.tenure || 0) * 12;
    console.log('Total Tenure:', this.totalTenure);

    this.loanDetailsService.amortisationReport$.subscribe((res: MonthlyInstallment[]) => {
      let remaining: number = 0;
      if (res && res.length > 0) {
        res.forEach((item: MonthlyInstallment) => {
          console.log('trigger');
          if (item.paymentStatus === 'PAID') {
            this.principalPaid += (item.principalPaid + item.partPaymentAmount);
            this.interestPaid += item.interestPaid;
          }
          if (item.paymentStatus !== 'PAID') {
            remaining++;
            this.principalToBePaid += (item.principalPaid + item.partPaymentAmount);
            this.interestToBePaid += item.interestPaid;
          }
        });
      } else { }
      this.data.datasets[0].data = [
        Math.round(this.principalPaid),
        Math.round(this.interestPaid),
        Math.round(this.interestToBePaid),
        Math.round(this.principalToBePaid)
        
      ];
      this.pieChartLoaded = true;
      // tenure values
      this.tenureData.datasets[0].data = [this.totalTenure - remaining, remaining];
    });
  }

  loadPieChart(): void {
    // Update the chart data here if needed, or trigger chart refresh logic.
    // For now, this is a placeholder to resolve the error.
    // clean up previous values
    this.principalPaid = 0;
    this.interestPaid = 0;
    this.principalToBePaid = 0;
    this.interestToBePaid = 0;
  }




}
