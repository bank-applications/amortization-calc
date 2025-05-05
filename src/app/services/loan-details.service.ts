import {Injectable} from '@angular/core';
import {LoanDetails} from "../domain/loan-details-domain";

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {

  private _loanDetails: LoanDetails = {
    principal: 0,
    roi: 0,
    tenure: 0,
    startDate: new Date()
  };

  constructor() {
  }

  get loanDetails(): LoanDetails {
    return this._loanDetails;
  }

  set loanDetails(value: LoanDetails) {
    this._loanDetails = value;
    this.loanCalculation();
  }

  loanCalculation(): void {

  }
}
