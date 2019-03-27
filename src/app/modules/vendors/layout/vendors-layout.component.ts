import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { MemberDetails } from '../models/vendor-members';
import { UserDetailsService } from '../services/userDetails.service';
import { EditMainService } from '../services/editMain.service';
import { FranchiseInfoService } from '../services/franchiseInfo.service';

@Component({
  selector: 'app-vendors-layout',
  templateUrl: './vendors-layout.component.html',
  styleUrls: ['./vendors-layout.component.scss']
})
export class VendorsLayoutComponent implements OnInit {
  @HostBinding() class: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  user: MemberDetails;
  editBtnEnabled: boolean;
  ratingArray: string[];
  autoGenerateLinks = [
    {
      label: 'Overview',
      icon: 'fa-table',
      link: 'overview/',
    },
    {
      icon: 'fa-bars',
      label: 'Deals',
      link: 'deals/'
    },
    {
      icon: 'fa-bars',
      label: 'Meals',
      link: 'meals/'
    },
    {
      icon: 'fa-bars',
      label: 'Orders',
      link: 'orders/'
    },{
      icon: 'fa-bars',
      label: 'Franchise',
      link: 'franchise/'
    },{
      icon: 'fa-bars',
      label: 'Sales',
      link: 'sales/'
    }
  ]
  franchiseInfo : any = {}
  constructor(private router : Router, private franchiseInfoService : FranchiseInfoService, private userDetailsService: UserDetailsService, private editMainService: EditMainService) { }

  async ngOnInit() {
    let userId = localStorage.getItem('user')
    await this.franchiseInfoService.getFranchiseInfo(1).subscribe(responseData => {
      this.franchiseInfo = responseData.data
      console.log('franchiseInfo is : ', this.franchiseInfo)
    })
    this.userDetailsService.getUserDetails(userId).pipe().subscribe(ud => {
      this.user = ud.data
      this.ratingArray = new Array(this.user.companyRating)
      this.ratingArray.fill('0')
    })
    this.editMainService.editEnable.subscribe(val => {
      this.editBtnEnabled = val
    })
  }

  logoutHandler() {
    localStorage.clear()
    this.user = {}
    this.router.navigate(['auth'])
  }
}
