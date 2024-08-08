import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormComponent } from './dashboard/form/form.component';
import { NgModule } from '@angular/core';

export  const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'form', component: FormComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
  ];

 