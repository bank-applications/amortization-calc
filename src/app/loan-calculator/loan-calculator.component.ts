import { Component } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AmortizationScheduleComponent } from '../amortization-schedule/amortization-schedule.component';
import { Schedule } from '../domain/amortization-domains';



@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, AmortizationScheduleComponent, ReactiveFormsModule],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent {
  loanForm: FormGroup;
  schedule: Schedule[] = [];
  alerts: { type: string, message: string }[] = [];
  collapsedYears: { [year: number]: boolean } = {}; // To manage collapse state
  isCollapsedForm: boolean = false;

  toggleCollapseForm() {
    this.isCollapsedForm = !this.isCollapsedForm;
  }


  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.group({
      principal: [5000000, [Validators.required, Validators.min(1)]],
      annualRate: [6.6, [Validators.required, Validators.min(0), Validators.max(100)]],
      years: [25, [Validators.required, Validators.min(1), Validators.max(50)]],
      startDate: [new Date('02-02-2022').toISOString().substring(0, 10), Validators.required]
    });

    this.calculateAmortization();
  }


  get f() {
    return this.loanForm.controls as { [key: string]: AbstractControl };
  }
  removeAlert(alertToRemove: { type: string, message: string }) {
    this.alerts = this.alerts.filter(alert => alert !== alertToRemove);
  }

  getDefaultValue(controlName: string): any {
    switch (controlName) {
      case 'principal':
        return 0;
      case 'annualRate':
        return 0;
      case 'years':
        return 0;
      case 'startDate':
        return new Date().toISOString().substring(0, 10);
      default:
        return '';
    }
  }

  // Method to clear default values on focus
  clearDefaultValue(controlName: string) {
    const control = this.f[controlName];
    if (control.value === this.getDefaultValue(controlName)) {
      control.setValue('');
    }
  }

  checkValidations() {
    this.alerts = []; // Clear previous alerts

    Object.keys(this.f).forEach(key => {
      const control = this.f[key];

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

  calculateEmi = (interestRate: number, loanPeriod: number, loanAmount: number) => {
    const roi: number = interestRate / 12 / 100;
    const nom: number = 12 * loanPeriod;
    const rateVariable: number = Math.pow(1 + roi, nom);
    return Math.round(
      loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
  }

  setEmiDatails(sch: Schedule) {
    const { principal, annualRate, years } = this.loanForm.value;
    const emi = this.calculateEmi(annualRate, years, principal);
    const roi: number = annualRate / 12 / 100;
    const interestPaid = sch.startingBalance * roi;
    const principalPaid = emi - interestPaid;
    const endingBalance = sch.startingBalance - principalPaid;
    sch.emiPaid = emi;
    sch.interestPaid = interestPaid;
    sch.principalPaid = principalPaid;
    sch.endingBalance = endingBalance;
  }

  pushFirstElement() {
    const { principal, annualRate, startDate } = this.loanForm.value;
    const sDate = new Date(startDate);
    const fYear = this.getFinancialYear(sDate);
    const mName = this.getMonthName(sDate.getMonth());
    const sch: Schedule = {
      startingBalance: principal,
      month: 1,
      year: fYear,
      monthName: mName,
      principalPaid: 0,
      interestPaid: 0,
      interestRate: annualRate,
      emiPaid: 0,
      partPaymentPaid: 0,
      endingBalance: 0
    };
    this.setEmiDatails(sch);
    this.schedule.push(sch);
  }

  pushRemainingElements(index: number) {
    const prevElement: Schedule = this.schedule[index];
    const { startDate } = this.loanForm.value;
    const nextMonthDate = new Date(startDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + prevElement.month)
    const fYear = this.getFinancialYear(nextMonthDate);
    const mName = this.getMonthName(nextMonthDate.getMonth());

    const currentElement: Schedule = {
      month: prevElement.month + 1,
      year: fYear,
      monthName: mName,
      startingBalance: prevElement.endingBalance,
      principalPaid: 0,
      interestPaid: 0,
      interestRate: prevElement.interestRate,
      emiPaid: 0,
      partPaymentPaid: 0,
      endingBalance: 0
    };
    this.setEmiDatails(currentElement);
    this.schedule.push(currentElement);
  }


  calculateAmortization() {
    this.checkValidations(); // Check for form validation errors
    // If form is invalid, return early
    if (this.loanForm.invalid) {
      return;
    }
    this.alerts = []; // Clear previous alerts
    const { startDate } = this.loanForm.value;
    // push first element
    this.pushFirstElement();
    for (let index = 0; this.schedule[this.schedule.length - 1].endingBalance > 0; index++) {
      if (!this.schedule.length) {
        break;
      }
      this.pushRemainingElements(index);
    }

    this.alerts.push({ type: 'success', message: 'Amortization calculation successful!' }); // Success alert
    this.toggleCollapseForm()
  }

  getFinancialYear = (currentEmiDate: Date): string => {
    const currentYear = currentEmiDate.getMonth() < 3 ? currentEmiDate.getFullYear() - 1 : currentEmiDate.getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }

  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }
}
