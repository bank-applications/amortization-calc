import { Component } from '@angular/core';
import { LoanDetailsComponent } from "../loan-details/loan-details.component";
import { AmortisationReportComponent } from "../amortisation-report/amortisation-report.component";
import { DrawerModule } from 'primeng/drawer';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'amort-amortisation-dashboard',
  standalone: true,
  imports: [
    LoanDetailsComponent,
    AmortisationReportComponent,
    DrawerModule,
    RouterModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CommonModule,
    CardModule
  ],
  templateUrl: './amortisation-dashboard.component.html',
  styleUrl: './amortisation-dashboard.component.css'
})
export class AmortisationDashboardComponent {
  drawerOpen = false;
  activeView = 'emi-calculator'; // Default to EMI calculator

  menuItems: MenuItem[] = [
    {
      label: 'EMI Calculator',
      icon: 'pi pi-calculator',
      command: () => this.setActiveView('emi-calculator'),
      styleClass: 'menu-item active-menu-item'
    },
    {
      label: 'Amortization',
      icon: 'pi pi-chart-bar',
      command: () => this.setActiveView('amortization'),
      styleClass: 'menu-item'
    },
    {
      label: 'Reports',
      icon: 'pi pi-file-pdf',
      command: () => this.setActiveView('reports'),
      styleClass: 'menu-item'
    },
    {
      label: 'Analyzers',
      icon: 'pi pi-chart-line',
      command: () => this.setActiveView('analyzers'),
      styleClass: 'menu-item'
    }
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateToProfile()
    },
    {
      label: 'Account Settings',
      icon: 'pi pi-cog',
      command: () => this.navigateToSettings()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  setActiveView(view: string) {
    this.activeView = view;
    this.onMenuItemClick();
  }

  navigateToProfile() {
    console.log('Navigate to profile');
  }

  navigateToSettings() {
    console.log('Navigate to settings');
  }

  logout() {
    console.log('Logout user');
  }

  onMenuItemClick() {
    if (window.innerWidth < 768) {
      this.drawerOpen = false;
    }
  }
}