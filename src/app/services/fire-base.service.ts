import { inject, Injectable } from '@angular/core';
import { LoanDetailsService } from './loan-details.service';
import { User } from 'firebase/auth';
import { AmortizationInstallment, FireBaseDoc } from '../domain/firebase-domain';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, deleteDoc, addDoc, doc, DocumentData, DocumentReference, updateDoc, Timestamp } from '@angular/fire/firestore';

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

  async loadUserLoanDetails(): Promise<void> {
    // get the current user
    const userId = this.getStoredUser()?.uid;
    if (!userId) {
      console.error('No user is currently logged in.');
    }
    // Query Firestore for the user's loan details
    const loanDetailsQuery = query(
      collection(this.firestore, 'loanDetails'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(loanDetailsQuery);
    if (querySnapshot.empty) {
      console.warn('No loan details found for the current user.');
    }
    querySnapshot.forEach(doc => {
      const data = doc.data() as FireBaseDoc;
      // Convert Firestore Timestamp to JS Date if needed
      const loanDetails = { ...data.loanDetails,  startDate : data.loanDetails.startDate.toDate() };
      this.loanDetailsService.loanDetails = loanDetails;
      data.modifiedInstallments.forEach((installment: AmortizationInstallment, index: number) => {
        this.loanDetailsService.clonedRows[installment.key] = {
          key: installment.key,
          emiAmount: installment.emiAmount,
          partPaymentAmount: installment.partPaymentAmount,
          interestRate: installment.interestRate
        };
      });
      this.loanDetailsService.generateAmortisationReport();
    });
  }

  getStoredUser(): User | null {
    return this.currentUser;
  }

  async saveChanges(): Promise<void> {
    const userId = this.getStoredUser()?.uid;
    const recordsToSave: AmortizationInstallment[] = [];
    Object.entries(this.loanDetailsService.clonedRows).forEach(([key, value]) => {
      const record: AmortizationInstallment = {
        emiAmount: value.emiAmount,
        partPaymentAmount: value.partPaymentAmount,
        interestRate: value.interestRate,
        key: key
      };
      recordsToSave.push(record);
    });

    const firebaseTransDomain: FireBaseDoc = {
      loanDetails: {...this.loanDetailsService.loanDetails, startDate: Timestamp.fromDate(this.loanDetailsService.loanDetails.startDate)},
      modifiedInstallments: recordsToSave,
      userId: userId || '',
      analysisId: userId || '',
    };

    // Save to Firestore if record exists, otherwise add a new document with the userId

    try {
      const loanDetailsRef = collection(this.firestore, 'loanDetails');
      const existingDocQuery = query(
        loanDetailsRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(existingDocQuery);

      if (querySnapshot.empty) {
        // No existing document, create a new one
        await addDoc(loanDetailsRef, firebaseTransDomain);
      } else {
        // Update the existing document
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(this.firestore, 'loanDetails', docId), { ...firebaseTransDomain })

      }
    } catch (error) {
      console.error('Error saving changes to Firestore:', error);
    }


  }

  exportCSV(): void {
    // Implement your logic to export data as CSV, e.g., using a library or custom logic
    
  }
}

