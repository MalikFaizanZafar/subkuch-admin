import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../../services/userDetails.service';
import { MemberDetails } from '../../models/vendor-members';
import { EditMainService } from '../../services/editMain.service';
declare const google: any;

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user: MemberDetails;
  isEditingMode: boolean = false;

  constructor(
    private userDetailsService : UserDetailsService, 
    private editMainService : EditMainService) { }

  ngOnInit() {
    let userId = localStorage.getItem('user');
    this.userDetailsService.getUserDetails(userId).pipe().subscribe(ud => {
      this.user = ud.data
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Current Position is : ', position.coords)
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
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
