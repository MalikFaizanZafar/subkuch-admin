import { Component, OnInit } from '@angular/core';
import { FranchiseInfoService } from '../../services/franchiseInfo.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  franchiseInfo: any = {};
  franchises = []
  constructor(private franchiseInfoService : FranchiseInfoService) { }

  ngOnInit() {
    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.franchiseInfo = responseData.data;
      if(this.franchiseInfo.isAdmin === true) {
        this.franchises = this.franchiseInfo.franchises
      }else {
        this.franchises = this.franchiseInfo.franchises
      }
      
      // console.log("this.franchiseInfo is : ", this.franchiseInfo)
      console.log("this.franchises  : ", this.franchises)
    });
  }

}
