import { LoanDetails } from "./loan-details-domain";

export interface FirebaseTransDomain {
    loanDetails: LoanDetails;
    modifiedInstallments: AmortizationInstallment[];
    userId: string;        
    analysisId: string;      // User ID from Firebase
}

   
export interface AmortizationInstallment { 
    emiAmount: number;
    partPaymentAmount: number;
    interestRate: number;
}   