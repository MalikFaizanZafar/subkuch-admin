import { Component, OnInit } from '@angular/core';
import { FranchiseDealsService } from '../../services/franchiseDeals.service';

@Component({
  selector: 'deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {
  deals: any = []
  constructor(private franchiseDealsService : FranchiseDealsService) { }

  async ngOnInit() {
    await this.franchiseDealsService.getDeals(1).subscribe(responseData => {
      this.deals = responseData.data
      // let Authorization = localStorage.getItem('Authorization');
      // console.log('Authorization : ', Authorization)
      // console.log('this.deals : ', this.deals)
    })
  }

}
