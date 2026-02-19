import {Routes} from '@angular/router';
import {AmortisationDashboardComponent} from "./components/amortisation-dashboard/amortisation-dashboard.component";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from '../auth.guard';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';

export const routes: Routes = [
  {path: 'dashboard', component: AmortisationDashboardComponent, canActivate: [authGuard]},
  {path: 'profit-loss', component: ProfitLossComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];
