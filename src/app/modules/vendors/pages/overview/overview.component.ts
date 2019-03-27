import { Component, OnInit } from '@angular/core';
import { MemberDetails } from '../../models/vendor-members';
import { EditMainService } from '../../services/editMain.service';
import { FranchiseInfoService } from '../../services/franchiseInfo.service';
declare const google: any;

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user: MemberDetails;
  isEditingMode: boolean = false;
  franchiseInfo : any = {}

  constructor(
    private franchiseInfoService : FranchiseInfoService, 
    private editMainService : EditMainService) { }

  async ngOnInit() {
    await this.franchiseInfoService.getFranchiseInfo(1).subscribe(responseData => {
      this.franchiseInfo = responseData.data
      let Authorization = localStorage.getItem('Authorization');
      console.log('Authorization : ', Authorization)
    })
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     console.log('Current Position is : ', position.coords)
    //   });
    // } else {
    //   alert("Geolocation is not supported by this browser.");
    // }
  }

  setEditingMode() {
    this.isEditingMode = true;
    this.editMainService.editEnable.next(true);
  }
  cancelEditing() {
    console.log('changes canceled');
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
  }
  overviewEditedHandler(){
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
    // this.editMainService.editFalse();
  }
}
