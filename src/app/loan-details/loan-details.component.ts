import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {LoanDetailsService} from "../services/loan-details.service";
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
      principal: [5000000, [Validators.required, Validators.min(1000)]],
      roi: [6.6, [Validators.required, Validators.min(0.1)]],
      tenure: [25, [Validators.required, Validators.min(1)]],
      startDate: [new Date('03-05-2022'), Validators.required]
    });
  }

  onSubmitDetails(): void {
    if (this.loanForm.invalid) return;
    this.loanDetailsService.saveLoanDetails(this.loanForm.value);
  }

}
