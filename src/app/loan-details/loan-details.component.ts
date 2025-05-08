import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {DatePickerModule} from 'primeng/datepicker';
import {formElementStyles, loanDetailsCardStyles, submitButtonStyles} from "./loan-details-form.styles";
import {ButtonModule} from "primeng/button";
import {LoanDetailsService} from "../services/loan-details.service";
import {LoanDetails} from "../domain/loan-details-domain";
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
  formGroup = new FormGroup({
    principal: new FormControl(100000000, [Validators.minLength(2), Validators.required]),
    roi: new FormControl(8.8, [Validators.minLength(1), Validators.required]),
    tenure: new FormControl(30, [Validators.minLength(1), Validators.required]),
    startDate: new FormControl(new Date(), Validators.required)
  });
  value: string = 'Test';
  protected readonly formElementStyles = formElementStyles;
  protected readonly submitButtonStyles = submitButtonStyles;
  protected readonly loanDetailsCardStyles = loanDetailsCardStyles;

  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);

  ngOnInit(): void {
  }

  onSubmitDetails(): void {
    this.loanDetailsService.loanDetails = this.formGroup.value as LoanDetails;
  }

}
