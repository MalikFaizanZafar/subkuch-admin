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

  ngOnInit() {
    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.franchiseInfo = responseData.data;

      localStorage.setItem("franchiseId",this.franchiseInfo.id)
      if (!this.franchiseInfo.address) {
        this.setEditingMode();
      }
    })
  }

  get startTime() {
    const time = new Date(this.franchiseInfo.startTime);
    return `${time.getHours()}:00`
  }

  
  get endTime() {
    const time = new Date(this.franchiseInfo.endTime);
    return `${time.getHours()}:00`
  }

  setEditingMode() {
    this.isEditingMode = true;
    this.editMainService.editEnable.next(true);
  }
  
  cancelEditing() {
    
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
  }


  overviewEditedHandler() {
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
    // this.editMainService.editFalse();
  }
}
