export interface MonthlyInstallment {
  dueDate: string;               // e.g., '2025-05-10' (ISO date)
  incrementalMonth: number;         // e.g., 1,2,3,4,5
  startingBalance: number;       // Outstanding balance at start of month
  principalPaid: number;         // Principal paid this month
  interestPaid: number;          // Interest paid this month
  interestRate: number;          // Monthly interest rate (%)
  emiAmount: number;             // Scheduled EMI (excluding part payment)
  partPaymentAmount: number;     // Any extra part payment made
  totalPaid: number;             // Total = emiAmount + partPaymentAmount

  endingBalance: number;         // Remaining principal at month end

  paymentStatus: 'PAID' | 'DUE' | 'UPCOMING'; // Current payment state
  paymentDate: Date;          // Optional: actual payment date
  remarks?: string;              // Optional: notes or comments
}
