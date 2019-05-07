import { Component, OnInit } from '@angular/core';
import { FranchiseSalesService } from '../../services/franchiseSales.service';

@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales: any = [];
  constructor(private franchiseSalesService: FranchiseSalesService) {}

  async ngOnInit() {
    await this.franchiseSalesService.getSales(1).subscribe(responseData => {
      this.sales = responseData.data;
    });
  }
}
