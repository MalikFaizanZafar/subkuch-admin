import { Component, OnInit } from '@angular/core';
// import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

import { FranchiseSalesService } from '../../services/franchiseSales.service';
import { DataService } from '@app/shared/services/data.service';

const today: Date = new Date();
const lastMonth: Date = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1 );
@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: any = [];
  loading = false;
  fromDate: Date = lastMonth;
  toDate: Date = today;

  get total() {
    return this.sales.reduce((a, b) => a + b.total, 0);
   }
 
   get discount() {
     return this.sales.reduce((a, b) => a + b.discount, 0);
   }
 
   get netTotal() {
     return this.total - this.discount;
   }

  constructor(
    private franchiseSalesService: FranchiseSalesService, 
    private dataService: DataService) {}

  ngOnInit() {
    this.populateSalesInfo();  
  }

  onSearch() {
    this.populateSalesInfo();
  }

  private populateSalesInfo() {
    this.loading = true;
    const fromDate = `${this.fromDate.getFullYear()}-${this.fromDate.getMonth() + 1}-${this.fromDate.getDate()}`;
    const toDate = `${this.toDate.getFullYear()}-${this.toDate.getMonth() + 1}-${this.toDate.getDate()}`;
    this.franchiseSalesService.getSales(this.dataService.franchiseId, fromDate, toDate)
      .pipe(finalize(() => this.loading = false))
      .subscribe(responseData => {
      this.sales = responseData.data;
    });
  }
}
