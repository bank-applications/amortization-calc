import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoanDetailsService } from '../../services/loan-details.service';
import { FireBaseService } from '../../services/fire-base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface YearGroup {
  year: string;
  items: any[];
  openingBalance: number;
  totalEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPartPayment: number;
  closingBalance: number;
  totalPaid: number;
  expanded: boolean;
}

@Component({
  selector: 'app-amortisation-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './amortisation-dashboard.component.html',
  styleUrl: './amortisation-dashboard.component.css'
})
export class AmortisationDashboardComponent {
  loanService = inject(LoanDetailsService);
  firebaseService = inject(FireBaseService);

  isConfigOpen = true;
  isSummaryOpen = false;
  showEditModal = false;
  editingItem: any = null;

  toggleConfig() {
    this.isConfigOpen = !this.isConfigOpen;
    if (this.isConfigOpen) {
      this.isSummaryOpen = false;
    }
  }

  toggleSummary() {
    this.isSummaryOpen = !this.isSummaryOpen;
    if (this.isSummaryOpen) {
      this.isConfigOpen = false;
    }
  }

  toggleGroup(group: YearGroup) {
    group.expanded = !group.expanded;
  }

  groupedSchedule$: Observable<YearGroup[]> = this.loanService.amortisationReport$.pipe(
    map(installments => {
      const groups: { [key: string]: YearGroup } = {};
      installments.forEach(item => {
        const date = new Date(item.paymentDate ?? new Date());
        const year = this.loanService.getFinancialYear(date);
        if (!groups[year]) {
          groups[year] = {
            year,
            items: [],
            openingBalance: item.startingBalance,
            totalEmi: 0,
            totalPrincipal: 0,
            totalInterest: 0,
            totalPartPayment: 0,
            closingBalance: 0,
            totalPaid: 0,
            expanded: false
          };
        }
        groups[year].items.push(item);
        groups[year].totalEmi += item.emiAmount;
        groups[year].totalPrincipal += item.principalPaid;
        groups[year].totalInterest += item.interestPaid;
        groups[year].totalPartPayment += item.partPaymentAmount;
        groups[year].totalPaid += item.totalPaid;
        groups[year].closingBalance = item.endingBalance;
      });

      const result = Object.values(groups).sort((a, b) => {
        const yearA = parseInt(a.year.split('-')[0]);
        const yearB = parseInt(b.year.split('-')[0]);
        return yearA - yearB;
      });
      // Expand the first year by default
      if (result.length > 0) result[0].expanded = true;
      return result;
    })
  );

  // Helper to bind date input (yyyy-MM-dd) to Date object
  get startDate(): string {
    if (!this.loanService.loanDetails?.startDate) return '';
    try {
      return new Date(this.loanService.loanDetails.startDate).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  set startDate(val: string) {
    if (this.loanService.loanDetails && val) {
      this.loanService.loanDetails.startDate = new Date(val);
    }
  }

  calculate() {
    this.loanService.generateAmortisationReport();
  }

  openEditModal(item: any) {
    // Create a shallow copy to avoid modifying the table directly before saving
    this.editingItem = { ...item };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItem = null;
  }

  saveEdit() {
    if (this.editingItem) {
      this.loanService.onRowEditSave(this.editingItem);
      this.closeEditModal();
    }
  }

  async saveChanges() {
    await this.firebaseService.saveChanges();
    alert('Changes saved successfully!');
  }
}