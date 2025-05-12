

export class Installment {
  startingBalance: number = 0;       // Outstanding balance at start of month
  principalPaid: number = 0;         // Principal paid this month
  interestPaid: number = 0;          // Interest paid this month
  interestRate: number = 0;          // Monthly interest rate (%)
  emiAmount: number = 0;             // Scheduled EMI (excluding part payment)
  partPaymentAmount: number = 0;     // Any extra part payment made
  totalPaid: number = 0;             // Total = emiAmount + partPaymentAmount
  endingBalance: number = 0;         // Remaining principal at month end
}



export class MonthlyInstallment extends Installment{

  dueDate: Date = new Date();               // e.g., '2025-05-10' (ISO date)
  incrementalMonth: number = 1;         // e.g., 1,2,3,4,5  
  paymentStatus: 'PAID' | 'DUE' | 'UPCOMING' = 'PAID'; // Current payment state
  paymentDate?: Date;          // Optional: actual payment date
  remarks?: string;              // Optional: notes or comments
}




export class YearlyInstallment extends Installment{

  fy: string = '';
  fYearMonthlyData: MonthlyInstallment[] = [];
}