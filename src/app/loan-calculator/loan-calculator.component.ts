import { ApplicationConfig, Component } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AmortizationScheduleComponent } from '../amortization-schedule/amortization-schedule.component';
import { ISchedule, LoanForm, Schedule } from '../domain/amortization-domains';
import { ApplicationService } from '../application.service';
import { ValidationService } from '../validation.service';



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
  ischeduleMap: Map<number, ISchedule> = new Map<number, ISchedule>();

  collapsedYears: { [year: number]: boolean } = {}; // To manage collapse state
  isCollapsedForm: boolean = false;
  firstSchedule: Schedule = {
    month: 0,
    year: '',
    monthName: '',
    startingBalance: 0,
    principalPaid: 0,
    interestPaid: 0,
    interestRate: 0,
    emiPaid: 0,
    partPaymentPaid: 0,
    endingBalance: 0
  }
  toggleCollapseForm() {
    this.isCollapsedForm = !this.isCollapsedForm;
  }

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private validationService: ValidationService
  ) {
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

  get alerts() {
    return this.validationService.alerts;
  }

  clearAlerts(alertToRemove: { type: string; message: string; }) {
    this.validationService.removeAlert(alertToRemove);
  }

  // Method to clear default values on focus
  clearDefaultValue(controlName: string) {
    const control = this.f[controlName];
    if (control.value === this.applicationService.getDefaultValue(controlName)) {
      control.setValue('');
    }
  }


  calculateAmortization() {
    this.validationService.checkValidations(this.f); // Check for form validation errors
    // If form is invalid, return early
    if (this.loanForm.invalid) {
      return;
    }
    const { principal, annualRate, startDate, years } = this.loanForm.value;
    const loanForm: LoanForm = { principal, annualRate, years, startDate: new Date(startDate) };
    let prevScheduleElement: Schedule = this.firstSchedule;

    while (prevScheduleElement.endingBalance > -1) {
      const currentSchedule = this.applicationService.getCurrentMonthSchedule(
        prevScheduleElement,
        loanForm,
        this.ischeduleMap.get(prevScheduleElement.month));
      this.schedule.push(currentSchedule);
      prevScheduleElement = currentSchedule;
      console.log(currentSchedule)
    }
    // clear last endBalance to 0
    if (this.schedule[this.schedule.length - 1].endingBalance < 0) {
      this.schedule[this.schedule.length - 1].endingBalance = 0;
    }
    this.validationService.alerts.push({ type: 'success', message: 'Amortization calculation successful!' }); // Success alert
    this.toggleCollapseForm()
  }

  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }
}
