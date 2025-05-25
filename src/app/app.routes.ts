import {Routes} from '@angular/router';
import {AmortisationDashboardComponent} from "./components/amortisation-dashboard/amortisation-dashboard.component";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {path: 'dashboard', component: AmortisationDashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];

