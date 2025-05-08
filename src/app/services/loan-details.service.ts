import {Injectable} from '@angular/core';
import {LoanDetails} from "../domain/loan-details-domain";
import {BehaviorSubject} from "rxjs";
import {MonthlyInstallment} from "../domain/monthly-installment-domain";

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {

  amortisationReport$ = new BehaviorSubject<MonthlyInstallment[]>([]);

  private _loanDetails: LoanDetails = {
    principal: 0,
    roi: 0,
    tenure: 0,
    startDate: new Date()
  };

  constructor() {
    this.initializeAmortisationReport();
  }

  get loanDetails(): LoanDetails {
    return this._loanDetails;
  }

  set loanDetails(value: LoanDetails) {
    this._loanDetails = value;
    this.loanCalculation();
  }

  private initializeAmortisationReport(): void {
    const sampleInstallment: MonthlyInstallment = {
      dueDate: '2025-05-10',
      incrementalMonth: 1,
      startingBalance: 1203434,
      principalPaid: 1222,
      interestPaid: 123123,
      interestRate: 8.8,
      emiAmount: 46088,
      partPaymentAmount: 0,
      totalPaid: 46088,
      endingBalance: 10191,
      paymentStatus: 'UPCOMING',
      paymentDate: new Date('2025-05-10'),
      remarks: 'Upcoming Due'
    };

    this.amortisationReport$.next([sampleInstallment]);
  }

  loanCalculation(): void {
    const data: MonthlyInstallment[] = [
      {
        dueDate: '2025-05-10',
        incrementalMonth: 1,
        startingBalance: 1200000,
        principalPaid: 12000,
        interestPaid: 8800,
        interestRate: 8.8,
        emiAmount: 20800,
        partPaymentAmount: 0,
        totalPaid: 20800,
        endingBalance: 1188000,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-05-10'),
        remarks: 'Paid on time'
      },
      {
        dueDate: '2025-06-10',
        incrementalMonth: 2,
        startingBalance: 1188000,
        principalPaid: 12200,
        interestPaid: 8700,
        interestRate: 8.8,
        emiAmount: 20900,
        partPaymentAmount: 0,
        totalPaid: 20900,
        endingBalance: 1175800,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-06-10'),
        remarks: 'Paid early'
      },
      {
        dueDate: '2025-07-10',
        incrementalMonth: 3,
        startingBalance: 1175800,
        principalPaid: 12400,
        interestPaid: 8600,
        interestRate: 8.8,
        emiAmount: 21000,
        partPaymentAmount: 5000,
        totalPaid: 26000,
        endingBalance: 1163400,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-07-09'),
        remarks: 'Part payment included'
      },
      {
        dueDate: '2025-08-10',
        incrementalMonth: 4,
        startingBalance: 1163400,
        principalPaid: 12600,
        interestPaid: 8500,
        interestRate: 8.8,
        emiAmount: 21100,
        partPaymentAmount: 0,
        totalPaid: 21100,
        endingBalance: 1150800,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-08-10'),
        remarks: 'Regular payment'
      },
      {
        dueDate: '2025-09-10',
        incrementalMonth: 5,
        startingBalance: 1150800,
        principalPaid: 12800,
        interestPaid: 8400,
        interestRate: 8.8,
        emiAmount: 21200,
        partPaymentAmount: 0,
        totalPaid: 21200,
        endingBalance: 1138000,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-09-10'),
        remarks: 'On schedule'
      },
      {
        dueDate: '2025-10-10',
        incrementalMonth: 6,
        startingBalance: 1138000,
        principalPaid: 13000,
        interestPaid: 8300,
        interestRate: 8.8,
        emiAmount: 21300,
        partPaymentAmount: 0,
        totalPaid: 21300,
        endingBalance: 1125000,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-10-10'),
        remarks: 'Paid on time'
      },
      {
        dueDate: '2025-11-10',
        incrementalMonth: 7,
        startingBalance: 1125000,
        principalPaid: 13200,
        interestPaid: 8200,
        interestRate: 8.8,
        emiAmount: 21400,
        partPaymentAmount: 0,
        totalPaid: 21400,
        endingBalance: 1111800,
        paymentStatus: 'PAID',
        paymentDate: new Date('2025-11-10'),
        remarks: 'On track'
      },
      {
        dueDate: '2025-12-10',
        incrementalMonth: 8,
        startingBalance: 1111800,
        principalPaid: 13400,
        interestPaid: 8100,
        interestRate: 8.8,
        emiAmount: 21500,
        partPaymentAmount: 0,
        totalPaid: 21500,
        endingBalance: 1098400,
        paymentStatus: 'UPCOMING',
        paymentDate: undefined,
        remarks: 'Upcoming Due'
      },
      {
        dueDate: '2026-01-10',
        incrementalMonth: 9,
        startingBalance: 1098400,
        principalPaid: 13600,
        interestPaid: 8000,
        interestRate: 8.8,
        emiAmount: 21600,
        partPaymentAmount: 0,
        totalPaid: 21600,
        endingBalance: 1084800,
        paymentStatus: 'UPCOMING',
        paymentDate: undefined,
        remarks: 'Upcoming Due'
      },
      {
        dueDate: '2026-02-10',
        incrementalMonth: 10,
        startingBalance: 1084800,
        principalPaid: 13800,
        interestPaid: 7900,
        interestRate: 8.8,
        emiAmount: 21700,
        partPaymentAmount: 0,
        totalPaid: 21700,
        endingBalance: 1071000,
        paymentStatus: 'UPCOMING',
        paymentDate: undefined,
        remarks: 'Upcoming Due'
      }
    ];

    this.amortisationReport$.next(data);
  }

  getReportColumns(): any[] {
    return [
      {field: 'incrementalMonth', displayName: 'Chronological Month'},
      {field: 'dueDate', displayName: 'Due Date'},
      {field: 'startingBalance', displayName: 'Starting Balance'},
      {field: 'principalPaid', displayName: 'Principal Paid'},
      {field: 'interestPaid', displayName: 'Interest Paid'},
      {field: 'interestRate', displayName: 'Interest Rate'},
      {field: 'emiAmount', displayName: 'EMI'},
      {field: 'partPaymentAmount', displayName: 'Part Payment Amount'},
      {field: 'totalPaid', displayName: 'Total Paid'},
      {field: 'endingBalance', displayName: 'Ending Balance'},
      {field: 'paymentStatus', displayName: 'Payment Status'},
      {field: 'paymentDate', displayName: 'Payment Date'},
      {field: 'remarks', displayName: 'Remarks'}
    ]
  }


}
