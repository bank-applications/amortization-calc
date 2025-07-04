import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {DatePickerModule} from 'primeng/datepicker';
import {
  formElementStyles,
  loanDetailsCardStyles,
  startDateStyles,
  submitButtonStyles
} from "./loan-details-form.styles";
import {ButtonModule} from "primeng/button";
import {LoanDetailsService} from "../../services/loan-details.service";
import {LoanDetails} from "../../domain/loan-details-domain";
import {Card} from "primeng/card";

@Component({
  selector: 'amort-loan-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FloatLabel,
    ButtonModule,
    DatePickerModule,
    InputText,
    Card
  ],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css'
})
export class LoanDetailsComponent implements OnInit {
  
  protected readonly formElementStyles = formElementStyles;
  protected readonly submitButtonStyles = submitButtonStyles;
  protected readonly loanDetailsCardStyles = loanDetailsCardStyles;
  protected readonly startDateStyles = startDateStyles;

  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);

  loanForm!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      principal: [0, [Validators.required, Validators.min(1000)]],
      roi: [0, [Validators.required, Validators.min(0.1)]],
      tenure: [0, [Validators.required, Validators.min(1)]],
      startDate: [new Date(), Validators.required]
    });

  this.loanForm.setValue(this.loanDetailsService.loanDetails || {
    principal: 0,
    roi: 0,   
    tenure: 0,
    startDate: new Date()
  });
}

  onSubmitDetails(): void {
    if (this.loanForm.invalid) return;

    const formValue = this.loanForm.value;

    const loanDetails: LoanDetails = {
      principal: parseFloat(formValue.principal) ?? 0,
      roi: parseFloat(formValue.roi) ?? 0,
      tenure: parseFloat(formValue.tenure) ?? 0,
      startDate: formValue.startDate ?? new Date()
    };

    this.loanDetailsService.loanDetails = loanDetails;
    this.loanDetailsService.generateAmortisationReport();
  }

}