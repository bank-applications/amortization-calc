import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";

@Component({
  selector: 'amort-loan-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css'
})
export class LoanDetailsComponent {
  formGroup = new FormGroup({
    principal: new FormControl(0, [Validators.minLength(2), Validators.required]),
    roi: new FormControl(0, [Validators.minLength(1), Validators.required]),
    tenure: new FormControl(0, [Validators.minLength(1), Validators.required]),
    startDate: new FormControl(new Date(), Validators.required)
  });
  value: string = 'Test';
}
