import {Routes} from '@angular/router';
import {AmortisationDashboardComponent} from "./components/amortisation-dashboard/amortisation-dashboard.component";

export const routes: Routes = [
  {path: 'dashboard', component: AmortisationDashboardComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
];

