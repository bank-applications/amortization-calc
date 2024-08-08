import { Component } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AmortizationScheduleComponent } from '../amortization-schedule/amortization-schedule.component';
import { YearlyTotal } from '../domain/yearly-total';



@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, AmortizationScheduleComponent, ReactiveFormsModule],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent {
  loanForm: FormGroup;
  schedule: any[] = [];
  yearlyTotals: YearlyTotal[] = []; // Use the interface here
  alerts: { type: string, message: string }[] = [];
  collapsedYears: { [year: number]: boolean } = {}; // To manage collapse state


  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.group({
      principal: [5000000, [Validators.required, Validators.min(1)]],
      annualRate: [6.6, [Validators.required, Validators.min(0), Validators.max(100)]],
      years: [25, [Validators.required, Validators.min(1), Validators.max(50)]],
      startDate: [new Date('02-02-2022').toISOString().substring(0, 10), Validators.required]
    });
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

  
  calculateAmortization() {
    this.checkValidations(); // Check for form validation errors

    // If form is invalid, return early
    if (this.loanForm.invalid) {
      return;
    }

    this.alerts = []; // Clear previous alerts

    
  const values = this.loanForm.value;
  const monthlyRate = values.annualRate / 100 / 12;
  const totalPayments = values.years * 12;
  const monthlyPayment = (values.principal * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -totalPayments));
  
  const schedule = [];
  const yearlyTotals: { [key: number]: YearlyTotal } = {}; // Use a dictionary for aggregation
  let balance = values.principal;
  let currentDate = new Date(values.startDate);

  for (let i = 1; i <= totalPayments; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    const startingBalance = balance;
    balance -= principal;

    // Calculate financial year and month
    const month = currentDate.getMonth() + 1;
    const year = this.getFinancialYear(currentDate);

    // Add to schedule
    schedule.push({
      month: i,
      year: year,
      monthName: this.getMonthName(month),
      startingBalance: startingBalance.toFixed(2),
      principal: principal.toFixed(2),
      interest: interest.toFixed(2),
      balance: balance.toFixed(2)
    });

    // Aggregate values for the financial year
      if (!yearlyTotals[year]) {
        yearlyTotals[year] = {
          year: year,
          totalPrincipal: 0,
          totalInterest: 0,
          startingBalance: '',
          endingBalance: ''
        };
      }

      yearlyTotals[year].totalPrincipal += parseFloat(principal.toFixed(2));
      yearlyTotals[year].totalInterest += parseFloat(interest.toFixed(2));
      yearlyTotals[year].startingBalance = startingBalance.toFixed(2);
      yearlyTotals[year].endingBalance = balance.toFixed(2);

    // Increment month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  this.schedule = schedule;
  this.yearlyTotals = Object.values(yearlyTotals);
  console.log( this.yearlyTotals)

  // Success alert
  this.alerts.push({ type: 'success', message: 'Amortization calculation successful!' });

  
 
  }

  getFinancialYear(date: Date): number {
    const year = date.getFullYear();
    return date.getMonth() < 6 ? year - 1 : year; // Assuming financial year starts in July
  }
  

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  }

  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }
}
