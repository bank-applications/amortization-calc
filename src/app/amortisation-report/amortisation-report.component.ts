import {Component, inject, OnInit} from '@angular/core';
import {LoanDetailsService} from "../services/loan-details.service";
import {TableModule, TableRowCollapseEvent, TableRowExpandEvent} from "primeng/table";
import {Button} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {FormsModule} from "@angular/forms";

import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {cardStyles, tableStyles} from "./amortisation-report-table.styles";
import {Card} from "primeng/card";

@Component({
  selector: 'amort-amortisation-report',
  imports: [
    TableModule,
    Button,
    Ripple,
    FormsModule,
    NgForOf,
    NgForOf,
    NgIf,
    DatePipe,
    Card
  ],
  templateUrl: './amortisation-report.component.html',
  styleUrl: './amortisation-report.component.css'
})
export class AmortisationReportComponent implements OnInit {
  data: any[] = []
  reportColumns = [{field: '', displayName: ''}];
  loanDetailsService: LoanDetailsService = inject(LoanDetailsService);
  expandedRows = {};
  protected readonly tableStyles = tableStyles;
  protected readonly cardStyles = cardStyles;
  customTableStyles = {'min-width': '60rem', 'border': '1px solid #ffffff29', 'border-radius': '6px'};

  ngOnInit(): void {
    this.reportColumns = this.loanDetailsService.getReportColumns();
    this.loanDetailsService.amortisationReport$.subscribe((res: any[]) => {
      this.data = res;
    });
  }

  onRowExpand(event: TableRowExpandEvent) {

  }

  onRowCollapse(event: TableRowCollapseEvent) {

  }


}
