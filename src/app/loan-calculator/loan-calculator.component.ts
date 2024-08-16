import { ApplicationConfig, Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AmortizationScheduleComponent } from '../amortization-schedule/amortization-schedule.component';
import { ISchedule, LoanForm, Schedule } from '../domain/amortization-domains';
import { ApplicationService } from '../application.service';
import { ValidationService } from '../validation.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, AmortizationScheduleComponent, ReactiveFormsModule],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent implements OnInit{
  loanForm: FormGroup;
  schedule: Schedule[] = [];
  ischeduleMap: Map<number, ISchedule> = new Map<number, ISchedule>();
  collapsedYears: { [year: number]: boolean } = {}; 
  isCollapsedForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private validationService: ValidationService,
    private userService: UserService
  ) {
    this.loanForm = this.createLoanForm();
  }

  ngOnInit(): void {
    this.ischeduleMap = this.userService.getIScheduleMap();  // Fetch schedule map
    this.calculateAmortization();  // Initial calculation
  }

 

  // Initialize form group with controls and validators
  private createLoanForm(): FormGroup {
    return this.fb.group({
      principal: [5000000, [Validators.required, Validators.min(1)]],
      annualRate: [6.6, [Validators.required, Validators.min(0), Validators.max(100)]],
      years: [25, [Validators.required, Validators.min(1), Validators.max(50)]],
      startDate: [new Date('2022-02-02').toISOString().substring(0, 10), Validators.required]
    });
  }

  // Getter for easy access to form controls
  get f(): { [key: string]: AbstractControl } {
    return this.loanForm.controls;
  }

  // Retrieve validation alerts
  get alerts() {
    return this.validationService.alerts;
  }

  // Clear specific alert
  clearAlerts(alertToRemove: { type: string; message: string }) {
    this.validationService.removeAlert(alertToRemove);
  }

  // Toggle form collapse
  toggleCollapseForm() {
    this.isCollapsedForm = !this.isCollapsedForm;
  }

  // Toggle year collapse in the amortization schedule
  toggleCollapse(year: number) {
    this.collapsedYears[year] = !this.collapsedYears[year];
  }

  // Clear default values on form field focus
  clearDefaultValue(controlName: string) {
    const control = this.f[controlName];
    if (control.value === this.applicationService.getDefaultValue(controlName)) {
      control.setValue('');
    }
  }

  // Calculate amortization schedule
  calculateAmortization() {
    this.validationService.checkValidations(this.f); // Check for validation errors

    if (this.loanForm.invalid) return; // Exit if form is invalid

    const loanForm: LoanForm = this.loanForm.value;
    loanForm.startDate = new Date(loanForm.startDate);
    
    let prevScheduleElement = this.getInitialSchedule();
    this.schedule = [];

    while (prevScheduleElement.endingBalance >= 0) {
     
      const currentSchedule = this.applicationService.getCurrentMonthSchedule(
        prevScheduleElement,
        loanForm,
        this.ischeduleMap
      );

      this.schedule.push(currentSchedule);
      prevScheduleElement = currentSchedule;
    }

    this.finalizeSchedule();

    this.validationService.alerts.push({ type: 'success', message: 'Amortization calculation successful!' });
    this.toggleCollapseForm();
  }

  // Get initial schedule object
  private getInitialSchedule(): Schedule {
    return {
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
    };
  }

  // Finalize schedule: adjust the last month's ending balance
  private finalizeSchedule() {
    const lastSchedule = this.schedule[this.schedule.length - 1];
    if (lastSchedule && lastSchedule.endingBalance < 0) {
      lastSchedule.endingBalance = 0;
    }
  }
}
