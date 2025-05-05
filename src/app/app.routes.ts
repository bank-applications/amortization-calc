import {Routes} from '@angular/router';
import {FormComponent} from './dashboard/form/form.component';
import {AmortisationDashboardComponent} from "./amortisation-dashboard/amortisation-dashboard.component";

export const routes: Routes = [
  {path: 'dashboard', component: AmortisationDashboardComponent},
  // {path: 'dashboard', component: DashboardComponent},
  {path: 'form', component: FormComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
];

