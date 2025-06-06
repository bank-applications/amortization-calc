import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { LoanDetailsService } from '../../services/loan-details.service';
import { LoanDetails } from '../../domain/loan-details-domain';
import { AmortisationReportComponent } from '../amortisation-report/amortisation-report.component';

interface QuickSummary {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  totalPayments: number;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'amort-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    DividerModule,
    DropdownModule,
    CurrencyPipe,
    AmortisationReportComponent
  ],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css'
})
export class LoanDetailsComponent implements OnInit {
  @Output() onCalculate = new EventEmitter<void>();
  loanForm!: FormGroup;
  showAdvanced = false;
  quickSummary: QuickSummary | null = null;

  private fb = inject(FormBuilder);
  public loanDetailsService = inject(LoanDetailsService);

  paymentFrequencies: DropdownOption[] = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Bi-Weekly', value: 'biweekly' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Semi-Annual', value: 'semiannual' },
    { label: 'Annual', value: 'annual' }
  ];

  loanTypes: DropdownOption[] = [
    { label: 'Fixed Rate', value: 'fixed' },
    { label: 'Variable Rate', value: 'variable' },
    { label: 'Interest Only', value: 'interest_only' },
    { label: 'Balloon Payment', value: 'balloon' },
    { label: 'FHA Loan', value: 'fha' },
    { label: 'VA Loan', value: 'va' },
    { label: 'Conventional', value: 'conventional' }
  ];

  ngOnInit() {
    this.initializeForm();
    this.setupFormValueChanges();
  }

  private initializeForm() {
    this.loanForm = this.fb.group({
      principal: [null, [Validators.required, Validators.min(1000), Validators.max(10000000)]],
      roi: [null, [Validators.required, Validators.min(0.1), Validators.max(30)]],
      tenure: [null, [Validators.required, Validators.min(1), Validators.max(50)]],
      startDate: [new Date(), Validators.required],
      paymentFrequency: ['monthly'],
      extraPayment: [0],
      loanType: ['fixed']
    });
  }

  private setupFormValueChanges() {
    this.loanForm.valueChanges.subscribe(values => {
      if (this.loanForm.valid && values.principal && values.roi && values.tenure) {
        this.calculateQuickSummary(values);
      } else {
        this.quickSummary = null;
      }
    });
  }

  private calculateQuickSummary(formValues: any) {
    const principal = formValues.principal;
    const annualRate = formValues.roi / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = formValues.tenure * 12;

    // Calculate monthly payment using standard loan formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalAmount = monthlyPayment * totalMonths;
    const totalInterest = totalAmount - principal;

    this.quickSummary = {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalPayments: totalMonths
    };
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  resetForm() {
    this.loanForm.reset();
    this.loanForm.patchValue({
      startDate: new Date(),
      paymentFrequency: 'monthly',
      extraPayment: 0,
      loanType: 'fixed'
    });
    this.quickSummary = null;
  }

  saveTemplate() {
    if (this.loanForm.valid) {
      // Implement save template logic
      console.log('Saving template...', this.loanForm.value);
      // You can integrate with your Firebase service here to save templates
    }
  }

  saveAndExport() {
    if (this.loanForm.valid) {
      // First calculate the loan
      this.onSubmitDetails();
      
      // Then implement export logic
      console.log('Exporting loan calculation...', this.loanForm.value);
      // You can integrate with your Firebase service here to export data
    }
  }

  onSubmitDetails() {
    if (this.loanForm.valid) {
      const formValue = this.loanForm.value;
      
      const loanDetails: LoanDetails = {
        principal: formValue.principal,
        roi: formValue.roi,
        tenure: formValue.tenure,
        startDate: formValue.startDate
      };

      try {
        // Set the loan details using the service's setter
        this.loanDetailsService.loanDetails = loanDetails;
        
        // Generate the amortization report
        this.loanDetailsService.generateAmortisationReport();
        
        console.log('Loan calculation completed successfully:', loanDetails);
        
        this.onCalculate.emit();

        // Optional: Subscribe to the amortization report to get the results
        this.loanDetailsService.amortisationReport$.subscribe(report => {
          if (report && report.length > 0) {
            console.log('Amortization report generated:', report);
            // You can add any additional logic here when the report is ready
          }
        });

              this.onCalculate.emit();

      } catch (error) {
        console.error('Error calculating loan details:', error);
  }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loanForm.controls).forEach(key => {
        this.loanForm.get(key)?.markAsTouched();
      });
}
  }
}
