import { Timestamp } from "firebase/firestore";

export interface FireBaseDoc {
    loanDetails: LoanDetails;
    modifiedInstallments: AmortizationInstallment[];
    userId: string;        
    analysisId: string;      // User ID from Firebase
}

   
export interface AmortizationInstallment { 
    key: string;
    emiAmount: number;
    partPaymentAmount: number;
    interestRate: number;
}   

export interface LoanDetails {
  principal: number,
  roi: number,
  tenure: number,
  startDate: Timestamp
}
