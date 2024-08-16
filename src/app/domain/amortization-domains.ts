
// Define interface for yearly totals
export interface YearlyTotal {
    year: number;
    startingBalance: number;
    totalPrincipalPaid: number;
    totalInterestPaid: number;
    totalEmiPaid: number;
    totalPartPaymentPaid: number;
    interestRate: number;
    endingBalance: number;
    months: Schedule[];
  };

  export interface Schedule {
    month: number;
    year: string,
    monthName: string,
    startingBalance: number,
    principalPaid: number,
    interestPaid: number,
    interestRate: number,
    emiPaid: number
    partPaymentPaid: number
    endingBalance: number;
  }

  
  export interface LoanForm {
    principal: number;
    annualRate: number;
    years: number;
    startDate: Date
  }

  
  export interface ISchedule {
    month: number;
    interestRate: number;
    emiPaid: number;
    partPaymentPaid: number
  }