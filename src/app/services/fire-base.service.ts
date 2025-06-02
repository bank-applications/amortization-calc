import { inject, Injectable } from '@angular/core';
import { LoanDetailsService } from './loan-details.service';
import { User } from 'firebase/auth';
import { AmortizationInstallment, FirebaseTransDomain } from '../domain/firebase-domain';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, deleteDoc, addDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  private currentUser: User | null = null;

  // Inject AngularFire services
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  constructor() {
    // Listen for auth state changes
    this.auth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  async loadCurrentUser(): Promise<void> {
    this.currentUser = this.auth.currentUser;
  }

  getStoredUser(): User | null {
    return this.currentUser;
  }

  async saveChanges(event: Event, yearlyInstallmentList: any[]): Promise<void> {
    const userId = this.getStoredUser()?.uid;
    const recordsToSave: AmortizationInstallment[] = [];
    Object.entries(this.loanDetailsService.clonedRows).forEach(([key, value]) => {
      const record: AmortizationInstallment = {
        emiAmount: value.emiAmount,
        partPaymentAmount: value.partPaymentAmount,
        interestRate: value.interestRate
      };
      recordsToSave.push(record);
    });

    const firebaseTransDomain: FirebaseTransDomain = {
      loanDetails: this.loanDetailsService.loanDetails,
      modifiedInstallments: recordsToSave,
      userId: userId || '',
      analysisId: userId || '',
    };



  }

  exportCSV(event: Event, yearlyInstallmentList: any[]): void {
    // Implement your logic to export data as CSV, e.g., using a library or custom logic
    console.log('Exporting to CSV:', yearlyInstallmentList);
    console.log('event:', event);
  }
}