import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  alerts: { type: string, message: string }[] = [];

  constructor() { }

  removeAlert(alertToRemove: { type: string, message: string }) {
    this.alerts = this.alerts.filter(alert => alert !== alertToRemove);
  }

  clearAlerts() {
    this.alerts = [];
  }

  checkValidations(controls: { [key: string]: AbstractControl }) {
    this.clearAlerts(); // Clear previous alerts

    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.errors) {
        if (control.errors['required']) {
          this.alerts.push({ type: 'danger', message: `${this.getLabel(key)} is required.` });
        }
        if (control.errors['min']) {
          this.alerts.push({ type: 'danger', message: `${this.getLabel(key)} must be greater than ${control.errors['min'].min}.` });
        }
        if (control.errors['max']) {
          this.alerts.push({ type: 'danger', message: `${this.getLabel(key)} cannot exceed ${control.errors['max'].max}.` });
        }
      }
    });
  }

  getLabel(controlName: string): string {
    switch (controlName) {
      case 'principal':
        return 'Principal amount';
      case 'annualRate':
        return 'Annual interest rate';
      case 'years':
        return 'Loan term';
      case 'startDate':
        return 'Start date';
      default:
        return controlName;
    }
  }
}
